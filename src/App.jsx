import './App.css'
import CustomIcon from './CustomIcon'
import iconSet from './assets/font/selection.json'

// 取得所有 svg-to-ttf 資料夾下的 SVG 檔案
const svgs = import.meta.glob('../../svg-to-ttf/*.svg', { eager: true, as: 'url' });

console.log(`iconSet.icons: ${JSON.stringify(iconSet.icons,null,2)}`);

function App() {
  return (
    <div className="svg-bg">
      <h1 style={{ color: 'white' }}>SVG 圖示測試頁面</h1>
      <div style={{ display: 'flex', gap: 40, justifyContent: 'center', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* 自動根據 selection.json 產生所有 CustomIcon */}
        {iconSet.icons.map(icon => (
          <div key={icon.properties.name}>
            <CustomIcon name={icon.properties.name} size={35} color="#ff9800" style={{ marginBottom: 8 }} />
            <div className="label">{icon.properties.name} (IcoMoon)</div>
          </div>
        ))}
        {/* 原本的 SVG 圖示展示 */}
        {Object.entries(svgs).map(([path, url]) => {
          const name = path.split('/').pop().replace('.svg', '');
          return (
            <div key={name}>
              <img src={url} alt={name} className="svg-icon" />
              <div className="label">{name}</div>
            </div>
          );
        })}
      </div>
      <p style={{ color: 'white', textAlign: 'center' }}>如果你看到所有 SVG 圖示，代表圖片已正確載入。</p>
    </div>
  )
}

export default App
