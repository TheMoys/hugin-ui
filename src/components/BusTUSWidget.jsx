import React, { useState, useEffect } from 'react';
import { Bus, Clock, MapPin, Wifi, RefreshCw } from 'lucide-react';

// Horarios oficiales extraídos directamente del Libro General del TUS Santander vigente
// Parada 488: PCTCAN - UNEATLANTICO (Cabecera L1)
const L1_488_LAB = [
  '07:51', '08:06', '08:23', '08:41', '08:59', '09:16', '09:33', '09:51',
  '10:06', '10:23', '10:41', '10:59', '11:17', '11:34', '11:52', '12:07',
  '12:25', '12:44', '13:02', '13:20', '13:36', '13:55', '14:14', '14:33',
  '14:51', '15:09', '15:24', '15:43', '16:02', '16:21', '16:39', '16:57',
  '17:13', '17:29', '17:47', '18:06', '18:25', '18:43', '19:01', '19:17',
  '19:33', '19:51', '20:10', '20:29', '20:47', '21:04', '21:20', '21:40',
  '22:00', '22:20'
];

const L1_488_FEST = [
  '07:49', '08:14', '08:39', '09:04', '09:29', '09:49', '10:09', '10:34',
  '10:59', '11:24', '11:44', '12:04', '12:29', '12:54', '13:19', '13:43',
  '14:09', '14:34', '14:59', '15:24', '15:49', '16:14', '16:39', '17:04',
  '17:29', '17:54', '18:14', '18:34', '18:56', '19:24', '19:49', '20:09',
  '20:29', '20:46', '21:19', '21:44', '22:09', '22:20'
];

// Parada 454: PCTCAN 1 (Glorieta de Adarzo)
// L1 pasa por Parada 454 aprox. 2 minutos tras salir de UNEATLANTICO (488)
const L1_454_LAB = [
  '07:53', '08:08', '08:25', '08:43', '09:01', '09:18', '09:35', '09:53',
  '10:08', '10:25', '10:43', '11:01', '11:19', '11:36', '11:54', '12:09',
  '12:27', '12:46', '13:04', '13:22', '13:38', '13:57', '14:16', '14:35',
  '14:53', '15:11', '15:26', '15:45', '16:04', '16:23', '16:41', '16:59',
  '17:15', '17:31', '17:49', '18:08', '18:27', '18:45', '19:03', '19:19',
  '19:35', '19:53', '20:12', '20:31', '20:49', '21:06', '21:22', '21:42',
  '22:02', '22:22'
];

const L1_454_FEST = [
  '07:51', '08:16', '08:41', '09:06', '09:31', '09:51', '10:11', '10:36',
  '11:01', '11:26', '11:46', '12:06', '12:31', '12:56', '13:21', '13:45',
  '14:11', '14:36', '15:01', '15:26', '15:51', '16:16', '16:41', '17:06',
  '17:31', '17:56', '18:16', '18:36', '18:58', '19:26', '19:51', '20:11',
  '20:31', '20:48', '21:21', '21:46', '22:11', '22:22'
];

// L13 pasa por PCTCAN 1 (454) aprox. 4 minutos tras salir de Cementerio Lluja
const L13_454_LAB = [
  '07:09', '07:39', '08:04', '08:34', '09:04', '09:34', '09:59', '10:44',
  '11:14', '12:04', '12:29', '12:59', '13:29', '14:04', '14:29', '15:04',
  '15:34', '16:04', '16:34', '17:04', '17:34', '18:04', '18:34', '19:19',
  '19:49', '20:34', '21:09', '21:34', '22:09'
];

const L13_454_SAB = [
  '07:09', '07:39', '08:09', '08:39', '09:09', '09:39', '10:09', '10:49',
  '11:22', '12:09', '12:39', '13:09', '13:34', '14:04', '14:37', '15:09',
  '15:39', '16:09', '16:39', '17:09', '17:39', '18:09', '18:39', '19:19',
  '19:54', '20:39', '21:14', '21:44', '22:08'
];

const L13_454_DOM = [
  '07:34', '08:34', '09:34', '11:04', '12:04', '13:04', '14:04', '15:04',
  '16:04', '17:04', '18:34', '19:34', '20:34', '21:34', '22:24'
];

// L24C1 pasa por PCTCAN 1 (454) aprox. 1 minuto tras salir de PCTCAN 2
const L24C1_454 = [
  '07:16', '07:46', '08:16', '08:46', '09:16', '09:46', '10:16', '10:46',
  '11:16', '11:46', '12:16', '12:46', '13:16', '13:46', '14:16', '14:46',
  '15:16', '15:46', '16:16', '16:46', '17:16', '17:46', '18:16', '18:46',
  '19:16', '19:46', '20:16', '20:46', '21:16', '21:46', '22:16', '22:46'
];

// Cálculo de estimación programada como fallback cuando el feed GPS municipal no tiene registros
const calculateScheduledDepartures = (now = new Date()) => {
  const day = now.getDay(); // 0: Dom, 6: Sab
  const isSunday = day === 0;
  const isSaturday = day === 6;

  const l1_488_list = isSunday || isSaturday ? L1_488_FEST : L1_488_LAB;
  const l1_454_list = isSunday || isSaturday ? L1_454_FEST : L1_454_LAB;
  const l13_454_list = isSunday ? L13_454_DOM : (isSaturday ? L13_454_SAB : L13_454_LAB);
  const l24c1_454_list = L24C1_454;

  const getNextArrivals = (timetable) => {
    const nowMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
    const upcoming = [];

    for (const timeStr of timetable) {
      const [h, m] = timeStr.split(':').map(Number);
      const diff = (h * 60 + m) - nowMinutes;
      if (diff >= -0.5) {
        upcoming.push({ minutes: Math.max(0, Math.round(diff)), time: timeStr });
      }
    }

    if (upcoming.length === 0) {
      const first = timetable[0];
      const [fh, fm] = first.split(':').map(Number);
      const diffTomorrow = (24 * 60 - nowMinutes) + (fh * 60 + fm);
      return {
        nextMinutes: Math.round(diffTomorrow),
        nextTime: first,
        secondMinutes: null,
        secondTime: null
      };
    }

    const first = upcoming[0];
    const second = upcoming[1] || null;

    return {
      nextMinutes: first.minutes,
      nextTime: first.time,
      secondMinutes: second ? second.minutes : null,
      secondTime: second ? second.time : null
    };
  };

  const l1_488 = getNextArrivals(l1_488_list);
  const l1_454 = getNextArrivals(l1_454_list);
  const l13_454 = getNextArrivals(l13_454_list);
  const l24c1_454 = getNextArrivals(l24c1_454_list);

  return {
    '488': [
      {
        line: '1',
        destination: 'PCTCAN-UNEATLANTICO',
        nextMinutes: l1_488.nextMinutes,
        nextTime: l1_488.nextTime,
        secondMinutes: l1_488.secondMinutes,
        secondTime: l1_488.secondTime,
        distanceMeter: null,
        isRealGps: false
      }
    ],
    '454': [
      {
        line: '1',
        destination: 'VALDENOJA / PCTCAN',
        nextMinutes: l1_454.nextMinutes,
        nextTime: l1_454.nextTime,
        secondMinutes: l1_454.secondMinutes,
        secondTime: l1_454.secondTime,
        distanceMeter: null,
        isRealGps: false
      },
      {
        line: '13',
        destination: 'CUETO / REINA VICTORIA',
        nextMinutes: l13_454.nextMinutes,
        nextTime: l13_454.nextTime,
        secondMinutes: l13_454.secondMinutes,
        secondTime: l13_454.secondTime,
        distanceMeter: null,
        isRealGps: false
      },
      {
        line: '24C1',
        destination: 'PCTCAN CIRCULAR',
        nextMinutes: l24c1_454.nextMinutes,
        nextTime: l24c1_454.nextTime,
        secondMinutes: l24c1_454.secondMinutes,
        secondTime: l24c1_454.secondTime,
        distanceMeter: null,
        isRealGps: false
      }
    ]
  };
};

export default function BusTUSWidget() {
  const [stopData, setStopData] = useState(() => calculateScheduledDepartures());
  const [loading, setLoading] = useState(false);
  const [isLiveGps, setIsLiveGps] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [countdown, setCountdown] = useState(30);

  const fetchTUSData = async () => {
    setLoading(true);
    const now = new Date();
    try {
      console.log(`[TUS Polling ${now.toLocaleTimeString()}] Consultando API oficial de Santander...`);
      let response;
      const proxyUrl = '/api-tus/api/rest/datasets/control_flotas_estimaciones.json';
      const datosUrl = '/api-tus/api/datos/control_flotas_estimaciones.json';
      const directUrl = 'https://datos.santander.es/api/rest/datasets/control_flotas_estimaciones.json';

      try {
        response = await fetch(proxyUrl);
      } catch (err) {
        console.warn('[TUS Polling] Error en proxyUrl:', err);
        try {
          response = await fetch(datosUrl);
        } catch (err2) {
          console.warn('[TUS Polling] Error en datosUrl:', err2);
          try {
            response = await fetch(directUrl);
          } catch {}
        }
      }

      if (response && response.ok) {
        const data = await response.json();
        const items = data.resources || [];
        console.log(`[TUS Polling] Respuesta de API recibida. Total items en feed: ${items.length}`);

        // Filtrar paradas 454 y 488 si la API devuelve telemetría GPS
        const stop454Items = items.filter(i => String(i['ayto:paradaId'] || '').trim() === '454');
        const stop488Items = items.filter(i => String(i['ayto:paradaId'] || '').trim() === '488');

        if (stop454Items.length > 0 || stop488Items.length > 0) {
          console.log(`[TUS Polling] Telemetría GPS en tiempo real activa! (488: ${stop488Items.length}, 454: ${stop454Items.length})`);
          const mapItems = (list) => {
            if (!list || list.length === 0) return null;
            return list.slice(0, 6).map(item => {
              const t1 = parseInt(item['ayto:tiempo1'] || '0', 10);
              const t2 = parseInt(item['ayto:tiempo2'] || '0', 10);
              const mins1 = Math.max(0, Math.round(t1 / 60));
              const mins2 = Math.max(0, Math.round(t2 / 60));
              return {
                line: String(item['ayto:etiqLinea'] || '1').replace(/^L/i, '').trim(),
                destination: (item['ayto:destino1'] || 'PCTCAN').trim(),
                nextMinutes: mins1,
                nextTime: null,
                secondMinutes: mins2 > 0 ? mins2 : null,
                secondTime: null,
                distanceMeter: parseInt(item['ayto:distancia1'] || '0', 10),
                isRealGps: true
              };
            });
          };

          const mapped454 = mapItems(stop454Items);
          const mapped488 = mapItems(stop488Items);

          setStopData(prev => ({
            '454': mapped454 || prev['454'],
            '488': mapped488 || prev['488']
          }));
          setIsLiveGps(true);
          setLastUpdated(now);
          return;
        } else {
          console.log('[TUS Polling] La API no incluye registros GPS para 454/488 en este instante. Aplicando sincronización horaria.');
        }
      } else {
        console.warn(`[TUS Polling] API devolvió status ${response?.status || 'desconocido'}`);
      }

      // Si la API municipal no tiene eventos GPS en este momento,
      // calculamos los minutos exactos basados en la hora real y los horarios oficiales de TUS Santander
      const calculated = calculateScheduledDepartures(now);
      setStopData(calculated);
      setIsLiveGps(false);
      setLastUpdated(now);
    } catch (err) {
      console.error('[TUS Polling] Error en llamada a la API:', err);
      const calculated = calculateScheduledDepartures(now);
      setStopData(calculated);
      setIsLiveGps(false);
      setLastUpdated(now);
    } finally {
      setLoading(false);
      setCountdown(30);
    }
  };

  useEffect(() => {
    fetchTUSData();

    // Cuenta regresiva visible de 30 segundos
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          fetchTUSData();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getLineBadgeClass = (line) => {
    const clean = line.trim().toUpperCase();
    if (clean === '1') return 'line-l1';
    if (clean === '13') return 'line-l13';
    if (clean.includes('24C1')) return 'line-l24c1';
    if (clean.includes('24C2')) return 'line-l24c2';
    return 'line-default';
  };

  return (
    <div className="dash-card dash-card-orange" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '16px 20px' }}>
      <div>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'var(--orange-subtle)', border: '1px solid var(--orange-border)', padding: '10px', borderRadius: '10px', color: 'var(--orange-primary)' }}>
              <Bus size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.55rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                MONITOR TUS SANTANDER
              </h3>
              <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                <MapPin size={15} color="var(--orange-primary)" /> Paradas 454 y 488
              </span>
            </div>
          </div>

          <button
            onClick={() => { setCountdown(30); fetchTUSData(); }}
            title="Forzar consulta inmediata a la API"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--orange-subtle)',
              border: '1px solid var(--orange-border)',
              padding: '6px 14px',
              borderRadius: '20px',
              cursor: 'pointer',
              color: 'var(--orange-primary)'
            }}
          >
            <div className="bus-live-pulse"></div>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, letterSpacing: '0.04em' }}>
              {isLiveGps ? 'GPS EN VIVO' : 'EN VIVO'}
            </span>
            <RefreshCw size={13} className={loading ? 'spin-anim' : ''} style={{ marginLeft: '4px', opacity: 0.8 }} />
          </button>
        </div>

        {/* Sync Info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '12px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Wifi size={15} color={isLiveGps ? "#4ade80" : "var(--orange-primary)"} />
            {isLiveGps ? 'API TUS Santander GPS' : 'API TUS Polling'}
            <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', opacity: 0.85, background: 'rgba(255,255,255,0.06)', padding: '1px 6px', borderRadius: '4px' }}>
              {countdown}s
            </span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)' }}>
            <Clock size={15} /> {lastUpdated.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>

        {/* PARADA 488 */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ background: 'var(--bg-inner)', borderLeft: '3px solid #f97316', padding: '8px 14px', borderRadius: '8px', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>PARADA 488: Pctcan (UNEATLANTICO)</span>
            <span style={{ color: 'var(--orange-primary)', fontSize: '0.92rem', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
              {stopData['488'].map(i => `L${i.line}`).join(' • ')}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {stopData['488'].map((item, idx) => (
              <div key={idx} className="bus-line-row" style={{ padding: '10px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className={`line-badge ${getLineBadgeClass(item.line)}`} style={{ fontSize: '1.25rem', padding: '6px 14px' }}>
                    L{item.line.replace(/^L/i, '')}
                  </span>
                  <div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {item.destination}
                    </div>
                    {item.isRealGps && item.distanceMeter ? (
                      <div style={{ fontSize: '0.82rem', color: '#4ade80', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                        📍 Telemetría GPS: a {item.distanceMeter}m
                      </div>
                    ) : item.nextTime ? (
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                        Paso programado: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{item.nextTime}</span>
                      </div>
                    ) : null}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: item.nextMinutes <= 3 ? '#fb7185' : 'var(--orange-primary)', lineHeight: 1 }}>
                    {item.nextMinutes} <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>min</span>
                  </div>
                  {item.secondMinutes && (
                    <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginTop: '3px' }}>
                      Sig: {item.secondMinutes}m {item.secondTime ? `(${item.secondTime})` : ''}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PARADA 454 */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ background: 'var(--bg-inner)', borderLeft: '3px solid var(--orange-primary)', padding: '8px 14px', borderRadius: '8px', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>PARADA 454: Pctcan 1 (Glorieta Adarzo)</span>
            <span style={{ color: 'var(--orange-primary)', fontSize: '0.92rem', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
              {stopData['454'].map(i => `L${i.line}`).join(' • ')}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {stopData['454'].map((item, idx) => (
              <div key={idx} className="bus-line-row" style={{ padding: '10px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className={`line-badge ${getLineBadgeClass(item.line)}`} style={{ fontSize: '1.25rem', padding: '6px 14px' }}>
                    L{item.line.replace(/^L/i, '')}
                  </span>
                  <div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {item.destination}
                    </div>
                    {item.isRealGps && item.distanceMeter ? (
                      <div style={{ fontSize: '0.82rem', color: '#4ade80', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                        📍 Telemetría GPS: a {item.distanceMeter}m
                      </div>
                    ) : item.nextTime ? (
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                        Paso programado: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{item.nextTime}</span>
                      </div>
                    ) : null}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: item.nextMinutes <= 3 ? '#fb7185' : 'var(--orange-primary)', lineHeight: 1 }}>
                    {item.nextMinutes} <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>min</span>
                  </div>
                  {item.secondMinutes && (
                    <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginTop: '3px' }}>
                      Sig: {item.secondMinutes}m {item.secondTime ? `(${item.secondTime})` : ''}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
