import fs from 'fs';
import path from 'path';

const svgDir = path.resolve('src/assets/svg-to-ttf-rename');
const outFile = path.resolve('src/assets/font/CustomIconNameType.ts');

function toEnumKey(name) {
  // 只取檔名（去副檔名），首字大寫，其餘小寫
  if (!name) return '';
  const n = name.replace(/\.svg$/i, '');
  return n.charAt(0).toUpperCase() + n.slice(1);
}

const files = fs.readdirSync(svgDir).filter(f => f.endsWith('.svg'));

const lines = [
  'export enum CustomIconNameType {'
];

for (const file of files) {
  const base = file.replace(/\.svg$/i, '');
  lines.push(`  ${toEnumKey(base)} = "${base}",`);
}

lines.push('}');

fs.writeFileSync(outFile, lines.join('\n'), 'utf8');
console.log('已產生 CustomIconNameType.ts');