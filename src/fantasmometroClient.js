const API_BASE = '/api-fantasmometro';

export const FANTASMOMETRO_NAMES = ['Carlos', 'Mariam', 'Moys', 'Pipe', 'William'];

export const FANTASMOMETRO_COLORS = {
  Carlos: '#38bdf8',
  Mariam: '#fb7185',
  Moys: '#facc15',
  Pipe: '#34d399',
  William: '#a78bfa',
};

export async function fetchFantasmometroState() {
  const res = await fetch(`${API_BASE}/value`);
  if (!res.ok) throw new Error('fantasmometro fetch failed');
  return res.json();
}

export async function setFantasmometroContribution(name, value) {
  const res = await fetch(`${API_BASE}/value`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, value }),
  });
  if (!res.ok) throw new Error('fantasmometro update failed');
  return res.json();
}

export function subscribeFantasmometro(onState, onStatusChange) {
  let es;
  let pollTimer;
  let closed = false;

  const startPolling = () => {
    if (pollTimer) return;
    pollTimer = setInterval(async () => {
      try {
        const state = await fetchFantasmometroState();
        onState(state);
        onStatusChange?.('polling');
      } catch {
        onStatusChange?.('offline');
      }
    }, 3000);
  };

  try {
    es = new EventSource(`${API_BASE}/events`);
    es.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data);
        onState(data);
        onStatusChange?.('live');
      } catch {
        // ignore malformed event
      }
    };
    es.onerror = () => {
      onStatusChange?.('offline');
      startPolling();
    };
  } catch {
    startPolling();
  }

  return () => {
    if (closed) return;
    closed = true;
    es?.close();
    if (pollTimer) clearInterval(pollTimer);
  };
}
