const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const opentype = require('opentype.js');
const root = path.resolve(__dirname, '..');
const bytes = fs.readFileSync(path.join(root, 'assets/fonts/Manrope-Medium.ttf'));
const font = opentype.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
const tools = [
  ['Codex', 'codex'], ['ChatGPT', 'openai'], ['Claude', 'claude-color'],
  ['Gemini', 'gemini-color'], ['GLM', 'chatglm-color'], ['DeepSeek', 'deepseek-color']
];
const output = path.join(root, 'assets/ai-icons');
const variants = [];
for (const mobile of [false, true]) {
  for (const dark of [false, true]) {
    const columns = mobile ? 3 : 6;
    const width = columns * 140;
    const height = mobile ? 216 : 108;
    const foreground = dark ? '#edf5ff' : '#172b46';
    const artwork = tools.map(([name, slug], i) => {
      const x = (i % columns) * 140;
      const y = Math.floor(i / columns) * 108;
      const source = fs.readFileSync(path.join(output, `${slug}.svg`), 'utf8');
      if (/<script|<foreignObject|\bon\w+=|(?:href|src)="https?:/i.test(source)) throw new Error(`Unsafe icon: ${slug}`);
      const attributes = source.match(/^<svg\b([^>]*)>/)[1]
        .replace(/\s(?:width|height|style)="[^"]*"/g, '');
      const body = source.replace(/^<svg\b[^>]*>/, '').replace(/<\/svg>\s*$/, '');
      const labelWidth = font.getAdvanceWidth(name, 22, {kerning:true});
      if (labelWidth > 128) throw new Error(`Label does not fit: ${name}`);
      const lettering = font.getPath(name, x + (140 - labelWidth) / 2, y + 94, 22).toPathData(2);
      return `<g aria-label="${name}"><svg x="${x+44}" y="${y+9}" width="52" height="52"${attributes}>${body}</svg><path fill="${foreground}" d="${lettering}"/></g>`;
    }).join('\n');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" color="${foreground}" role="img" aria-labelledby="title"><title id="title">Codex, ChatGPT, Claude, Gemini, GLM, and DeepSeek</title>\n${artwork}\n</svg>\n`;
    const revision = crypto.createHash('sha256').update(svg).digest('hex').slice(0, 8);
    const file = `toolkit-${mobile?'mobile':'desktop'}-${dark?'dark':'light'}-${revision}.svg`;
    fs.writeFileSync(path.join(output, file), svg);
    variants.push({mobile, dark, file, width, height});
  }
}
fs.writeFileSync(path.join(output, 'manifest.json'), JSON.stringify(variants, null, 2)+'\n');
const resource = (mobile, dark) => 'assets/ai-icons/'+variants.find(v=>v.mobile===mobile && v.dark===dark).file;
const markup = `<!-- AI-TOOLKIT:START -->\n<picture>\n  <source media="(prefers-color-scheme: dark) and (max-width: 540px)" srcset="${resource(true,true)}">\n  <source media="(prefers-color-scheme: dark)" srcset="${resource(false,true)}">\n  <source media="(max-width: 540px)" srcset="${resource(true,false)}">\n  <img src="${resource(false,false)}" alt="AI assistants: Codex, ChatGPT, Claude, Gemini, GLM, and DeepSeek" width="100%">\n</picture>\n<!-- AI-TOOLKIT:END -->`;
const readmePath = path.join(root, 'README.md');
const original = fs.readFileSync(readmePath, 'utf8').replace(/\r\n/g,'\n');
const section = /<!-- AI-TOOLKIT:START -->[\s\S]*?<!-- AI-TOOLKIT:END -->/;
if (!section.test(original)) throw new Error('AI toolkit section was not found');
fs.writeFileSync(readmePath, original.replace(section, ()=>markup));
console.log('Rendered all six AI icons in desktop/mobile and light/dark versions.');
