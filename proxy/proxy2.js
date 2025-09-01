import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

// 全域 CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    req.headers["access-control-request-headers"] || "*"
  );
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// S3 Proxy
app.use("/s3", (req, res, next) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send("Missing targetUrl");

  console.log(`🟢 Proxying to S3: ${targetUrl}`);

  const u = new URL(targetUrl);

  createProxyMiddleware({
    target: `${u.protocol}//${u.host}`,
    changeOrigin: true,
    logLevel: "debug",
    pathRewrite: () => u.pathname + u.search, // 保留 query string
    onProxyReq(proxyReq) {
      proxyReq.removeHeader("origin"); // 避免 CORS
      // 保留 Content-Type
      if (req.headers["content-type"]) {
        proxyReq.setHeader("Content-Type", req.headers["content-type"]);
      }
    },
  })(req, res, next);
});

// 其他走 backend
const oscBackend = "https://oscbackend.chtineer.com";
app.use(
  "/",
  createProxyMiddleware({
    target: oscBackend,
    changeOrigin: true,
    logLevel: "debug",
  })
);

const PORT = 3003;
app.listen(PORT, () => console.log(`🚀 Proxy running at http://localhost:${PORT}`));
