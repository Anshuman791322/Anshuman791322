// Compact, transparent project rows. Full descriptions stay in Markdown.
const fs = require('node:fs');
const path = require('node:path');
const opentype = require('opentype.js');
const root = path.resolve(__dirname, '..');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'assets/projects.json'), 'utf8'));
const bytes = fs.readFileSync(path.join(root, 'assets/fonts/Manrope-Medium.ttf'));
const font = opentype.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
class Lettering {
  constructor() { this.definitions = new Map(); this.bounds = []; }
  measure(text, size) { return font.getAdvanceWidth(text, size, {kerning:true}); }
  wrap(text, size, maxWidth) {
    const lines = []; let line = '';
    for (const word of text.split(/\s+/)) {
      const next = line ? `${line} ${word}` : word;
      if (this.measure(next, size) > maxWidth && line) { lines.push(line); line = word; } else line = next;
      if (this.measure(word, size) > maxWidth) throw new Error(`Word exceeds layout: ${word}`);
    }
    if (line) lines.push(line); return lines;
  }
  text(text, x, y, size, color) {
    const scale = size / font.unitsPerEm, glyphs = font.stringToGlyphs(text);
    let advance = 0, uses = '';
    glyphs.forEach((glyph, index) => {
      if (glyph.index === 0 && !/\s/.test(text[index] || '')) throw new Error(`Missing glyph: ${text}`);
      const id = `g${glyph.index.toString(16)}`;
      if (!this.definitions.has(id)) this.definitions.set(id, `<path id="${id}" d="${glyph.getPath(0,0,font.unitsPerEm).toPathData(2)}"/>`);
      uses += `<use href="#${id}" x="${advance.toFixed(2)}"/>`;
      advance += glyph.advanceWidth || 0;
      if (index < glyphs.length - 1) advance += font.getKerningValue(glyph, glyphs[index+1]);
    });
    this.bounds.push({text, x, y, width: advance * scale, size});
    return `<g aria-label="${escape(text)}" fill="${color}" transform="translate(${x} ${y}) scale(${scale.toFixed(6)})">${uses}</g>`;
  }
}
const copy = {
  aqg: 'Documents become grounded quizzes through retrieval, review, and export.',
  jarvis: 'Local models, voice control, memory, and policy-gated desktop actions.',
  stars: 'Gaia DR3 light curves, classified with machine-learning sequence models.',
  portfolio: 'Next.js, React, and Anime.js, published on GitHub Pages.'
};
const themes = {
  light: {title:'#172b46', body:'#345270', line:'#d8e3ef'},
  dark: {title:'#edf5ff', body:'#a9c3df', line:'#2b3e56'}
};
const style = `<style>
.flow{stroke-dasharray:12 240;animation:flow 7s linear infinite}
.page{animation:page 7s cubic-bezier(.16,1,.3,1) infinite}
.check{stroke-dasharray:28;stroke-dashoffset:0;animation:check 7s ease-out infinite}
.wave{transform-box:fill-box;transform-origin:center;animation:wave 2.8s ease-in-out infinite}
.reply{stroke-dasharray:180;animation:reply 8s ease-out infinite}
.scan{animation:scan 11s linear infinite}
.site{animation:site 14s ease-in-out infinite}
@keyframes flow{to{stroke-dashoffset:-252}}
@keyframes page{0%,100%{transform:translate(0,0)}35%,65%{transform:translate(9px,-5px)}}
@keyframes check{0%,12%{stroke-dashoffset:28}38%,100%{stroke-dashoffset:0}}
@keyframes wave{0%,100%{transform:scaleY(.35)}45%{transform:scaleY(1)}}
@keyframes reply{0%,15%{stroke-dashoffset:180}55%,100%{stroke-dashoffset:0}}
@keyframes scan{0%,100%{transform:translateX(0)}50%{transform:translateX(238px)}}
@keyframes site{0%,100%{transform:translateX(0)}50%{transform:translateX(-36px)}}
@media(prefers-reduced-motion:reduce){*{animation:none!important}}
</style>`;
function illustration(id, l) {
  if (id === 'aqg') return `<g stroke-linejoin="round">
    <path d="M18 33H84L96 45V125H18Z" fill="#eef5ff" stroke="#a5bcd6"/>
    <g class="page"><path d="M30 22H95L108 36V115H30Z" fill="#f8fbff" stroke="#7194ba"/>
    <path d="M94 22V37H108M42 51H91M42 63H84M42 75H92M42 88H76" fill="none" stroke="#90a8c4" stroke-width="3"/></g>
    <path d="M110 77H177" stroke="#91aecd" stroke-width="2"/>
    <path class="flow" d="M110 77H177" stroke="#3f91d3" stroke-width="4"/>
    <path d="m163 71 9 6-9 6" fill="none" stroke="#5082b9" stroke-width="2"/>
    <rect x="179" y="27" width="99" height="100" rx="3" fill="#eef6ff" stroke="#90adcc"/>
    ${l.text('Quiz',192,48,15,'#284b75')}
    <g fill="none" stroke-width="2"><rect x="192" y="61" width="9" height="9" rx="2" stroke="#6c8dae"/>
    <rect x="192" y="82" width="9" height="9" rx="2" stroke="#6c8dae"/>
    <rect x="192" y="103" width="9" height="9" rx="2" stroke="#6c8dae"/>
    <path d="M210 66H262M210 87H250M210 108H258" stroke="#91abc7"/>
    <path class="check" d="m190 64 6 6 10-12" stroke="#25895c" stroke-width="3"/></g></g>`;
  if (id === 'jarvis') {
    const waves = Array.from({length:29}, (_,i) => {
      const h = 10 + Math.pow(Math.sin(i*.56),2)*40;
      return `<rect class="wave" style="animation-delay:-${(i*.17).toFixed(2)}s" x="${33+i*8}" y="${65-h/2}" width="3" height="${h}" rx="1.5"/>`;
    }).join('');
    return `<rect x="17" y="22" width="261" height="108" rx="4" fill="#101c31"/>
    ${l.text('Voice · Ollama · local',32,42,13,'#a8cfff')}
    <g fill="#94a9fc">${waves}</g>
    <path d="M32 96H257M32 110H196" stroke="#344767" stroke-width="3"/>
    <path class="reply" d="M32 96H257M32 110H196" stroke="#79b9d5" stroke-width="3"/>
    <circle cx="261" cy="37" r="3" fill="#a6ddc3"/>`;
  }
  const filename = id === 'stars' ? 'rr-lyrae.png' : 'portfolio.jpg';
  const mime = id === 'stars' ? 'image/png' : 'image/jpeg';
  const data = fs.readFileSync(path.join(root,'assets/project-sources',filename)).toString('base64');
  if (id === 'stars') return `<defs><clipPath id="plot-clip"><rect x="12" y="21" width="270" height="111" rx="3"/></clipPath></defs>
    <g clip-path="url(#plot-clip)"><image x="12" y="21" width="270" height="111" preserveAspectRatio="none" href="data:${mime};base64,${data}"/>
    <path class="scan" d="M30 29V116" stroke="#4265bb" stroke-opacity=".45" stroke-width="2"/></g>`;
  return `<defs><clipPath id="site-clip"><rect x="12" y="15" width="270" height="123" rx="3"/></clipPath></defs>
    <g clip-path="url(#site-clip)"><rect x="12" y="15" width="270" height="123" fill="#080e16"/>
    <image class="site" x="12" y="15" width="310" height="137" preserveAspectRatio="xMidYMid slice" href="data:${mime};base64,${data}"/></g>`;
}
function row(project, mobile, dark, still) {
  const l = new Lettering(), theme = themes[dark?'dark':'light'];
  const w = mobile ? 420 : 840, pad = mobile ? 16 : 10;
  const x = mobile ? pad : 328, max = w-x-pad;
  let y = mobile ? 37 : 39, content = '';
  const headingSize = mobile ? 30 : 32, bodySize = mobile ? 24 : 22;
  l.wrap(project.displayName,headingSize,max).forEach(line => { content += l.text(line,x,y,headingSize,theme.title); y += headingSize*1.2; });
  y += 8;
  const lines = l.wrap(copy[project.id],bodySize,max);
  lines.forEach(line => { content += l.text(line,x,y,bodySize,theme.body); y += mobile ? 31 : 29; });
  const artworkY = mobile ? y-22 : 0;
  const artwork = illustration(project.id,l);
  content += `<g data-motion="${project.id}" transform="${mobile?`translate(58 ${artworkY})`:'translate(0 1)'}">${artwork}</g>`;
  const h = mobile ? artworkY+151 : Math.max(156,y+13);
  content += `<path d="M${pad} ${h-1}H${w-pad}" stroke="${theme.line}"/>`;
  for (const b of l.bounds) if(b.x+b.width>w-pad+.5) throw new Error(`Text exceeds ${project.id}: ${b.text}`);
  let css = style;
  if(still) css = css.replace('</style>','*{animation:none!important}</style>');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title desc">
<title id="title">${escape(project.name)}. ${escape(copy[project.id])}</title>
<desc id="desc">${escape(project.description)} ${project.id==='stars'?'Original RR Lyrae photometry plot from the project notebook.':project.id==='portfolio'?'Screenshot of the published portfolio with a gentle horizontal pan.':'Illustrated workflow preview.'}</desc>
${css}<defs>${[...l.definitions.values()].join('')}</defs>${content}</svg>`;
  return {svg,width:w,height:h,bodySize,headingSize,lines:lines.length};
}
const out = path.join(root,'assets/projects'); fs.mkdirSync(out,{recursive:true});
const manifest = [];
for (const p of catalog.filter(p=>p.featured)) for (const mobile of [false,true]) for (const dark of [false,true]) for (const still of [false,true]) {
  const result = row(p,mobile,dark,still);
  const file = `${p.id}${mobile?'-mobile':''}${dark?'-dark':''}${still?'-still':''}.svg`;
  fs.writeFileSync(path.join(out,file),result.svg);
  manifest.push({id:p.id,file,mobile,dark,still,width:result.width,height:result.height,bodySize:result.bodySize,bodyLines:result.lines,bytes:Buffer.byteLength(result.svg)});
}
fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log('Rendered four compact motion previews, with light/dark, mobile, and still alternatives.');
