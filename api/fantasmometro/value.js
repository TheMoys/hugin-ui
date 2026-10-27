const NAMES = ['Carlos', 'Mariam', 'Moys', 'Pipe', 'William', 'Gael', 'Rodrigo', 'Jose', 'Daniel'];

let contributions = Object.fromEntries(NAMES.map((n) => [n, 0]));

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Soporte opcional para Vercel KV / Upstash Redis para persistencia multi-instancia
  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;

  if (req.method === 'GET') {
    if (kvUrl && kvToken) {
      try {
        const response = await fetch(`${kvUrl}/get/fantasmometro_contributions`, {
          headers: { Authorization: `Bearer ${kvToken}` },
        });
        const data = await response.json();
        if (data.result) {
          const parsed = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
          return res.status(200).json({ contributions: parsed });
        }
      } catch {
        // Fallback a memoria local de la función
      }
    }
    return res.status(200).json({ contributions });
  }

  if (req.method === 'POST') {
    try {
      const parsed = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (!parsed || !NAMES.includes(parsed.name)) {
        return res.status(400).json({ error: 'invalid name' });
      }

      const requested = Number(parsed.value);
      if (!Number.isFinite(requested)) {
        return res.status(400).json({ error: 'invalid value' });
      }

      let current = { ...contributions };
      if (kvUrl && kvToken) {
        try {
          const response = await fetch(`${kvUrl}/get/fantasmometro_contributions`, {
            headers: { Authorization: `Bearer ${kvToken}` },
          });
          const data = await response.json();
          if (data.result) {
            current = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
          }
        } catch {}
      }

      const sumOthers = NAMES
        .filter((n) => n !== parsed.name)
        .reduce((sum, n) => sum + (current[n] || 0), 0);

      const maxAllowed = Math.max(0, 100 - sumOthers);
      current[parsed.name] = Math.min(maxAllowed, Math.max(0, Math.round(requested)));

      contributions = current;

      if (kvUrl && kvToken) {
        try {
          await fetch(`${kvUrl}/set/fantasmometro_contributions`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${kvToken}` },
            body: JSON.stringify(current),
          });
        } catch {}
      }

      return res.status(200).json({ contributions: current });
    } catch {
      return res.status(400).json({ error: 'invalid json' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
