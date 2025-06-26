import webfontsGenerator from "webfonts-generator";
import path from "node:path";
import fs from "node:fs";
import svgpath from "svgpath";

const srcDir = path.resolve(process.cwd(), "src/assets/svg-to-ttf");
const outDir = path.resolve(process.cwd(), "src/assets/font");
const MAX_ATTRIB_LENGTH = 64000;

// 工具：根據 viewBox 將 path 平移到 (0,0) 並縮放到 1024x1024
function normalizePathData(pathData, viewBox, toSize = 1024) {
  const [minX, minY, width, height] = viewBox;
  const scale = toSize / Math.max(width, height);
  return svgpath(pathData)
    .translate(-minX, -minY)
    .scale(scale)
    .abs()
    .toString();
}

// 1. 產生完全仿 IcoMoon 官方格式的 selection.json
const svgFiles = fs.readdirSync(srcDir).filter(f => f.endsWith('.svg'));
const validSvgFiles = [];
const icons = svgFiles.map((file, idx) => {
  const name = file.replace(/\.svg$/, "");
  const svgContent = fs.readFileSync(path.join(srcDir, file), 'utf8');
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
  validSvgFiles.push(path.join(srcDir, file));
  // 解析 viewBox
  const viewBoxMatch = svgContent.match(/viewBox=["']\s*([\d.\-]+)\s+([\d.\-]+)\s+([\d.\-]+)\s+([\d.\-]+)\s*["']/);
  const viewBox = viewBoxMatch
    ? viewBoxMatch.slice(1, 5).map(Number)
    : [0, 0, 24, 24]; // fallback
  // 解析 <path d="..." />
  const pathMatches = [...svgContent.matchAll(/<path[^>]*d=["']([^"']+)["'][^>]*>/g)];
  const paths = pathMatches.map(m => normalizePathData(m[1], viewBox, 1024));
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

// 2. 用 webfonts-generator 產生 ttf 字型
webfontsGenerator({
  files: validSvgFiles,
  dest: outDir,
  fontName: "icons",
  types: ["ttf"],
  css: false,
  startCodepoint: 59648,
  writeFiles: true,
  formatOptions: {
    ttf: {
      ts: Date.now()
    }
  },
}, function(error) {
  if (error) {
    console.error("TTF 字型產生失敗：", error);
  } else {
    console.log("TTF 字型產生完成！（給 CSS class 用）");
  }
}); 