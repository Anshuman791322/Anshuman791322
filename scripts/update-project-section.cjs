const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const projects=JSON.parse(fs.readFileSync(path.join(root,'assets/projects.json'),'utf8'));
const encode=value=>value.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
function picture(project) {
  const alt=`${project.name}. ${project.summary} ${(project.displayStack||project.stack.slice(0,5)).join(', ')}.`;
  const still=project.featured?`    <source media="(prefers-reduced-motion: reduce) and (max-width: 900px)" srcset="assets/projects/${project.id}-mobile-still.svg">\n    <source media="(prefers-reduced-motion: reduce)" srcset="assets/projects/${project.id}-still.svg">\n`:'';
  return `<a href="${encode(project.url)}">\n  <picture>\n${still}    <source media="(max-width: 900px)" srcset="assets/projects/${project.id}-mobile.svg">\n    <img src="assets/projects/${project.id}.svg" alt="${encode(alt)}" width="100%">\n  </picture>\n</a>`;
}
function notes(project) {
  return `### [${project.name}](${project.url})\n\n${project.description}\n\n${project.stack.map(t=>'`'+t+'`').join(' ')}`;
}
const featuredOrder=['aqg','jarvis','stars','portfolio'];
const featured=featuredOrder.map(id=>projects.find(p=>p.id===id));
const more=projects.filter(p=>!p.featured);
const section=`<!-- PROJECTS:START -->\n## Selected work\n\n${featured.map(picture).join('\n\n')}\n\n<details>\n<summary><strong>More projects (${more.length})</strong></summary>\n\n${more.map(picture).join('\n\n')}\n\n</details>\n\n<details>\n<summary><strong>Implementation notes and full stacks for all ${projects.length} projects</strong></summary>\n\n${projects.map(notes).join('\n\n')}\n\n</details>\n<!-- PROJECTS:END -->\n`;
const readmePath=path.join(root,'README.md');
const original=fs.readFileSync(readmePath,'utf8').replace(/\r\n/g,'\n');
const pattern=original.includes('<!-- PROJECTS:START -->')?/<!-- PROJECTS:START -->[\s\S]*?<!-- PROJECTS:END -->\n/:/## Selected work\n[\s\S]*?(?=\n## My toolkit)/;
if(!pattern.test(original)) throw new Error('Project section was not found');
fs.writeFileSync(readmePath,original.replace(pattern,()=>section));
console.log('Updated project presentation; every original project description and full stack remains available.');
