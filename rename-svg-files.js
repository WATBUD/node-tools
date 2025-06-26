import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'src/assets/svg-to-ttf-original');
const destDir = path.join(__dirname, 'src/assets/svg-to-ttf');
const prefix = 'Property 1=';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.readdirSync(srcDir).forEach(file => {
  if (file.endsWith('.svg') && file.startsWith(prefix)) {
    const rest = file.slice(prefix.length);
    if (rest.length === 0) return;
    const newName = rest.charAt(0).toLowerCase() + rest.slice(1);
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, newName);
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied & Renamed: ${file} -> ${newName}`);
  } else if (file.endsWith('.svg')) {
    // 不是 Property 1= 開頭的 SVG 也複製過去，檔名不變
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file);
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied: ${file}`);
  }
});

console.log('SVG 檔案重新命名並複製完成！'); 