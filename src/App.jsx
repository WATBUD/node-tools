import './App.css'
import CustomIcon from './CustomIcon'

// 取得所有 svg-to-ttf 資料夾下的 SVG 檔案
const svgs = import.meta.glob('../../svg-to-ttf/*.svg', { eager: true, as: 'url' });

function App() {
  return (
    <div className="svg-bg">
      <h1 style={{ color: 'white' }}>SVG 圖示測試頁面</h1>
      <div style={{ display: 'flex', gap: 40, justifyContent: 'center', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* 範例：用 CustomIcon 顯示 IcoMoon 的圖示 */}
        <div>
          <CustomIcon name="AutoBank" size={60} color="#ff9800" style={{ marginBottom: 8 }} />
          <div className="label">AutoBank (IcoMoon)</div>
        </div>
        <div>
          <CustomIcon name="BankTransfer" size={60} color="#2196f3" style={{ marginBottom: 8 }} />
          <div className="label">BankTransfer (IcoMoon)</div>
        </div>
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
