import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudSun, CloudFog, CloudDrizzle, CloudRain, CloudSnow, CloudLightning, Wind, Droplets, Clock, Umbrella } from 'lucide-react';

const SANTANDER_LAT = 43.4623;
const SANTANDER_LON = -3.8099;

const WEATHER_CODE_MAP = {
  0: { label: 'Despejado', Icon: Sun, color: '#fbbf24' },
  1: { label: 'Mayormente despejado', Icon: CloudSun, color: '#fbbf24' },
  2: { label: 'Parcialmente nublado', Icon: CloudSun, color: '#cbd5e1' },
  3: { label: 'Nublado', Icon: Cloud, color: '#94a3b8' },
  45: { label: 'Niebla', Icon: CloudFog, color: '#94a3b8' },
  48: { label: 'Niebla engelante', Icon: CloudFog, color: '#94a3b8' },
  51: { label: 'Llovizna ligera', Icon: CloudDrizzle, color: '#38bdf8' },
  53: { label: 'Llovizna', Icon: CloudDrizzle, color: '#38bdf8' },
  55: { label: 'Llovizna intensa', Icon: CloudDrizzle, color: '#38bdf8' },
  56: { label: 'Llovizna helada', Icon: CloudDrizzle, color: '#38bdf8' },
  57: { label: 'Llovizna helada intensa', Icon: CloudDrizzle, color: '#38bdf8' },
  61: { label: 'Lluvia ligera', Icon: CloudRain, color: '#3b82f6' },
  63: { label: 'Lluvia', Icon: CloudRain, color: '#3b82f6' },
  65: { label: 'Lluvia intensa', Icon: CloudRain, color: '#3b82f6' },
  66: { label: 'Lluvia helada', Icon: CloudRain, color: '#3b82f6' },
  67: { label: 'Lluvia helada intensa', Icon: CloudRain, color: '#3b82f6' },
  71: { label: 'Nieve ligera', Icon: CloudSnow, color: '#e0f2fe' },
  73: { label: 'Nieve', Icon: CloudSnow, color: '#e0f2fe' },
  75: { label: 'Nieve intensa', Icon: CloudSnow, color: '#e0f2fe' },
  77: { label: 'Granizo', Icon: CloudSnow, color: '#e0f2fe' },
  80: { label: 'Chubascos ligeros', Icon: CloudRain, color: '#3b82f6' },
  81: { label: 'Chubascos', Icon: CloudRain, color: '#3b82f6' },
  82: { label: 'Chubascos intensos', Icon: CloudRain, color: '#3b82f6' },
  85: { label: 'Chubascos de nieve', Icon: CloudSnow, color: '#e0f2fe' },
  86: { label: 'Chubascos de nieve intensos', Icon: CloudSnow, color: '#e0f2fe' },
  95: { label: 'Tormenta', Icon: CloudLightning, color: '#f59e0b' },
  96: { label: 'Tormenta con granizo', Icon: CloudLightning, color: '#f59e0b' },
  99: { label: 'Tormenta severa', Icon: CloudLightning, color: '#f59e0b' },
};

const RAIN_CODES = new Set([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99]);

const FALLBACK_WEATHER = {
  temperature: 18,
  feelsLike: 17,
  humidity: 65,
  windSpeed: 12,
  code: 2,
};

const FALLBACK_FORECAST = [];

export default function WeatherWidget() {
  const [weather, setWeather] = useState(FALLBACK_WEATHER);
  const [forecast, setForecast] = useState(FALLBACK_FORECAST);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchWeather = async () => {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${SANTANDER_LAT}&longitude=${SANTANDER_LON}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code,precipitation_probability&forecast_days=2&timezone=Europe%2FMadrid`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Weather API response not ok');

      const data = await response.json();
      const current = data.current;

      setWeather({
        temperature: Math.round(current.temperature_2m),
        feelsLike: Math.round(current.apparent_temperature),
        humidity: Math.round(current.relative_humidity_2m),
        windSpeed: Math.round(current.wind_speed_10m),
        code: current.weather_code,
      });

      const hourly = data.hourly;
      if (hourly && hourly.time) {
        const now = new Date();
        const upcomingIdx = hourly.time.findIndex(t => new Date(t) > now);
        const startIdx = upcomingIdx === -1 ? 0 : upcomingIdx;
        const offsets = [2, 4, 6, 8];
        const slots = offsets
          .map(offset => startIdx + offset)
          .filter(idx => idx < hourly.time.length)
          .map(idx => ({
            time: hourly.time[idx],
            temperature: Math.round(hourly.temperature_2m[idx]),
            code: hourly.weather_code[idx],
            precipProbability: hourly.precipitation_probability[idx],
          }));
        setForecast(slots);
      }

      setLastUpdated(new Date());
    } catch (err) {
      // keep showing last known (or fallback) data on failure
    }
  };

  useEffect(() => {
    fetchWeather();
    const timer = setInterval(fetchWeather, 10 * 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  const info = WEATHER_CODE_MAP[weather.code] || WEATHER_CODE_MAP[2];
  const { Icon } = info;

  const rainSlot = forecast.find(slot => RAIN_CODES.has(slot.code) && slot.precipProbability >= 40);

  return (
    <div className="dash-card dash-card-orange" style={{ padding: '20px 26px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-subtle)', padding: '14px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={42} color={info.color} />
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--orange-primary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              CLIMA SANTANDER
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span style={{ fontSize: '3rem', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                {weather.temperature}°
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                {info.label}
              </span>
            </div>
            <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>
              Sensación: {weather.feelsLike}°
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--orange-subtle)', border: '1px solid var(--orange-border)', padding: '6px 14px', borderRadius: '20px' }}>
            <div className="bus-live-pulse"></div>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--orange-primary)', letterSpacing: '0.04em' }}>
              EN VIVO
            </span>
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Droplets size={16} color="var(--orange-primary)" /> {weather.humidity}%
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Wind size={16} color="var(--orange-primary)" /> {weather.windSpeed} km/h
            </span>
          </div>
          {lastUpdated && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              <Clock size={13} /> {lastUpdated.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
      </div>

      {rainSlot && (
        <div style={{ marginTop: '14px', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid #38bdf8', borderRadius: '10px', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: 700, color: '#7dd3fc' }}>
          <Umbrella size={18} color="#38bdf8" />
          Posible lluvia a las {new Date(rainSlot.time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} ({rainSlot.precipProbability}% prob.)
        </div>
      )}

      {forecast.length > 0 && (
        <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
          {forecast.map(slot => {
            const slotInfo = WEATHER_CODE_MAP[slot.code] || WEATHER_CODE_MAP[2];
            const SlotIcon = slotInfo.Icon;
            return (
              <div key={slot.time} style={{ flex: 1, background: 'var(--bg-inner)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '10px 6px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  {new Date(slot.time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <SlotIcon size={22} color={slotInfo.color} style={{ margin: '0 auto 4px' }} />
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                  {slot.temperature}°
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: slot.precipProbability >= 40 ? '#38bdf8' : 'var(--text-muted)', marginTop: '2px' }}>
                  {slot.precipProbability}%
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
