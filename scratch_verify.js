const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'content', 'articles');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

function extractRouteSlug(filename) {
  const basename = filename.replace(/\.(md|mdoc)$/, '');
  const m = basename.match(/^(topic-\d+|post-\d{8}-\d+)/);
  return m ? m[1] : basename;
}

const validSlugs = new Set(files.map(extractRouteSlug));

let selfLinkBad = [];
let nestedBad = [];
let targetOk = 0, targetBad = [];
let distribution = {};
let headingLinkBad = [];

for (const f of files) {
  const ownSlug = extractRouteSlug(f);
  const raw = fs.readFileSync(path.join(dir, f), 'utf8');
  const fmEnd = raw.indexOf('\n---', 4);
  const body = raw.slice(fmEnd + 4);
  const lines = body.split('\n');
  let count = 0;
  for (const line of lines) {
    const heading = /^\s{0,3}#{1,6}\s/.test(line);
    const re = /\[([^\]]+)\]\(([^)]+)\)/g;
    let m;
    while ((m = re.exec(line))) {
      count++;
      if (heading) headingLinkBad.push(f + ': ' + m[0]);
      const targetSlug = m[2].replace(/^\/articles\//, '');
      if (targetSlug === ownSlug) selfLinkBad.push(`${f} -> ${m[0]}`);
      if (!validSlugs.has(targetSlug)) targetBad.push(`${f} -> ${m[0]}`);
      else targetOk++;
    }
    if (/\]\(\/articles\/[^)]*\)\(/.test(line)) nestedBad.push(f + ': nested paren pattern');
  }
  distribution[count] = (distribution[count] || 0) + 1;
}

console.log('=== distribution ===');
console.log(distribution);
console.log('=== self-link violations ===', selfLinkBad.length);
selfLinkBad.forEach(x => console.log(x));
console.log('=== heading-line links (should be 0) ===', headingLinkBad.length);
headingLinkBad.forEach(x => console.log(x));
console.log('=== target check === ok:', targetOk, 'bad:', targetBad.length);
targetBad.forEach(x => console.log(x));
console.log('=== nested bad ===', nestedBad.length);
nestedBad.forEach(x => console.log(x));
