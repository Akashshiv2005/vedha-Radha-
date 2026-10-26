const fs = require('fs');
const path = require('path');

function getAllFiles(dir, filter) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (!['node_modules', 'dist', '.git', '.vscode', 'scratch'].includes(file)) {
        results = results.concat(getAllFiles(fullPath, filter));
      }
    } else if (filter(fullPath)) {
      results.push(fullPath);
    }
  }
  return results;
}

const isImage = f => /\.(png|jpe?g|webp|svg|gif|ico|avif)$/i.test(f);
const isCode = f => /\.(jsx?|tsx?|html|css|json|md)$/i.test(f);

const publicImages = getAllFiles(path.resolve('public'), isImage);
const srcAndHtml = getAllFiles(path.resolve('src'), isCode).concat([path.resolve('index.html')]);

console.log('Public image files count:', publicImages.length);
console.log('Src & HTML files count:', srcAndHtml.length);

const codeDatabase = srcAndHtml.map(f => ({
  path: f,
  rel: path.relative('.', f),
  content: fs.readFileSync(f, 'utf8')
}));

const imageStatus = publicImages.map(img => {
  const relFromPublic = path.relative(path.resolve('public'), img).replace(/\\/g, '/');
  const filename = path.basename(img);
  const size = fs.statSync(img).size;

  let directCodeRefs = [];
  for (const code of codeDatabase) {
    if (code.content.includes(filename)) {
      directCodeRefs.push(code.rel);
    }
  }

  return {
    fullPath: img,
    publicPath: '/' + relFromPublic,
    filename,
    sizeBytes: size,
    sizeKb: (size / 1024).toFixed(1),
    isUsedInApp: directCodeRefs.length > 0,
    usedIn: directCodeRefs
  };
});

const usedImages = imageStatus.filter(i => i.isUsedInApp);
const unusedImages = imageStatus.filter(i => !i.isUsedInApp);

console.log('\n--- SUMMARY ---');
console.log('Total Public Images:', imageStatus.length);
console.log('Used in App:', usedImages.length);
console.log('Unused in App:', unusedImages.length);
const unusedTotalMb = (unusedImages.reduce((sum, i) => sum + i.sizeBytes, 0) / (1024 * 1024)).toFixed(2);
console.log('Total Unused Disk Space:', unusedTotalMb, 'MB');

const folderGroups = {};
for (const u of unusedImages) {
  const dir = path.dirname(u.publicPath);
  if (!folderGroups[dir]) folderGroups[dir] = [];
  folderGroups[dir].push(u);
}

console.log('\n--- UNUSED IMAGES BY DIRECTORY ---');
for (const [dir, items] of Object.entries(folderGroups)) {
  const dirSizeMb = (items.reduce((s, i) => s + i.sizeBytes, 0) / (1024 * 1024)).toFixed(2);
  console.log(`${dir}: ${items.length} files (${dirSizeMb} MB)`);
}

fs.writeFileSync('unused_images_by_folder.json', JSON.stringify(folderGroups, null, 2));
