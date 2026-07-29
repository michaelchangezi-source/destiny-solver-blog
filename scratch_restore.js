const fs = require('fs');
const path = require('path');
const src = 'C:/Users/micha/.claude/backups/content-articles-2026-07-29';
const dst = path.join(__dirname, 'content', 'articles');
const files = fs.readdirSync(src);
for (const f of files) {
  fs.copyFileSync(path.join(src, f), path.join(dst, f));
}
console.log('restored', files.length);
