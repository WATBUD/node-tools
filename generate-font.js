import path from "node:path";
import fs from "node:fs";
import svgpath from "svgpath";
import webfont from "webfont";


const srcDir = path.resolve(process.cwd(), "src/assets/svg-to-ttf");
const outDir = path.resolve(process.cwd(), "src/assets/font");
const MAX_ATTRIB_LENGTH = 64000;



// 1. 產生 selection.json
const svgFiles = fs.readdirSync(srcDir).filter(f => f.endsWith('.svg'));
const validSvgFiles = [];
const icons = svgFiles.map((file, idx) => {
  const name = file.replace(/\.svg$/, "");
  let svgContent = fs.readFileSync(path.join(srcDir, file), 'utf8');

  // 新增這兩行
  svgContent = svgContent.replace(/<rect[^>]*fill=["']#?fff?["'][^>]*\/?>/gi, "");
  svgContent = svgContent.replace(/<rect[^>]*fill=["']white["'][^>]*\/?>/gi, "");

  // 新增：統一 path 填色為黑色（或移除 fill 屬性）
  // 1. 移除 path 的 fill 屬性
  svgContent = svgContent.replace(/(<path[^>]*?)\s*fill=["'][^"']*["']/gi, "$1");
  // 2. 或者直接改成黑色
  svgContent = svgContent.replace(/(<path[^>]*?)\s*fill=["'][^"']*["']/gi, '$1 fill="#000"');

  // 直接覆蓋原 SVG 檔案
  fs.writeFileSync(path.join(srcDir, file), svgContent, 'utf8');
  // 解析 <path d="..." />
  const pathMatches = [...svgContent.matchAll(/<path[^>]*d=["']([^"']+)["'][^>]*>/g)];
  const paths = pathMatches.map(m => svgpath(m[1]).abs().toString());
  validSvgFiles.push(path.join(srcDir, file));
  // 檢查所有屬性值長度
  const attrRegex = /([a-zA-Z\-:]+)=["']([^"']*)["']/g;
  let match, tooLong = false;
  while ((match = attrRegex.exec(svgContent)) !== null) {
    if (match[2].length > MAX_ATTRIB_LENGTH) {
      console.warn(`忽略 ${file}，屬性 ${match[1]} 長度 ${match[2].length}`);
      tooLong = true;
      break;
    }
  }
  if (tooLong) return null;
  // 解析 viewBox
  const viewBoxMatch = svgContent.match(/viewBox=["']\s*([\d.\-]+)\s+([\d.\-]+)\s+([\d.\-]+)\s+([\d.\-]+)\s*["']/);
  const viewBox = viewBoxMatch
    ? viewBoxMatch.slice(1, 5).map(Number)
    : [0, 0, 24, 24]; // fallback
  return {
    icon: {
      paths,
      attrs: [{ fill: "#000" }],
      isMulticolor: false,
      isMulticolor2: false,
      grid: 0,
      tags: [name]
    },
    attrs: [{ fill: "#000" }],
    properties: {
      order: idx + 1,
      id: idx + 1,
      name,
      prevSize: 32,
      code: 59648 + idx // Private Use Area start
    },
    setIdx: 0,
    setId: 1,
    iconIdx: idx
  };
}).filter(Boolean);
const selection = {
  IcoMoonType: "selection",
  icons,
  height: 1024,
  metadata: { name: "icomoon" },
  preferences: {
    showGlyphs: true,
    showQuickUse: true,
    showQuickUse2: false,
    showSVGs: true,
    fontPref: {
      prefix: "icon-",
      metadata: { fontFamily: "icomoon" },
      metrics: { emSize: 1024, baseline: 6.25, whitespace: 50 },
      embed: false,
      resetPoint: 59648,
      autoHost: true
    },
    imagePref: {
      prefix: "icon-",
      png: true,
      useClassSelector: true,
      color: 0,
      bgColor: 16777215,
      classSelector: ".icon",
      name: "icomoon",
      height: 32,
      columns: 16,
      margin: 16
    },
    historySize: 50,
    showCodes: false,
    gridSize: 16,
    quickUsageToken: {},
    showLiga: false
  }
};
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "selection.json"), JSON.stringify(selection, null, 2));
console.log("已產生 IcoMoon 標準 selection.json（含 path scale）");

// 2. 用 webfont 產生 ttf 字型
(async () => {
  try {
    const result = await webfont.default({
      files: validSvgFiles,
      fontName: "icons",
      formats: ["ttf"],
      dest: outDir,
      template: null,
      startUnicode: 0xE900,
      normalize: true,
      fontHeight: 1024,
      descent: 0,
    });
    // 寫入 ttf
    fs.writeFileSync(path.join(outDir, "icons.ttf"), result.ttf);
    console.log("TTF 字型產生完成！（webfont）");
    // 複製到 rn-expo-project-test/assets/fonts
    const targetFontDir = path.resolve(process.cwd(), 'rn-expo-project-test/assets/fonts');
    if (!fs.existsSync(targetFontDir)) fs.mkdirSync(targetFontDir, { recursive: true });
    fs.copyFileSync(path.join(outDir, 'selection.json'), path.join(targetFontDir, 'selection.json'));
    fs.copyFileSync(path.join(outDir, 'icons.ttf'), path.join(targetFontDir, 'icons.ttf'));
    console.log('已複製 selection.json 和 icons.ttf 到 rn-expo-project-test/assets/fonts/');
  } catch (error) {
    console.error('TTF 字型產生失敗：', error);
  }
})(); 