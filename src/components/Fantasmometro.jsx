import React, { useEffect, useState } from 'react';
import { Ghost } from 'lucide-react';
import {
  FANTASMOMETRO_NAMES,
  FANTASMOMETRO_COLORS,
  fetchFantasmometroState,
  subscribeFantasmometro,
} from '../fantasmometroClient';

const EMPTY_CONTRIBUTIONS = Object.fromEntries(FANTASMOMETRO_NAMES.map((n) => [n, 0]));

export default function Fantasmometro() {
  const [contributions, setContributions] = useState(EMPTY_CONTRIBUTIONS);
  const [status, setStatus] = useState('connecting');

  useEffect(() => {
    fetchFantasmometroState()
      .then((state) => state.contributions && setContributions(state.contributions))
      .catch(() => {});

    const unsubscribe = subscribeFantasmometro((state) => {
      if (state.contributions) setContributions(state.contributions);
    }, setStatus);

    return unsubscribe;
  }, []);

  const total = FANTASMOMETRO_NAMES.reduce((sum, n) => sum + (contributions[n] || 0), 0);
  const totalColor = total >= 90 ? '#fb7185' : total >= 50 ? 'var(--orange-primary)' : '#4ade80';

  return (
    <div
      style={{
        flexShrink: 0,
        height: '42px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: '0 22px',
        background: 'var(--bg-header)',
        borderTop: '2px solid var(--border-subtle)',
        zIndex: 20,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <Ghost size={18} color={totalColor} />
        <span style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.06em', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
          Fantasmómetro
        </span>
      </div>

      <div style={{ position: 'relative', flex: 1, height: '26px', borderRadius: '8px', background: 'var(--bg-inner)', border: '1px solid var(--border-subtle)', overflow: 'hidden', display: 'flex' }}>
        {FANTASMOMETRO_NAMES.map((n) => {
          const pct = contributions[n] || 0;
          if (pct <= 0) return null;
          return (
            <div
              key={n}
              title={`${n}: ${pct}%`}
              style={{
                height: '100%',
                width: `${pct}%`,
                background: FANTASMOMETRO_COLORS[n],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                borderRight: '1px solid rgba(0,0,0,0.25)',
              }}
            >
              {pct >= 12 && (
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 900,
                    letterSpacing: '0.04em',
                    color: '#0b0d14',
                    whiteSpace: 'nowrap',
                    textTransform: 'uppercase',
                  }}
                >
                  {n} {pct}%
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        <span style={{ fontSize: '1.1rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: totalColor, minWidth: '48px', textAlign: 'right' }}>
          {total}%
        </span>
        <span
          title={status === 'live' ? 'Conectado en vivo' : status === 'polling' ? 'Sincronizando' : 'Sin conexión'}
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: status === 'live' ? '#4ade80' : status === 'polling' ? '#fcd34d' : '#64748b',
            flexShrink: 0,
          }}
        />
      </div>
    </div>
  );
}
