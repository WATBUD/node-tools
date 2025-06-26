import svgtofont from "svgtofont";
import path from "node:path";
import fs from "node:fs";

const srcDir = path.resolve(process.cwd(), "src/assets/svg-to-ttf");
const outDir = path.resolve(process.cwd(), "src/assets/font");

// 工具：將 24x24 path scale 到 1024x1024
function scalePathData(pathData, fromSize = 24, toSize = 1024) {
  const scale = toSize / fromSize;
  // 只處理 M/L/H/V/C/S/Q/T/A/Z/z 等 SVG path 指令
  // 這裡用簡單的正則處理數字（不處理 arc 旗標等複雜情境）
  return pathData.replace(/([\d.]+(?:e[\-+]?\d+)?)/gi, (num) => {
    return parseFloat(num) * scale;
  });
}

// 1. 產生完全仿 IcoMoon 官方格式的 selection.json
const svgFiles = fs.readdirSync(srcDir).filter(f => f.endsWith('.svg'));
const icons = svgFiles.map((file, idx) => {
  const name = file.replace(/\.svg$/, "");
  const svgContent = fs.readFileSync(path.join(srcDir, file), 'utf8');
  // 解析 <path d="..." />
  const pathMatches = [...svgContent.matchAll(/<path[^>]*d=["']([^"']+)["'][^>]*>/g)];
  // scale 每個 path 到 1024x1024
  const paths = pathMatches.map(m => scalePathData(m[1], 24, 1024));
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
});
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

// 2. 產生 ttf 字型（給 CSS class 用）
svgtofont({
  src: srcDir,
  dist: outDir,
  fontName: "icons",
  css: false,
  website: null,
  // 保證順序與 codepoint 一致
  startUnicode: 59648,
}).then(() => {
  console.log("TTF 字型產生完成！（給 CSS class 用）");
}); 