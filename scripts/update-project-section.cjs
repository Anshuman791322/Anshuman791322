const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const projects=JSON.parse(fs.readFileSync(path.join(root,'assets/projects.json'),'utf8'));
const manifest=JSON.parse(fs.readFileSync(path.join(root,'assets/projects/manifest.json'),'utf8'));
const encode=value=>value.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
function picture(project) {
  const resource=(mobile,dark,still)=>{
    const record=manifest.find(r=>r.id===project.id&&r.mobile===mobile&&r.dark===dark&&r.still===still);
    if(!record) throw new Error(`Missing project artwork: ${project.id}`);
    return `assets/projects/${record.file}`;
  };
  return `<a href="${encode(project.url)}">\n  <picture>\n`+
    `    <source media="(prefers-reduced-motion: reduce) and (prefers-color-scheme: dark) and (max-width: 540px)" srcset="${resource(true,true,true)}">\n`+
    `    <source media="(prefers-reduced-motion: reduce) and (prefers-color-scheme: dark)" srcset="${resource(false,true,true)}">\n`+
    `    <source media="(prefers-reduced-motion: reduce) and (max-width: 540px)" srcset="${resource(true,false,true)}">\n`+
    `    <source media="(prefers-reduced-motion: reduce)" srcset="${resource(false,false,true)}">\n`+
    `    <source media="(prefers-color-scheme: dark) and (max-width: 540px)" srcset="${resource(true,true,false)}">\n`+
    `    <source media="(prefers-color-scheme: dark)" srcset="${resource(false,true,false)}">\n`+
    `    <source media="(max-width: 540px)" srcset="${resource(true,false,false)}">\n`+
    `    <img src="${resource(false,false,false)}" alt="${encode(project.name+'. '+project.summary)}" width="100%">\n  </picture>\n</a>`;
}
function notes(p) { return `### [${p.name}](${p.url})\n\n${p.description}\n\n${p.stack.map(t=>'`'+t+'`').join(' ')}`; }
const section=`<!-- PROJECTS:START -->\n## Project\n\n${projects.map(picture).join('\n\n')}\n\n<details>\n<summary>Full descriptions and technology stacks</summary>\n\n${projects.map(notes).join('\n\n')}\n\n</details>\n<!-- PROJECTS:END -->\n`;
const readmePath=path.join(root,'README.md');
const original=fs.readFileSync(readmePath,'utf8').replace(/\r\n/g,'\n');
const pattern=/<!-- PROJECTS:START -->[\s\S]*?<!-- PROJECTS:END -->\n/;
if(!pattern.test(original)) throw new Error('Project section was not found');
fs.writeFileSync(readmePath,original.replace(pattern,()=>section));
console.log('Updated compact project section; all 11 descriptions and full stacks remain available.');
