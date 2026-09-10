require("./loadEnv");
const http = require("http");
const fs = require("fs");
const path = require("path");
const { handleCatalogRequest } = require("./catalog");

const PORT = Number(process.env.API_PORT || process.env.PORT || 3006);
const BUILD = path.join(__dirname, "..", "build");

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".ico": "image/x-icon",
    ".map": "application/json",
  };
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end("Not found");
      return;
    }
    res.setHeader("Content-Type", types[ext] || "application/octet-stream");
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || "/", `http://127.0.0.1:${PORT}`);
  if (url.pathname === "/api/products") {
    handleCatalogRequest(req, res);
    return;
  }
  if (process.env.SERVE_BUILD === "1" && fs.existsSync(BUILD)) {
    const safe = path.normalize(url.pathname).replace(/^(\.\.[/\\])+/, "");
    const file = path.join(BUILD, safe === path.sep ? "index.html" : safe);
    if (fs.existsSync(file) && fs.statSync(file).isFile()) {
      sendFile(res, file);
      return;
    }
    sendFile(res, path.join(BUILD, "index.html"));
    return;
  }
  res.statusCode = 404;
  res.end("Not found");
});

if (require.main === module) {
  server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Keuzehulp API on http://localhost:${PORT}/api/products`);
  });
}

module.exports = server;
