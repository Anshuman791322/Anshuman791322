# Profile artwork

- `avatar.png` is a byte-for-byte copy of the original avatar from [Anshuman's portfolio](https://anshuman791322.github.io/avatar-cut.png).
- `banner-art.png` is original anime-inspired artwork generated with the built-in ImageGen tool. The full generation prompt is in `banner-prompt.txt`.
- `banner.gif` is an eight-second, 96-frame loop with drifting petals and subtle lights. `banner-still.png` is its reduced-motion alternative.
- `toolkit.svg` contains logos from [Simple Icons](https://github.com/simple-icons/simple-icons), published under CC0. The profile's link buttons and divider are local SVGs.
- `activity-light.svg` and `activity-dark.svg` are refreshed daily from GitHub's API by `.github/workflows/profile-activity.yml`. The updater includes only public pull requests.
- `projects/` contains compact, transparent animated rows for all 11 projects, with desktop, mobile, light, dark, and reduced-motion versions. Manrope Medium lettering is embedded as reusable vector glyphs. Hunar appears first and the personal portfolio last, following the order in `projects.json`.
- AQG shows document-to-quiz flow; JARVIS shows a voice waveform. The other workflow illustrations show Hunar's gift shopping, Android driver monitoring, Zinging's conversation and memory, Host's file uploads, Tree's connected profiles, ArtGridX's masonry gallery, and Humanify's authenticated API. These are geometric previews of project concepts, not screenshots or live app state. They are maintained in `scripts/project-scenes.cjs`.
- `project-sources/portfolio.jpg` is a cropped screenshot of [the published portfolio](https://anshuman791322.github.io), captured on 2026-10-13. Its preview gently pans the same screenshot.
- `project-sources/rr-lyrae.png` is cropped from the first RR Lyrae magnitude plot in cell 37 of [Final Submission.ipynb](https://github.com/Anshuman791322/periodically-variable-stars/blob/main/Final%20Submission.ipynb). A decorative scan line moves over the original plot; its data is unchanged.

Run `npm run render:projects` to rebuild the artwork and update its README section from `projects.json`. CSS motion stops for `prefers-reduced-motion`; essential text remains visible throughout every loop. The profile's original avatar placement is preserved.

Research references: [Chan Meng's animated project cards](https://www.chanmeng.org/blog/animated-svg-project-cards), [design-led profile examples](https://github.com/beydemirfurkan/awesome-github-profile), and [Readme Typing SVG](https://github.com/DenverCoder1/readme-typing-svg). These informed self-contained SVGs and outlined lettering. The current layout uses transparent rows instead of filled cards. Every original project description, link, and full technology stack remains in the README's expanded notes.

To rebuild the banner, install Node.js and FFmpeg, run `npm ci`, then `npm run render:banner`. The renderer uses Segoe UI when installed, with a sans-serif fallback. Temporary frames go into the ignored `work/banner-frames` directory.

To refresh activity manually, run the "Refresh profile activity" GitHub Actions workflow, or set `GH_TOKEN` locally and run `python scripts/update_activity.py`. The scheduled refresh runs at 02:23 UTC daily. Images can remain cached briefly by GitHub after updates.

The README uses a GIF for its banner because GitHub's [image support documentation](https://docs.github.com/en/repositories/working-with-files/using-files/working-with-non-code-files) does not guarantee SVG animation. SVG motion is decorative; all text and contribution data remain visible when it is paused.
