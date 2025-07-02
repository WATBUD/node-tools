import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'src/assets/svg-to-ttf-original');
const destDir = path.join(__dirname, 'src/assets/svg-to-ttf');
const MAX_ATTRIB_LENGTH = 64000;

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

function toCamelCase(str) {
  return str
    .replace(/\s+(.)/g, (match, group1) => group1.toUpperCase())
    .replace(/\s+/g, '')
    .replace(/^(.)/, (match, group1) => group1.toLowerCase());
}

fs.readdirSync(srcDir).forEach(file => {
  if (file.endsWith('.svg')) {
    const srcPath = path.join(srcDir, file);
    const content = fs.readFileSync(srcPath, 'utf8');
    // 檢查所有屬性值長度
    const attrRegex = /([a-zA-Z\-:]+)=["']([^"']*)["']/g;
    let match, tooLong = false;
    while ((match = attrRegex.exec(content)) !== null) {
      if (match[2].length > MAX_ATTRIB_LENGTH) {
        console.warn(`忽略 ${file}，屬性 ${match[1]} 長度 ${match[2].length}`);
        tooLong = true;
        break;
      }
    }
    if (tooLong) return;
    // 重新命名：只保留最後一個 = 之後的字，首字小寫，空白轉小駝峰
    const lastEq = file.lastIndexOf('=');
    let newName = file;
    if (lastEq !== -1) {
      let base = file.slice(lastEq + 1, -4); // 去掉 .svg
      if (base.length === 0) return;
      base = toCamelCase(base);
      newName = base + '.svg';
    } else {
      // 沒有 =，直接用檔名去掉 .svg 再轉小駝峰
      let base = file.slice(0, -4);
      base = toCamelCase(base);
      newName = base + '.svg';
    }
    const destPath = path.join(destDir, newName);
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied & Renamed: ${file} -> ${newName}`);
  }
});

console.log('SVG 檔案重新命名、過濾並複製完成！'); 