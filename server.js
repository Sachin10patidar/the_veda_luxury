/**
 * The Veda Luxury - Full Backend & Static Server
 * Thoughtful Gifts, Beautiful Memories
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;
const DATA_DIR = path.join(PUBLIC_DIR, 'data');
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'assets', 'uploads');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

// Helper: send JSON response
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

// Helper: read request body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      // 10MB limit for image uploads
      if (body.length > 10 * 1024 * 1024) {
        req.connection.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        resolve({ raw: body });
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;

  // Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  // ==========================================
  // Backend API Endpoints
  // ==========================================

  // 1. Healthcheck / Keep-Alive ping
  if (pathname === '/api/health' || pathname === '/ping') {
    sendJson(res, 200, {
      status: 'ok',
      service: 'The Veda Luxury API',
      timestamp: new Date().toISOString(),
      uptime: Math.round(process.uptime()) + 's'
    });
    return;
  }

  // 2. GET /api/products
  if (pathname === '/api/products' && req.method === 'GET') {
    try {
      const filePath = path.join(DATA_DIR, 'products.json');
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        sendJson(res, 200, JSON.parse(data));
      } else {
        sendJson(res, 200, []);
      }
    } catch (err) {
      sendJson(res, 500, { error: 'Failed to read products', details: err.message });
    }
    return;
  }

  // 3. POST /api/products (Save/Update full products catalog)
  if (pathname === '/api/products' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      if (!Array.isArray(body)) {
        sendJson(res, 400, { error: 'Expected an array of products' });
        return;
      }
      const filePath = path.join(DATA_DIR, 'products.json');
      fs.writeFileSync(filePath, JSON.stringify(body, null, 2), 'utf8');
      sendJson(res, 200, { success: true, count: body.length });
    } catch (err) {
      sendJson(res, 500, { error: 'Failed to save products', details: err.message });
    }
    return;
  }

  // 4. POST /api/upload (Save Base64 uploaded image directly to server disk)
  if (pathname === '/api/upload' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const { image, filename } = body;

      if (!image) {
        sendJson(res, 400, { error: 'No image data provided' });
        return;
      }

      // Check if base64 data URI
      const matches = image.match(/^data:image\/([a-zA-Z0-9\+\-\.]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        sendJson(res, 400, { error: 'Invalid base64 image data URI format' });
        return;
      }

      const ext = matches[1].replace('jpeg', 'jpg');
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');

      // Generate clean unique filename
      const cleanName = (filename || 'product').replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase().slice(0, 30);
      const uniqueFilename = `${cleanName}-${Date.now()}.${ext}`;
      const savePath = path.join(UPLOADS_DIR, uniqueFilename);

      fs.writeFileSync(savePath, buffer);

      const publicUrl = `assets/uploads/${uniqueFilename}`;
      console.log(`📸 New product image saved to server: ${publicUrl}`);

      sendJson(res, 200, {
        success: true,
        url: publicUrl,
        filename: uniqueFilename
      });
    } catch (err) {
      console.error('Upload error:', err);
      sendJson(res, 500, { error: 'Failed to upload image', details: err.message });
    }
    return;
  }

  // 5. GET /api/config
  if (pathname === '/api/config' && req.method === 'GET') {
    try {
      const filePath = path.join(DATA_DIR, 'config.json');
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        sendJson(res, 200, JSON.parse(data));
      } else {
        sendJson(res, 200, {});
      }
    } catch (err) {
      sendJson(res, 500, { error: 'Failed to read config', details: err.message });
    }
    return;
  }

  // 6. POST /api/config
  if (pathname === '/api/config' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const filePath = path.join(DATA_DIR, 'config.json');
      fs.writeFileSync(filePath, JSON.stringify(body, null, 2), 'utf8');
      sendJson(res, 200, { success: true });
    } catch (err) {
      sendJson(res, 500, { error: 'Failed to save config', details: err.message });
    }
    return;
  }

  // ==========================================
  // Static File Serving
  // ==========================================
  if (pathname === '/') {
    pathname = '/index.html';
  } else if (pathname === '/admin') {
    pathname = '/admin.html';
  }

  // Safe file path resolution
  const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(PUBLIC_DIR, safePath);

  // Prevent directory traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback for SPA or return 404
      const notFoundPath = path.join(PUBLIC_DIR, 'index.html');
      fs.readFile(notFoundPath, (fallbackErr, data) => {
        if (!fallbackErr) {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
          res.end(data);
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
        }
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=86400'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`🌸 The Veda Luxury server running at http://localhost:${PORT}`);
  console.log(`📦 Storage ready: Data in /data/ and Uploads in /assets/uploads/`);

  // Start the Automatic Render Keep-Alive Service
  startKeepAlive();
});

// ============================================================================
// Automatic Render Keep-Alive Service
// Prevents Render Free Tier Web Service from sleeping after 15 minutes of inactivity
// ============================================================================
function startKeepAlive() {
  const renderUrl = process.env.RENDER_EXTERNAL_URL || process.env.APP_URL;

  if (!renderUrl) {
    console.log(`ℹ️ [Keep-Alive]: Running locally. When deployed on Render, RENDER_EXTERNAL_URL will keep the service awake 24/7.`);
    return;
  }

  const pingUrl = renderUrl.replace(/\/$/, '') + '/api/health';
  const PING_INTERVAL = 10 * 60 * 1000; // 10 minutes (Render sleep threshold is 15 mins)

  console.log(`⏰ [Keep-Alive]: Initialized. Pinging ${pingUrl} every 10 minutes to stay awake 24/7.`);

  setInterval(() => {
    const client = pingUrl.startsWith('https') ? https : http;
    client.get(pingUrl, (res) => {
      console.log(`💓 [Keep-Alive Ping]: Status ${res.statusCode} at ${new Date().toLocaleTimeString()}`);
    }).on('error', (err) => {
      console.warn(`⚠️ [Keep-Alive Ping Warning]: ${err.message}`);
    });
  }, PING_INTERVAL);
}
