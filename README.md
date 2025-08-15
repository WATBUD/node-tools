### NPM 套件
```bash
npm install svg-outline-stroke webfont svgpath
```
- `svg-outline-stroke`：SVG 的 stroke 轉 path 用
- `webfont`：SVG 轉 TTF 字型用
- `svgpath`：SVG path 處理

產生完可到 /src/assets/font 複製檔案


### 必要 CLI 工具:
請Homebrew安裝 [Inkscape](https://formulae.brew.sh/cask/inkscape)

確保 inkscape CLI 可用於批次 SVG 處理

如果你**不透過 Homebrew 安裝**，直接去 Inkscape 官網下載 dmg/pkg 來裝，結果會有幾個差異：

---

## 1. Finder 開啟的部分 — **一樣能用**

* 下載 `.dmg` → 打開 → 把 `Inkscape.app` 拖進 `/Applications`
* Finder 的「應用程式」裡就會出現，雙擊就能開
* 這部分跟 Homebrew 裝的是一模一樣的

---

## 2. Terminal 跑 `inkscape` 的部分 — **可能不能直接用**

* 手動安裝時，系統**不會自動幫你建立 CLI symlink**
* 所以你在 Terminal 打 `inkscape`，macOS 預設會說：

  ```
  zsh: command not found: inkscape
  ```
* 如果要自己在 Terminal 用 `inkscape` 指令，你得手動建立符號連結：

  ```bash
  sudo ln -s /Applications/Inkscape.app/Contents/MacOS/inkscape /usr/local/bin/inkscape
  ```

  這樣才會出現在 `$PATH` 裡

---

## 3. 更新與移除

* **Homebrew**：

  * 更新：`brew upgrade --cask inkscape`
  * 移除：`brew uninstall --cask inkscape`
* **手動安裝**：

  * 更新：自己去官網下載新版覆蓋舊的
  * 移除：直接刪掉 `/Applications/Inkscape.app`

---

## 4. 安全性與驗證

* **Homebrew**：會驗證 SHA256，確保下載檔沒被竄改
* **手動安裝**：靠瀏覽器 HTTPS + macOS Gatekeeper 驗證簽章

---

✅ **總結**

* GUI 開啟效果一樣
* CLI 指令（`inkscape`）的差別最大，手動裝要自己加 symlink
* Homebrew 的好處是更新、移除、驗證都自動化

---

