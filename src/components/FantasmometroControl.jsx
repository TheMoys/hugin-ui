import React, { useEffect, useRef, useState } from 'react';
import { Ghost, Minus, Plus } from 'lucide-react';
import {
  FANTASMOMETRO_NAMES,
  FANTASMOMETRO_COLORS,
  fetchFantasmometroState,
  setFantasmometroContribution,
  subscribeFantasmometro,
} from '../fantasmometroClient';

const EMPTY_CONTRIBUTIONS = Object.fromEntries(FANTASMOMETRO_NAMES.map((n) => [n, 0]));

function StepperButton({ onClick, children, ariaLabel }) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        width: '34px',
        height: '34px',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '10px',
        border: '1px solid var(--border-subtle)',
        background: 'var(--bg-inner)',
        color: 'var(--text-primary)',
      }}
    >
      {children}
    </button>
  );
}

export default function FantasmometroControl() {
  const [contributions, setContributions] = useState(EMPTY_CONTRIBUTIONS);
  const [status, setStatus] = useState('connecting');
  const sendTimers = useRef({});

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

  const pushContribution = (name, next) => {
    setContributions((prev) => ({ ...prev, [name]: next }));
    clearTimeout(sendTimers.current[name]);
    sendTimers.current[name] = setTimeout(() => {
      setFantasmometroContribution(name, next).catch(() => setStatus('offline'));
    }, 80);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        padding: '28px 18px 44px',
        background: 'var(--bg-app)',
        color: 'var(--text-primary)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Ghost size={24} color={totalColor} />
        <h1 style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '0.04em', textTransform: 'uppercase', margin: 0 }}>
          Fantasmómetro
        </h1>
      </div>

      <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: totalColor }}>
            {total}%
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {100 - total}% libre
          </span>
        </div>

        <div style={{ height: '18px', borderRadius: '8px', background: 'var(--bg-inner)', border: '1px solid var(--border-subtle)', overflow: 'hidden', display: 'flex' }}>
          {FANTASMOMETRO_NAMES.map((name) => {
            const pct = contributions[name] || 0;
            if (pct <= 0) return null;
            return (
              <div
                key={name}
                style={{
                  height: '100%',
                  width: `${pct}%`,
                  background: FANTASMOMETRO_COLORS[name],
                  transition: 'width 0.3s ease',
                  borderRight: '1px solid rgba(0,0,0,0.25)',
                }}
              />
            );
          })}
        </div>
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        {FANTASMOMETRO_NAMES.map((name, idx) => {
          const value = contributions[name] || 0;
          const remaining = 100 - (total - value);
          const color = FANTASMOMETRO_COLORS[name];
          return (
            <div
              key={name}
              style={{
                padding: '12px 16px',
                borderTop: idx > 0 ? '1px solid var(--border-subtle)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.98rem', fontWeight: 800 }}>{name}</span>
                </div>
                <span style={{ fontSize: '1.05rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color }}>{value}%</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <StepperButton ariaLabel={`Restar a ${name}`} onClick={() => pushContribution(name, Math.max(0, value - 5))}>
                  <Minus size={16} />
                </StepperButton>

                <input
                  type="range"
                  min={0}
                  max={remaining}
                  value={value}
                  onChange={(e) => pushContribution(name, Number(e.target.value))}
                  style={{ flex: 1, height: '30px', accentColor: color }}
                />

                <StepperButton ariaLabel={`Sumar a ${name}`} onClick={() => pushContribution(name, Math.min(remaining, value + 5))}>
                  <Plus size={16} />
                </StepperButton>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: status === 'live' ? '#4ade80' : status === 'polling' ? '#fcd34d' : '#64748b',
          }}
        />
        {status === 'live' ? 'Conectado en vivo' : status === 'polling' ? 'Sincronizando…' : 'Conectando…'}
      </div>
    </div>
  );
}
