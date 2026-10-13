"""Refresh the profile's contribution artwork and recent PRs from GitHub."""

import argparse
from datetime import datetime, timezone
from html import escape
import json
import os
from pathlib import Path
import re
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
QUERY = """query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount contributionLevel } }
      }
    }
  }
  search(query: "author:Anshuman791322 is:pr is:public sort:created-desc", type: ISSUE, first: 4) {
    nodes { ... on PullRequest { title url state repository { nameWithOwner isPrivate } } }
  }
}"""
LEVELS = {"NONE": 0, "FIRST_QUARTILE": 1, "SECOND_QUARTILE": 2,
          "THIRD_QUARTILE": 3, "FOURTH_QUARTILE": 4}


def fetch_activity():
    token = os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN")
    if not token:
        raise RuntimeError("Set GH_TOKEN or GITHUB_TOKEN, or pass --input with a GitHub GraphQL snapshot.")
    payload = {"query": QUERY, "variables": {"login": "Anshuman791322"}}
    request = Request("https://api.github.com/graphql", data=json.dumps(payload).encode(),
                      headers={"Authorization": f"Bearer {token}",
                               "Content-Type": "application/json",
                               "User-Agent": "Anshuman791322-profile"})
    with urlopen(request, timeout=30) as response:
        return json.load(response)


def graph_svg(calendar, dark, updated):
    bg, ink, muted = ("#0b1731", "#e5f0ff", "#aac7ec") if dark else ("#f5f9ff", "#12284b", "#42618a")
    colors = ["#172e50", "#224c8a", "#2563eb", "#60a5fa", "#bddcff"] if dark else ["#dce7f5", "#a6c9ff", "#6b9ff6", "#2563eb", "#1647a8"]
    weeks = calendar["weeks"]
    pitch, size = 16, 11
    x0, y0 = 36, 118
    width = max(920, x0 + len(weeks) * pitch + 36)
    cells, months = [], []
    last_month = None
    last_label_x = -100
    for week_index, week in enumerate(weeks):
        for day in week["contributionDays"]:
            date = datetime.strptime(day["date"], "%Y-%m-%d")
            weekday = (date.weekday() + 1) % 7
            x, y = x0 + week_index * pitch, y0 + weekday * pitch
            color = colors[LEVELS[day["contributionLevel"]]]
            label = escape(f"{day['date']}: {day['contributionCount']} contributions")
            cells.append(f'<rect x="{x}" y="{y}" width="{size}" height="{size}" rx="2" fill="{color}"><title>{label}</title></rect>')
            month_key = (date.year, date.month)
            if month_key != last_month:
                if x - last_label_x >= 40:
                    months.append(f'<text x="{x}" y="103">{date:%b}</text>')
                    last_label_x = x
                last_month = month_key
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} 282" role="img" aria-labelledby="title desc">
<title id="title">{calendar['totalContributions']:,} GitHub contributions in the last year</title>
<desc id="desc">Contribution calendar refreshed {updated}. Brighter blue cells indicate more contributions.</desc>
<style>
text{{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}}
.sweep{{stroke-dasharray:110 {width - 110};animation:travel 12s linear infinite}}
@keyframes travel{{to{{stroke-dashoffset:-{width}}}}}
@media(prefers-reduced-motion:reduce){{.sweep{{animation:none}}}}
</style>
<rect width="{width}" height="282" rx="12" fill="{bg}"/>
<text x="36" y="43" font-size="24" font-weight="650" fill="{ink}">A year of building</text>
<text x="36" y="70" font-size="15" fill="{muted}">{calendar['totalContributions']:,} contributions · refreshed {updated}</text>
<g font-size="12" fill="{muted}">{''.join(months)}</g>
{''.join(cells)}
<text x="36" y="258" font-size="12" fill="{muted}">GitHub contribution activity</text>
<text x="{width - 183}" y="258" font-size="12" fill="{muted}">Less</text>
{''.join(f'<rect x="{width - 148 + i * 16}" y="247" width="11" height="11" rx="2" fill="{color}"/>' for i, color in enumerate(colors))}
<text x="{width - 62}" y="258" font-size="12" fill="{muted}">More</text>
<path d="M0 281H{width}" stroke="#2563eb" stroke-opacity=".28"/>
<path class="sweep" d="M0 281H{width}" stroke="#60a5fa" stroke-width="2"/>
</svg>'''


def markdown_text(value):
    value = re.sub(r"\s+", " ", value).strip()
    return re.sub(r"([\\`*_{}\[\]<>])", r"\\\1", value)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=Path, help="Read an existing GraphQL JSON snapshot for local validation")
    args = parser.parse_args()
    payload = json.loads(args.input.read_text(encoding="utf-8-sig")) if args.input else fetch_activity()
    if payload.get("errors"):
        raise RuntimeError(f"GitHub GraphQL query failed: {payload['errors']}")
    user = payload["data"]["user"]
    if not user:
        raise RuntimeError("GitHub user was not found")
    calendar = user["contributionsCollection"]["contributionCalendar"]
    updated = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    # Build all outputs before writing, so an API/schema failure preserves the previous profile.
    svgs = {f"activity-{'dark' if dark else 'light'}.svg": graph_svg(calendar, dark, updated)
            for dark in (False, True)}
    statuses = {"MERGED": "Merged", "OPEN": "Open", "CLOSED": "Closed"}
    public_prs = [pr for pr in payload['data']['search']["nodes"]
                  if pr['repository']['isPrivate'] is False][:4]
    items = [f"- [{markdown_text(pr['title'])}]({pr['url']}) · `{markdown_text(pr['repository']['nameWithOwner'])}` · {statuses[pr['state']]}"
             for pr in public_prs]
    recent = "\n".join(items) if items else "No public pull requests to show."
    block = f"<!-- ACTIVITY:START -->\n{recent}\n\n<sub>Updated {updated} · refreshed daily by GitHub Actions.</sub>\n<!-- ACTIVITY:END -->"
    readme_path = ROOT / "README.md"
    original = readme_path.read_text(encoding="utf-8")
    readme, replaced = re.subn(r"<!-- ACTIVITY:START -->.*?<!-- ACTIVITY:END -->", lambda _: block, original, flags=re.S)
    if replaced != 1:
        raise RuntimeError("README must contain exactly one ACTIVITY marker pair")
    for name, svg in svgs.items():
        (ROOT / "assets" / name).write_text(svg, encoding="utf-8")
    readme_path.write_text(readme, encoding="utf-8")
    print(f"Refreshed {calendar['totalContributions']:,} contributions and {len(items)} pull requests.")


if __name__ == "__main__":
    main()
