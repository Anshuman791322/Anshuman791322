// Geometric workflow illustrations, not screenshots or live app state.
const {scenes:richScenes, styles:richStyles, descriptions} = require('./rich-project-scenes.cjs');
const styles = `
.parcel{animation:parcel 7s cubic-bezier(.16,1,.3,1) infinite}
.upload{animation:upload 8s ease-in-out infinite}
.driver-scan{animation:driverScan 6s ease-in-out infinite}
.branch-flow{stroke-dasharray:9 180;animation:branchFlow 8s linear infinite}
.gallery-focus{transform-box:fill-box;transform-origin:center;animation:galleryFocus 9s ease-in-out infinite}
@keyframes parcel{0%,100%{transform:translateX(0)}40%,65%{transform:translateX(15px)}}
@keyframes upload{0%,100%{transform:translate(0,0)}45%,70%{transform:translate(13px,-8px)}}
@keyframes driverScan{0%,100%{transform:translateY(0)}50%{transform:translateY(52px)}}
@keyframes branchFlow{to{stroke-dashoffset:-189}}
@keyframes galleryFocus{0%,100%{transform:scale(1)}40%,65%{transform:scale(1.07)}}
`;

const scenes = {

  driver: l => `<rect x="77" y="9" width="138" height="135" rx="12" fill="#111f35" stroke="#53769e" stroke-width="2"/>
    <path d="M133 18h28" stroke="#536e8e" stroke-width="3" stroke-linecap="round"/>
    <g fill="none" stroke="#83bdec" stroke-width="2"><path d="M98 46V35h11m75 0h11v11M98 83v11h11m75 0h11V83"/>
    <circle cx="146" cy="56" r="17"/><path d="M120 88c0-19 52-19 52 0"/>
    <path class="driver-scan" d="M101 37H191" stroke="#9ed8c6" stroke-width="2"/></g>
    <g fill="#c0ddfb"><circle cx="139" cy="54" r="2"/><circle cx="153" cy="54" r="2"/><circle cx="146" cy="64" r="2"/></g>
    <path d="M95 109h102M95 119h71" stroke="#395578" stroke-width="3"/>
    ${l.text('Android · Compose',94,135,11,'#b1cce9')}`,


  host: (l, theme) => `<g stroke-width="2" stroke-linejoin="round">
    <path d="M23 45h43l12 12v64H23Z" fill="#e9f3ff" stroke="#8aa7c7"/>
    <g class="upload"><path d="M36 29h43l12 12v66H36Z" fill="#f7fbff" stroke="#779bbf"/>
    <path d="M78 29v14h13M46 59h34M46 71h34M46 84h22" fill="none" stroke="#96aec7" stroke-width="3"/></g>
    <path d="M109 81h43V63h22" fill="none" stroke="#8aacca"/>
    <path class="flow" d="M109 81h43V63h22" fill="none" stroke="#589cc9" stroke-width="3"/>
    <path d="M185 100c-30 0-30-43-5-43 4-41 68-44 75-6 28-2 33 49 5 49Z" fill="#deefff" stroke="#7099bd"/>
    <rect x="214" y="70" width="21" height="21" rx="3" fill="#b5d2e9" stroke="#557d9f"/>
    <path d="M218 70v-7c0-10 14-10 14 0v7" fill="none" stroke="#557d9f"/>
    ${l.text('Private uploads',169,132,13,theme.body)}</g>`,

  tree: () => `<g fill="none" stroke="#7bafab" stroke-width="2">
    <path d="M146 47V76H61V96M146 76V101M146 76H233V96"/>
    <path class="branch-flow" d="M146 47V76H61V96M146 76V101M146 76H233V96" stroke="#92cfdb" stroke-width="4"/>
    </g>${[[146,28,22,'#d7eff1'],[61,115,19,'#e6e5fa'],[146,119,19,'#e0f1e2'],[233,115,19,'#f5e8d5']].map(([x,y,r,fill])=>
      `<g fill="${fill}" stroke="#7da2ad" stroke-width="2"><circle cx="${x}" cy="${y}" r="${r}"/>
      <circle cx="${x}" cy="${y-4}" r="5" fill="none"/><path d="M${x-9} ${y+9}c0-12 18-12 18 0" fill="none"/></g>`).join('')}`,



};
module.exports = {scenes:{...scenes,...richScenes}, styles:id=>richScenes[id]?richStyles:styles, descriptions};
