const fs = require('fs');
const path = require('path');

function getAllFiles(dir, filter) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
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

console.log(`Scanning ${publicImages.length} public images against ${srcAndHtml.length} code files...`);

const codeContents = srcAndHtml.map(f => ({
  path: f,
  rel: path.relative('.', f),
  content: fs.readFileSync(f, 'utf8')
}));

let removedCount = 0;
let removedBytes = 0;
const removedFiles = [];
const skippedFiles = [];

for (const imgPath of publicImages) {
  const filename = path.basename(imgPath);
  
  // Guard check: is it referenced anywhere in src/ or index.html?
  let isReferenced = false;
  for (const { content } of codeContents) {
    if (content.includes(filename)) {
      isReferenced = true;
      break;
    }
  }

  if (isReferenced) {
    skippedFiles.push(imgPath);
    continue;
  }

  // File is unused. Record details and delete.
  try {
    const size = fs.statSync(imgPath).size;
    fs.unlinkSync(imgPath);
    removedCount++;
    removedBytes += size;
    removedFiles.push({
      path: path.relative('.', imgPath).replace(/\\/g, '/'),
      sizeKb: (size / 1024).toFixed(1)
    });

    // Also check dist/ if exists
    const relFromPublic = path.relative(path.resolve('public'), imgPath);
    const distPath = path.join(path.resolve('dist'), relFromPublic);
    if (fs.existsSync(distPath)) {
      fs.unlinkSync(distPath);
    }
  } catch (err) {
    console.error(`Error deleting ${imgPath}:`, err.message);
  }
}

// Clean up any empty directories left inside public/
function cleanEmptyDirs(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      cleanEmptyDirs(fullPath);
    }
  }
  // Check again after recursive cleans
  const remaining = fs.readdirSync(dir);
  if (remaining.length === 0 && dir !== path.resolve('public')) {
    fs.rmdirSync(dir);
    console.log(`Removed empty folder: ${path.relative('.', dir)}`);
  }
}

cleanEmptyDirs(path.resolve('public/images'));

console.log('\n--- CLEANUP COMPLETE ---');
console.log(`Removed files: ${removedCount}`);
console.log(`Total space freed: ${(removedBytes / (1024 * 1024)).toFixed(2)} MB`);
console.log(`Active files remaining: ${skippedFiles.length}`);
