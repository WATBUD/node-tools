import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'src/assets/svg-to-ttf-original');
const destDir = path.join(__dirname, 'src/assets/svg-to-ttf');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.readdirSync(srcDir).forEach(file => {
  if (file.endsWith('.svg')) {
    const lastEq = file.lastIndexOf('=');
    let newName = file;
    if (lastEq !== -1) {
      let base = file.slice(lastEq + 1);
      if (base.length === 0) return;
      base = base.charAt(0).toLowerCase() + base.slice(1);
      newName = base;
    }
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, newName);
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied & Renamed: ${file} -> ${newName}`);
  }
});

console.log('SVG 檔案重新命名並複製完成！'); 