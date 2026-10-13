// Geometric workflow illustrations, not screenshots or live app state.
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
  hunar: (l, theme) => `<g stroke-width="2" stroke-linejoin="round">
    <g class="parcel"><rect x="24" y="54" width="63" height="54" rx="3" fill="#f2c5ca" stroke="#a16c83"/>
    <rect x="19" y="46" width="73" height="13" rx="2" fill="#fae5de" stroke="#a16c83"/>
    <path d="M54 46v61M53 46c-29-1-29-21-13-18 8 1 13 18 13 18Zm1 0c27-1 29-21 13-18-8 1-13 18-13 18Z" fill="none" stroke="#ad5973"/></g>
    <path d="M105 77H176" stroke="#88a9c4"/>
    <path class="flow" d="M105 77H176" stroke="#599bc6" stroke-width="3"/>
    <path d="M184 45h13l13 55h49l11-39h-68" fill="#fff0d3" stroke="#ab8358"/>
    <path d="M213 111h44" fill="none" stroke="#ab8358"/>
    <circle cx="217" cy="117" r="5" fill="#dca15d" stroke="#ab8358"/><circle cx="254" cy="117" r="5" fill="#dca15d" stroke="#ab8358"/>
    <path class="check" d="m222 75 9 9 16-20" fill="none" stroke="#578968" stroke-width="3"/>
    ${l.text('Handmade gifts',20,137,13,theme.body)}</g>`,

  driver: l => `<rect x="77" y="9" width="138" height="135" rx="12" fill="#111f35" stroke="#53769e" stroke-width="2"/>
    <path d="M133 18h28" stroke="#536e8e" stroke-width="3" stroke-linecap="round"/>
    <g fill="none" stroke="#83bdec" stroke-width="2"><path d="M98 46V35h11m75 0h11v11M98 83v11h11m75 0h11V83"/>
    <circle cx="146" cy="56" r="17"/><path d="M120 88c0-19 52-19 52 0"/>
    <path class="driver-scan" d="M101 37H191" stroke="#9ed8c6" stroke-width="2"/></g>
    <g fill="#c0ddfb"><circle cx="139" cy="54" r="2"/><circle cx="153" cy="54" r="2"/><circle cx="146" cy="64" r="2"/></g>
    <path d="M95 109h102M95 119h71" stroke="#395578" stroke-width="3"/>
    ${l.text('Android · Compose',94,135,11,'#b1cce9')}`,

  zinging: (l, theme) => `<g stroke-linejoin="round" stroke-width="2">
    <path d="M21 26h74v34H42L29 70V60h-8Z" fill="#ecedff" stroke="#9897c2"/>
    <path d="M32 38H83M32 49H70" stroke="#a4a6c7"/>
    <path d="M97 43H148V66H216M217 93H149V108H117" fill="none" stroke="#a2adc6"/>
    <path class="flow" d="M97 43H148V66H216M217 93H149V108H117" fill="none" stroke="#8a81b5" stroke-width="3"/>
    <path d="M22 88h92v35H48l-12 9v-9H22Z" fill="#e4f5f1" stroke="#79aaab"/>
    <path class="reply" d="M34 100h66M34 111h51" stroke="#6b9fa8" stroke-width="3"/>
    <path d="M218 49v53c0 14 56 14 56 0V49" fill="#142c47" stroke="#7fa7ca"/>
    <ellipse cx="246" cy="49" rx="28" ry="10" fill="#254a6c" stroke="#7fa7ca"/>
    <path d="M218 76c0 14 56 14 56 0" fill="none" stroke="#7fa7ca"/>
    ${l.text('Memory',222,136,12,theme.body)}</g>`,

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

  artgridx: () => `<g stroke="#7e9fbf" stroke-width="1.5" stroke-linejoin="round">
    <rect x="19" y="22" width="75" height="43" rx="3" fill="#edd6cb"/>
    <rect x="19" y="73" width="75" height="53" rx="3" fill="#d6e9e9"/>
    <rect x="198" y="22" width="75" height="54" rx="3" fill="#d6deed"/>
    <rect x="198" y="84" width="75" height="42" rx="3" fill="#f1e3c8"/>
    <path d="M31 53l17-19 16 15 16-8M32 112l15-28 18 30M209 60h28l-14-20m16 0h23v22M209 106h53" fill="none" stroke="#8ca4b7"/>
    <g class="gallery-focus"><rect x="104" y="22" width="84" height="104" rx="3" fill="#153352"/>
    <circle cx="146" cy="56" r="16" fill="#af8fbe" stroke="none"/>
    <path d="m113 113 26-27 16 16 24-39" fill="none" stroke="#d4c0d8" stroke-width="3"/>
    <path d="M116 32h10m42 0h10M116 116h10m42 0h10" stroke="#93b8d5"/></g></g>`,

  humanify: l => `<g stroke-width="2" stroke-linejoin="round">
    <rect x="21" y="24" width="126" height="108" rx="4" fill="#edf4ff" stroke="#799cc1"/>
    <path d="M21 45H147" stroke="#95b0cb"/>
    ${l.text('Next.js',33,39,13,'#416688')}
    <path d="M34 66h94M34 82h94M34 98h66" stroke="#9bb4cd" stroke-width="3"/>
    <path d="M150 79h58" stroke="#94afc7"/>
    <path class="flow" d="M150 79h58" stroke="#708cbe" stroke-width="3"/>
    <rect x="212" y="40" width="61" height="76" rx="4" fill="#152b45" stroke="#7393ba"/>
    <path d="M237 66v-7c0-10 14-10 14 0v7" fill="none" stroke="#b7cfee"/>
    <rect x="232" y="66" width="24" height="22" rx="3" fill="#719dc1" stroke="#b7cfee"/>
    <path class="check" d="m237 76 5 5 8-10" fill="none" stroke="#e0f3ec"/>
    ${l.text('API',231,103,13,'#bbd8f1')}</g>`
};
module.exports = {scenes, styles};
