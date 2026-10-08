import { createServer } from 'node:http';

const PORT = process.env.PORT || 4000;

const NAMES = ['Carlos', 'Mariam', 'Moys', 'Pipe', 'William', 'Gael'];

let contributions = Object.fromEntries(NAMES.map((n) => [n, 0]));
const clients = new Set();

function sendJson(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(JSON.stringify(body));
}

function broadcast() {
  const payload = `data: ${JSON.stringify({ contributions })}\n\n`;
  for (const res of clients) res.write(payload);
}

const server = createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  if (url.pathname === '/value' && req.method === 'GET') {
    return sendJson(res, 200, { contributions });
  }

  if (url.pathname === '/value' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1e4) req.destroy();
    });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body || '{}');

        if (!NAMES.includes(parsed.name)) return sendJson(res, 400, { error: 'invalid name' });

        const requested = Number(parsed.value);
        if (!Number.isFinite(requested)) return sendJson(res, 400, { error: 'invalid value' });

        const sumOthers = NAMES
          .filter((n) => n !== parsed.name)
          .reduce((sum, n) => sum + contributions[n], 0);

        const maxAllowed = Math.max(0, 100 - sumOthers);
        contributions[parsed.name] = Math.min(maxAllowed, Math.max(0, Math.round(requested)));

        broadcast();
        sendJson(res, 200, { contributions });
      } catch {
        sendJson(res, 400, { error: 'invalid json' });
      }
    });
    return;
  }

  if (url.pathname === '/events' && req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });
    res.write(`data: ${JSON.stringify({ contributions })}\n\n`);
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }

  sendJson(res, 404, { error: 'not found' });
});

server.listen(PORT, () => {
  console.log(`fantasmometro-api listening on ${PORT}`);
});
