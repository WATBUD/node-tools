import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

const corsMiddleware = (req, res, next) => {
  const origin = req.headers.origin;
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    req.headers["access-control-request-headers"]
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Expose-Headers", "language, X-Custom-Header");

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Max-Age", "86400");
    res.sendStatus(204);
    return;
  }

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