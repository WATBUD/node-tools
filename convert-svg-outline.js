import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.resolve(__dirname, 'src/assets/svg-to-ttf-rename');
const outDir = path.resolve(__dirname, 'src/assets/svg-to-ttf-outline');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const svgFiles = fs.readdirSync(srcDir).filter(f => f.endsWith('.svg'));

svgFiles.forEach(file => {
  const inputPath = path.join(srcDir, file);
  const outputPath = path.join(outDir, file);
  try {
    // Inkscape CLI 指令
    const cmd = `inkscape "${inputPath}" --actions="select-all;object-stroke-to-path;path-union;export-filename:${outputPath};export-do"`;
    execSync(cmd, { stdio: 'inherit' });
    console.log(`已轉換: ${file}`);
  } catch (e) {
    console.error(`轉換失敗: ${file}`, e);
  }
});

console.log('全部轉換完成！');
