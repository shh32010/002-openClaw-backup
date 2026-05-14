const fs = require('fs');
const path = require('path');

const dir = 'E:/26年应用软件系统开发/Dual-Carbon-Visualization-Platform-master/src/views/indexs';

const files = fs.readdirSync(dir).filter(f => f.endsWith('.vue'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  const original = content;

  // 1. itemStyle: { normal: { ... } } → itemStyle: { ... }
  content = content.replace(/itemStyle:\s*\{\s*normal:\s*\{/g, () => { changed = true; return 'itemStyle: {'; });

  // 2. areaStyle: { normal: { ... } } → areaStyle: { ... }
  content = content.replace(/areaStyle:\s*\{\s*normal:\s*\{/g, () => { changed = true; return 'areaStyle: {'; });

  // 3. barBorderRadius → borderRadius
  if (content.includes('barBorderRadius')) {
    content = content.replace(/barBorderRadius/g, 'borderRadius');
    changed = true;
  }

  // 4. backgroundColor: "auto" → "inherit"
  if (content.includes('backgroundColor: "auto"') || content.includes("backgroundColor: 'auto'")) {
    content = content.replace(/backgroundColor:\s*["']auto["']/g, 'backgroundColor: "inherit"');
    changed = true;
  }

  // 5. shadowColor: "auto" → "inherit"
  if (content.includes('shadowColor: "auto"') || content.includes("shadowColor: 'auto'")) {
    content = content.replace(/shadowColor:\s*["']auto["']/g, 'shadowColor: "inherit"');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed: ' + file);
  } else {
    console.log('OK: ' + file);
  }
}
console.log('Done');
