// Composed previews from the projects' public branding and gallery images.
// The animation sequences are illustrative, not recordings of app responses.
const fs = require('node:fs');
const path = require('node:path');
const directory = path.resolve(__dirname, '../assets/project-sources/rich');
const images = new Map();
function asset(name) {
  if (!images.has(name)) {
    const mime = name.endsWith('.png') ? 'image/png' : 'image/jpeg';
    images.set(name, `data:${mime};base64,${fs.readFileSync(path.join(directory,name)).toString('base64')}`);
  }
  return images.get(name);
}
function image(name,x,y,width,height,attributes='') {
  return `<image x="${x}" y="${y}" width="${width}" height="${height}" href="${asset(name)}" ${attributes}/>`;
}

const styles = `
.hunar-first{opacity:1;animation:hunarFirst 10s ease-in-out infinite}
.hunar-second{opacity:0;animation:hunarSecond 10s ease-in-out infinite}
.zing-mascot{animation:zingFloat 6s ease-in-out infinite}
.zing-trace{stroke-dasharray:10 160;animation:zingTrace 7s linear infinite}
.zing-chat{animation:zingChat 9s ease-in-out infinite}
.zing-translate{animation:zingChat 9s ease-in-out -3s infinite}
.zing-memory{animation:zingChat 9s ease-in-out -6s infinite}
.art-feature{transform-box:fill-box;transform-origin:center;animation:artLightbox 9s cubic-bezier(.16,1,.3,1) infinite}
.art-side{animation:artSide 9s ease-in-out infinite}
.humanify-mark{animation:humanifyPaper 8s ease-in-out infinite}
.humanify-ink{clip-path:inset(0 0 0 0);animation:humanifyInk 8s cubic-bezier(.16,1,.3,1) infinite}
.humanify-line{stroke-dasharray:110;animation:humanifyLine 8s ease-out infinite}
@keyframes hunarFirst{0%,30%,100%{opacity:1}45%,80%{opacity:0}}
@keyframes hunarSecond{0%,30%,100%{opacity:0}45%,80%{opacity:1}}
@keyframes zingFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
@keyframes zingTrace{to{stroke-dashoffset:-170}}
@keyframes zingChat{0%,100%{opacity:.75}25%,55%{opacity:1}}
@keyframes artLightbox{0%,100%{transform:scale(1)}35%,65%{transform:scale(1.15)}}
@keyframes artSide{0%,100%{opacity:1}35%,65%{opacity:.72}}
@keyframes humanifyPaper{0%,100%{transform:translateY(0)}45%,70%{transform:translateY(-3px)}}
@keyframes humanifyInk{0%,18%{clip-path:inset(0 100% 0 0)}50%,100%{clip-path:inset(0 0 0 0)}}
@keyframes humanifyLine{0%,25%{stroke-dashoffset:110}65%,100%{stroke-dashoffset:0}}
`;

const scenes = {
  hunar: l => `<defs><clipPath id="hunar-photo"><rect x="146" y="20" width="128" height="114" rx="4"/></clipPath></defs>
    <rect x="12" y="9" width="270" height="135" rx="6" fill="#211b15"/>
    ${image('hunar-logo.png',21,29,117,54)}
    ${l.text('Made with care',28,105,13,'#efcf93')}
    <path d="M28 116H111" stroke="#b98c42" stroke-width="1.5"/>
    <g clip-path="url(#hunar-photo)">
      ${image('hunar-gifts.jpg',146,20,128,114,'class="hunar-first" preserveAspectRatio="xMidYMid slice"')}
      ${image('hunar-yarn.jpg',146,20,128,114,'class="hunar-second" preserveAspectRatio="xMidYMid slice"')}
    </g>`,

  zinging: l => `<defs><clipPath id="zing-window"><rect x="12" y="9" width="270" height="135" rx="6"/></clipPath></defs>
    <g clip-path="url(#zing-window)"><rect x="12" y="9" width="270" height="135" fill="#03140e"/>
    ${image('zinging-mascot.jpg',17,12,129,129,'class="zing-mascot"')}
    <path d="M145 37H160V118H145" fill="none" stroke="#456c29" stroke-width="1.5"/>
    <path class="zing-trace" d="M145 37H160V118H145" fill="none" stroke="#b0ef35" stroke-width="2"/>
    <g class="zing-chat"><rect x="171" y="23" width="100" height="28" rx="5" fill="#15381d"/>
      <circle cx="183" cy="37" r="3" fill="#b0ef35"/>${l.text('Chat',193,42,14,'#e5f9c8')}</g>
    <g class="zing-translate"><rect x="171" y="62" width="100" height="28" rx="5" fill="#15381d"/>
      <circle cx="183" cy="76" r="3" fill="#b0ef35"/>${l.text('Translate',193,81,14,'#e5f9c8')}</g>
    <g class="zing-memory"><rect x="171" y="101" width="100" height="28" rx="5" fill="#15381d"/>
      <circle cx="183" cy="115" r="3" fill="#b0ef35"/>${l.text('Memory',193,120,14,'#e5f9c8')}</g></g>`,

  artgridx: () => `<defs><clipPath id="art-window"><rect x="12" y="9" width="270" height="135" rx="6"/></clipPath>
    <clipPath id="art-left"><rect x="20" y="18" width="71" height="117" rx="3"/></clipPath>
    <clipPath id="art-right"><rect x="204" y="18" width="70" height="117" rx="3"/></clipPath>
    <clipPath id="art-wave"><rect x="99" y="29" width="97" height="95" rx="3"/></clipPath></defs>
    <g clip-path="url(#art-window)"><rect x="12" y="9" width="270" height="135" fill="#152022"/>
    <g class="art-side" clip-path="url(#art-left)">${image('artgridx-cypresses.jpg',20,18,71,117,'preserveAspectRatio="xMidYMid slice"')}</g>
    <g class="art-side" clip-path="url(#art-right)">${image('artgridx-sunflowers.jpg',204,18,70,117,'preserveAspectRatio="xMidYMid slice"')}</g>
    <g class="art-feature"><rect x="94" y="24" width="107" height="105" rx="4" fill="#eadbc0"/>
      <g clip-path="url(#art-wave)">${image('artgridx-wave.jpg',99,29,97,95,'preserveAspectRatio="xMidYMid slice"')}</g></g></g>`,

  humanify: l => `<defs><clipPath id="humanify-window"><rect x="12" y="9" width="270" height="135" rx="6"/></clipPath></defs>
    <g clip-path="url(#humanify-window)"><rect x="12" y="9" width="270" height="135" fill="#1e1530"/>
    ${image('humanify-logo.jpg',19,20,111,106,'class="humanify-mark"')}
    ${l.text('Keep the thought.',139,47,12,'#e6c4d4')}
    <g class="humanify-ink">${l.text('Find the voice.',139,74,17,'#fff0d8')}</g>
    <path d="M139 96H266M139 110H241" stroke="#483955" stroke-width="3" stroke-linecap="round"/>
    <path class="humanify-line" d="M139 96H266M139 110H241" stroke="#edb5be" stroke-width="3" stroke-linecap="round"/>
    </g>`
};
const descriptions = {
  hunar: 'Animated montage of the public Hunar logo and gift/crochet photographs used by its storefront.',
  zinging: 'The public Zinging mascot with an illustrated chat, translation, and memory sequence.',
  artgridx: 'Animated lightbox composition using three paintings from ArtGridX public demo assets.',
  humanify: 'The public Humanify logo with an animated reveal of its headline, Keep the thought. Find the voice. This is a brand composition, not generated writing output.'
};
module.exports = {scenes, styles, descriptions};
