const sharp = require('sharp');
const fs = require('node:fs/promises');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const width = 1200, height = 400, frameCount = 96;
const repo = path.resolve(__dirname, '..');
const framesDir = path.resolve(repo, 'work/banner-frames');

function overlay(frame) {
  const phase = frame / frameCount;
  let particles = '';
  for (let i = 0; i < 14; i++) {
    const p = (phase + i * 0.07142857) % 1;
    const x = 600 + (i % 5) * 110 + Math.sin(phase * 2 * Math.PI + i * 0.7) * 75;
    const y = -12 + p * 425;
    const opacity = Math.min(1, p * 12, (1 - p) * 12) * 0.62;
    const angle = Math.sin(phase * Math.PI * 2 + i) * 50 + i * 32;
    particles += `<g transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${angle.toFixed(2)})" opacity="${opacity.toFixed(3)}"><path d="M-4 0 Q0-5 5-1 Q4 5-4 0Z" fill="#f5c0df"/></g>`;
  }
  const stars = [[800,83],[949,49],[730,107],[1068,110],[906,135],[1015,158]];
  stars.forEach(([x,y],i) => {
    const a = 0.16 + 0.35 * (1 + Math.sin(phase * 4 * Math.PI + i)) / 2;
    particles += `<circle cx="${x}" cy="${y}" r="1.4" fill="#d9efff" opacity="${a.toFixed(3)}"/>`;
  });
  const lineWidth = 85 + 45 * Math.sin(phase * 2 * Math.PI);
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs><linearGradient id="shade"><stop stop-color="#07152e" stop-opacity=".60"/><stop offset=".39" stop-color="#07152e" stop-opacity=".36"/><stop offset=".65" stop-color="#07152e" stop-opacity="0"/></linearGradient></defs>
    <rect width="1200" height="400" fill="url(#shade)"/>
    <g font-family="Segoe UI, sans-serif">
      <text x="66" y="96" fill="#bddcff" font-size="20" font-weight="500">Anshuman791322</text>
      <text x="62" y="178" fill="#f3f8ff" font-size="69" font-weight="700" letter-spacing="-1.5">Anshuman</text>
      <text x="62" y="248" fill="#f3f8ff" font-size="69" font-weight="700" letter-spacing="-1.5">Singh.</text>
      <text x="66" y="295" fill="#cde4ff" font-size="24">Building with AI.</text>
      <text x="66" y="336" fill="#bddcff" font-size="17">Local-first tools / web / machine learning</text>
    </g>
    <rect x="66" y="354" width="${lineWidth.toFixed(2)}" height="2" rx="1" fill="#73c5ff"/>
    ${particles}
  </svg>`);
}

(async () => {
  await fs.mkdir(framesDir, {recursive:true});
  const artwork = await sharp(path.join(repo, 'assets/banner-art.png')).resize(width,height).png().toBuffer();
  for (let frame = 0; frame < frameCount; frame++) {
    const rendered = sharp(artwork).composite([{input:overlay(frame)}]);
    if (frame === 0) await rendered.clone().png().toFile(path.join(repo,'assets/banner-still.png'));
    await rendered.png().toFile(path.join(framesDir,`${String(frame).padStart(3,'0')}.png`));
  }
  const encoding = spawnSync('ffmpeg', ['-y','-hide_banner','-loglevel','error','-framerate','12','-i',path.join(framesDir,'%03d.png'),'-filter_complex','[0:v]split[a][b];[a]palettegen=stats_mode=diff:max_colors=256[p];[b][p]paletteuse=dither=bayer:bayer_scale=3:diff_mode=rectangle','-loop','0',path.join(repo,'assets/banner.gif')], {stdio:'inherit'});
  if (encoding.status !== 0) throw new Error('Banner GIF encoding failed');
  console.log(`Rendered ${frameCount} frames, 8-second loop, ${width} × ${height}.`);
})();
