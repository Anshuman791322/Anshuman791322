// Self-contained SVG project artwork. Font glyphs are bundled as vector paths.
const fs = require('node:fs');
const path = require('node:path');
const opentype = require('opentype.js');
const root = path.resolve(__dirname, '..');
const catalog = JSON.parse(fs.readFileSync(path.join(root,'assets/projects.json'),'utf8'));
const escape = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
function loadFont(file) {
  const bytes = fs.readFileSync(path.join(root,'assets/fonts',file));
  return opentype.parse(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength));
}
const fonts = {heading:loadFont('ChakraPetch-SemiBold.ttf'),body:loadFont('Manrope-Medium.ttf')};

class Lettering {
  constructor() {this.definitions = new Map(); this.bounds = [];}
  measure(text, size, role='body') {return fonts[role].getAdvanceWidth(text,size,{kerning:true});}
  wrap(text,size,maxWidth,role='body') {
    const lines=[]; let line='';
    for(const word of text.split(/\s+/)) {
      const candidate = line ? `${line} ${word}` : word;
      if(this.measure(candidate,size,role)>maxWidth && line) {lines.push(line);line=word;} else line=candidate;
      if(this.measure(word,size,role)>maxWidth) throw new Error(`Unbreakable text exceeds layout: ${word}`);
    }
    if(line) lines.push(line);
    return lines;
  }
  text(text,x,y,size,color,role='body') {
    const font=fonts[role], scale=size/font.unitsPerEm, glyphs=font.stringToGlyphs(text);
    let advance=0, uses='';
    glyphs.forEach((glyph,index)=>{
      if(glyph.index===0 && !/\s/.test(text[index]||'')) throw new Error(`Missing glyph in ${role}: ${text}`);
      const id=`${role[0]}${glyph.index.toString(16)}`;
      if(!this.definitions.has(id)) this.definitions.set(id,`<path id="${id}" d="${glyph.getPath(0,0,font.unitsPerEm).toPathData(2)}"/>`);
      uses+=`<use href="#${id}" x="${advance.toFixed(2)}"/>`;
      advance+=glyph.advanceWidth||0;
      if(index<glyphs.length-1) advance+=font.getKerningValue(glyph,glyphs[index+1]);
    });
    this.bounds.push({text,x,y,width:advance*scale,size});
    return `<g aria-label="${escape(text)}" fill="${color}" transform="translate(${x} ${y}) scale(${scale.toFixed(6)})">${uses}</g>`;
  }
}

const style = `<style>
.packet{stroke-dasharray:12 260;animation:send 7s linear infinite}
.pulse{transform-box:fill-box;transform-origin:center;animation:voice 3.6s ease-in-out infinite}
.pulse:nth-child(3n){animation-delay:-1.1s}.pulse:nth-child(3n+1){animation-delay:-2.3s}
.satellite{transform-origin:96px 90px;animation:orbit 14s linear infinite}
.cursor{animation:cursor 6s cubic-bezier(.16,1,.3,1) infinite}
@keyframes send{to{stroke-dashoffset:-272}}
@keyframes voice{0%,100%{transform:scaleY(.48)}50%{transform:scaleY(1)}}
@keyframes orbit{to{transform:rotate(360deg)}}
@keyframes cursor{0%,20%,100%{transform:translate(0,0)}45%,75%{transform:translate(-30px,-20px)}}
@media(prefers-reduced-motion:reduce){*{animation:none!important}}
</style>`;

function art(project,accent) {
  if(project.id==='aqg') return `<g fill="none" stroke="${accent}" stroke-width="2.5">
    <path d="M25 38H66L83 55V116H25Z"/><path d="M65 38V56H83M37 72H66M37 85H66M37 98H56"/>
    <path d="M96 86H116V86H142" stroke-opacity=".3"/><path class="packet" d="M42 131H155V84H165" stroke-width="4"/>
    <rect x="143" y="36" width="61" height="84" rx="6"/><path d="M153 55H191M153 73H191M153 91H179"/>
    <path d="M157 73l4 4 8-9" stroke="#c6e9ff"/>
  </g>`;
  if(project.id==='jarvis') {
    let bars=''; for(let i=0;i<17;i++){const h=18+55*Math.pow(Math.sin(i*.66),2);bars+=`<rect class="pulse" x="${20+i*9}" y="${85-h/2}" width="4" height="${h}" rx="2"/>`;}
    return `<g fill="${accent}">${bars}</g><circle cx="94" cy="85" r="66" fill="none" stroke="${accent}" stroke-opacity=".18"/><path d="M45 154H144" stroke="${accent}" stroke-opacity=".5"/>`;
  }
  if(project.id==='stars') return `<g stroke="${accent}" fill="none" stroke-width="1.6">
    <ellipse cx="96" cy="90" rx="86" ry="34" transform="rotate(-28 96 90)" stroke-opacity=".6"/>
    <ellipse cx="96" cy="90" rx="76" ry="45" transform="rotate(39 96 90)" stroke-opacity=".35"/>
    <circle cx="96" cy="90" r="17" fill="${accent}" fill-opacity=".17"/><path d="M96 60V120M66 90H126" stroke-opacity=".45"/>
    <g class="satellite"><circle cx="156" cy="30" r="5" fill="${accent}" stroke="none"/></g>
    <circle cx="24" cy="36" r="2" fill="${accent}"/><circle cx="179" cy="122" r="3" fill="${accent}"/>
  </g>`;
  if(project.id==='portfolio') return `<g stroke="${accent}" stroke-width="2" fill="none">
    <rect x="17" y="29" width="183" height="117" rx="8"/><path d="M17 53H200" stroke-opacity=".5"/>
    <circle cx="30" cy="41" r="2" fill="${accent}"/><circle cx="41" cy="41" r="2" fill="${accent}"/>
    <path d="M32 74H88M32 86H113M32 99H70"/><rect x="139" y="69" width="44" height="59" rx="3" fill="${accent}" fill-opacity=".12"/>
    <path class="cursor" d="M131 110l-1 24 8-7 7 13 5-3-7-12 11-2Z" fill="${accent}" stroke="none"/>
  </g>`;
  return '';
}

const accents={aqg:'#8fc9ff',jarvis:'#bab8ff',stars:'#8adce4',portfolio:'#efb8dd'};
const backgrounds={aqg:'#0b2240',jarvis:'#171f43',stars:'#0b293d',portfolio:'#211e42'};

function card(project,mobile) {
  const lettering=new Lettering(), w=mobile?420:840, pad=mobile?27:36;
  const accent=accents[project.id]||'#a8caff', bg=backgrounds[project.id]||'#10233e';
  const headingSize=mobile?35:48, bodySize=mobile?21:24, bodyLeading=mobile?31:35;
  const title=project.displayName, titleLines=lettering.wrap(title,headingSize,w-pad*2,'heading');
  let y=mobile?52:67, content='';
  titleLines.forEach(line=>{content+=lettering.text(line,pad,y,headingSize,'#f0f6ff','heading');y+=headingSize*1.14;});
  y+=mobile?13:14;
  const bodyWidth=!mobile&&project.featured?w-pad*2-219:w-pad*2;
  const lines=lettering.wrap(project.summary,bodySize,bodyWidth);
  lines.forEach(line=>{content+=lettering.text(line,pad,y,bodySize,'#c8ddf6');y+=bodyLeading;});
  y+=mobile?12:16;
  const tags=project.displayStack||project.stack.slice(0,5);
  const tagSize=mobile?17:18;
  let tx=pad;
  tags.forEach(tag=>{
    const width=lettering.measure(tag,tagSize)+22;
    if(tx+width>w-pad){tx=pad;y+=34;}
    content+=`<rect x="${tx}" y="${y-21}" width="${width.toFixed(2)}" height="29" rx="5" fill="${accent}" fill-opacity=".12"/>`;
    content+=lettering.text(tag,tx+11,y,tagSize,'#d7e7fb');tx+=width+8;
  });
  y+=mobile&&project.featured?91:55;
  const h=Math.ceil(y+27), label=project.url.startsWith('https://github.com/')?'Open repository':'Open project';
  content+=lettering.text(label,pad,h-27,mobile?18:20,accent);
  const arrowX=pad+lettering.measure(label,mobile?18:20)+14;
  content+=`<path d="M${arrowX} ${h-34}h16m-6-6 6 6-6 6" fill="none" stroke="${accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
  if(project.featured){
    const transform=mobile?`translate(${w-110} ${h-103}) scale(.42)`:`translate(${w-243} 103)`;
    content+=`<g data-motion="${project.id}" transform="${transform}">${art(project,accent)}</g>`;
  }
  for(const bounds of lettering.bounds) if(bounds.x+bounds.width>w-pad+0.5) throw new Error(`${project.id} text exceeds card width: ${bounds.text}`);
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title desc">
<title id="title">${escape(project.name)}. ${escape(project.summary)}</title>
<desc id="desc">${escape(project.description)} Technologies: ${escape(tags.join(', '))}. ${label}.</desc>
${style}<defs>${[...lettering.definitions.values()].join('')}</defs>
<rect width="${w}" height="${h}" rx="12" fill="${bg}"/>
${content}
</svg>`;
  return {svg,width:w,height:h,bodySize,headingSize,lines:lines.length};
}

const out=path.join(root,'assets/projects');fs.mkdirSync(out,{recursive:true});
const manifest=[];
for(const project of catalog) for(const mobile of [false,true]) {
  const result=card(project,mobile), filename=`${project.id}${mobile?'-mobile':''}.svg`;
  fs.writeFileSync(path.join(out,filename),result.svg);
  if(project.featured) fs.writeFileSync(path.join(out,`${project.id}${mobile?'-mobile':''}-still.svg`),result.svg.replace('</style>','*{animation:none!important}</style>'));
  manifest.push({id:project.id,file:filename,mobile,width:result.width,height:result.height,headingFont:'Chakra Petch SemiBold',bodyFont:'Manrope Medium',bodySize:result.bodySize,bodyLines:result.lines,bytes:Buffer.byteLength(result.svg)});
}
fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(`Rendered ${catalog.length} project designs in desktop and mobile sizes; lettering is embedded, with no external font requests.`);
