import './App.css'
import CustomIcon from './CustomIcon'
import iconSet from './assets/font/selection.json'

const svgs = import.meta.glob('./assets/svg-to-ttf-rename/*.svg', { eager: true, query: '?url', import: 'default' });

console.log(`iconSet.icons: ${JSON.stringify(iconSet.icons,null,2)}`);

function App() {
  return (
    <div className="svg-bg">
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center',flexWrap: 'wrap' }}>
        {/* 原本的 SVG 圖示展示 */}
        {Object.entries(svgs).map(([path, url]) => {
          const name = path.split('/').pop().replace('.svg', '');
          return (
            <div key={name}>
              <img src={url} alt={name} className="svg-icon" style={{ width: 40, height: 40 }} />
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
