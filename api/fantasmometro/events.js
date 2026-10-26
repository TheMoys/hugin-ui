export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  // En Vercel serverless no se sostienen conexiones permanentes tipo daemon.
  // El cliente en fantasmometroClient.js detecta el cierre y activa el polling automático cada 3s.
  res.status(200).send(': sse fallback to polling in serverless\n\n');
}
