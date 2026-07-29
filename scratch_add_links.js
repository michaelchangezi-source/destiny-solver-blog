const fs = require('fs');
const path = require('path');

const ARTICLES_DIR = path.join(__dirname, 'content', 'articles');
const glossary = JSON.parse(fs.readFileSync(path.join(__dirname, 'content', 'glossary-links.json'), 'utf8'));

// terms sorted by length desc (longer terms take priority at same position)
const terms = Object.keys(glossary).sort((a, b) => b.length - a.length);

function slugFromPath(p) {
  // "/articles/xxx" -> "xxx"
  return p.replace(/^\/articles\//, '');
}

function parseFrontmatter(raw) {
  // raw starts with "---\n"
  const lines = raw.split('\n');
  if (lines[0].trim() !== '---') {
    throw new Error('no frontmatter start');
  }
  let endIdx = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      endIdx = i;
      break;
    }
  }
  if (endIdx === -1) throw new Error('no frontmatter end');
  const fmLines = lines.slice(0, endIdx + 1); // includes both --- lines
  const bodyLines = lines.slice(endIdx + 1);
  return { fmLines, bodyLines };
}

// Effective routing slug is derived from the FILENAME, not the frontmatter
// "slug:" field. See src/lib/articles.ts extractSlug(): for topic-NN and
// post-YYYYMMDD-NN files, only that prefix is the real route slug; the
// frontmatter slug field for topic-*.md contains a much longer descriptive
// string that never matches the glossary's short slugs (topic-09 etc).
function extractRouteSlug(filename) {
  const basename = filename.replace(/\.(md|mdoc)$/, '');
  const m = basename.match(/^(topic-\d+|post-\d{8}-\d+)/);
  return m ? m[1] : basename;
}

function isHeadingLine(line) {
  return /^\s{0,3}#{1,6}\s/.test(line);
}

const report = {
  perFile: [],
  distribution: {},
  selfLinkViolations: [],
  targetCheck: { ok: 0, bad: [] },
};

const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.md'));

for (const file of files) {
  const fullPath = path.join(ARTICLES_DIR, file);
  const raw = fs.readFileSync(fullPath, 'utf8');
  const { fmLines, bodyLines } = parseFrontmatter(raw);
  const ownSlug = extractRouteSlug(file);

  const usedTerms = new Set();
  let linkCount = 0;
  const MAX_LINKS = 6;
  const MIN_LINKS = 3;

  // eligible terms for this article (exclude self-link targets)
  const eligibleTerms = terms.filter(t => slugFromPath(glossary[t]) !== ownSlug);

  const newBodyLines = bodyLines.map((line) => {
    if (linkCount >= MAX_LINKS) return line;
    if (isHeadingLine(line)) return line;
    if (line.trim() === '') return line;

    let result = '';
    let i = 0;
    while (i < line.length) {
      if (linkCount >= MAX_LINKS) {
        result += line.slice(i);
        break;
      }
      let matched = null;
      for (const term of eligibleTerms) {
        if (usedTerms.has(term)) continue;
        if (line.startsWith(term, i)) {
          matched = term;
          break;
        }
      }
      if (matched) {
        result += `[${matched}](${glossary[matched]})`;
        usedTerms.add(matched);
        linkCount++;
        i += matched.length;
      } else {
        result += line[i];
        i++;
      }
    }
    return result;
  });

  const newRaw = [...fmLines, ...newBodyLines].join('\n');
  fs.writeFileSync(fullPath, newRaw, 'utf8');

  report.perFile.push({ file, slug: ownSlug, linkCount, terms: [...usedTerms] });
  report.distribution[linkCount] = (report.distribution[linkCount] || 0) + 1;
}

fs.writeFileSync(path.join(__dirname, 'scratch_link_report.json'), JSON.stringify(report, null, 2), 'utf8');
console.log('DONE');
console.log('distribution:', report.distribution);
console.log('files under 3:', report.perFile.filter(f => f.linkCount < 3).map(f => `${f.file}(${f.linkCount})`));
