import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

// CORS 中介函數，用於處理跨來源請求
const corsMiddleware = (req, res, next) => {
  const origin = req.headers.origin; // 取得請求的來源（origin）

  // 設定允許的來源為全部（*）
  // 若你希望只允許特定來源，這裡可以改成 origin 變數或固定網址
  res.header("Access-Control-Allow-Origin", "*");

  // 設定允許的 HTTP 方法
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  // 設定允許的自訂標頭，來自請求端的 "access-control-request-headers"
  res.header(
    "Access-Control-Allow-Headers",
    req.headers["access-control-request-headers"]
  );

  // 表示允許前端請求時帶上憑證（如 Cookie）
  // 注意：這和 "Access-Control-Allow-Origin: *" 不可同時存在於實務環境中
  res.header("Access-Control-Allow-Credentials", "true");

  // 告訴瀏覽器哪些 headers 可以讓前端程式碼存取
  res.header("Access-Control-Expose-Headers", "language, X-Custom-Header");

  // 如果是 preflight 預檢請求，直接回應 204（No Content），不繼續執行後續中介函數
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Max-Age", "86400"); // 設定預檢結果可快取一天（秒為單位）
    res.sendStatus(204); // 回應無內容狀態碼
    return;
  }

  // 非預檢請求則繼續往後執行
  next();
};

app.use(corsMiddleware);

const TARGET_API = "https://oambackend.chtineer.com/";
const options = {
  target: TARGET_API,
  changeOrigin: true,
  onProxyReq(proxyReq, req, res) {
    console.log(`🔄 Proxying ${req.method} ${req.originalUrl}`);
  },
  onError(err, req, res) {
    console.error("❌ Proxy error:", err.message);
    res.status(500).send("Proxy error");
  },
};

// 代理所有路径
app.use("/", createProxyMiddleware(options));

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`🚀 Proxy server is running on http://localhost:${PORT}`);
  console.log(`📡 Forwarding /* to ${TARGET_API}`);
}); 