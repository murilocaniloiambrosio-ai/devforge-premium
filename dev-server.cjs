const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const port = Number(process.argv[2] || 4173);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

function send(res, status, body, type = 'text/plain; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': type });
  res.end(body);
}

http
  .createServer((req, res) => {
    const requestUrl = new URL(req.url, `http://127.0.0.1:${port}`);
    let pathname = decodeURIComponent(requestUrl.pathname);
    if (pathname === '/') pathname = '/index.html';

    const filePath = path.resolve(root, `.${pathname}`);
    if (!filePath.startsWith(root)) {
      send(res, 403, 'Forbidden');
      return;
    }

    fs.readFile(filePath, (error, data) => {
      if (error) {
        send(res, 404, 'Not found');
        return;
      }

      send(res, 200, data, types[path.extname(filePath).toLowerCase()] || 'application/octet-stream');
    });
  })
  .listen(port, '127.0.0.1', () => {
    console.log(`DevForge static server running at http://127.0.0.1:${port}`);
  });
