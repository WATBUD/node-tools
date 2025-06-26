import svgtofont from "svgtofont";
import path from "node:path";
import fs from "node:fs";

const srcDir = path.resolve(process.cwd(), "src/assets/svg-to-ttf");
const outDir = path.resolve(process.cwd(), "src/assets/font");

// 1. 掃描 svg 檔案，產生 selection.json
const svgFiles = fs.readdirSync(srcDir).filter(f => f.endsWith('.svg'));
const icons = svgFiles.map((file, idx) => {
  const name = file.replace(/\.svg$/, "");
  const svgContent = fs.readFileSync(path.join(srcDir, file), 'utf8');
  // 解析 <path d="..." />
  const pathMatches = [...svgContent.matchAll(/<path[^>]*d=["']([^"']+)["'][^>]*>/g)];
  const paths = pathMatches.map(m => m[1]);
  return {
    icon: {
      paths, // 寫入 SVG path
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
      code: 59648 + idx
    },
    setIdx: 0,
    setId: 1,
    iconIdx: idx
  };
});
const selection = {
  IcoMoonType: "selection",
  icons,
  height: 24,
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
console.log("已產生合併 selection.json");

// 2. 產生 ttf 字型
svgtofont({
  src: srcDir,
  dist: outDir,
  fontName: "icons",
  css: false,
  website: null,
}).then(() => {
  console.log("TTF 字型產生完成！");
}); 