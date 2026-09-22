import React, { useState, useEffect } from 'react';
import { Calendar, Target, Clock, MapPin, Flag } from 'lucide-react';
import BusTUSWidget from './BusTUSWidget';
import { INITIAL_REVIEW, INITIAL_SPRINT_GOAL } from '../data/initialData';

export default function FenixPlanning() {
  const [review] = useState(INITIAL_REVIEW);
  const [sprintGoal] = useState(INITIAL_SPRINT_GOAL);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Calculate countdown to next review
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(review.targetDate) - new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [review.targetDate]);

  return (
    <div className="fenix-grid">
      {/* LEFT COLUMN: Recordatorio Review & Objetivo del Sprint */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
        
        {/* Card 1: Próximo Review */}
        <div className="dash-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '4px solid #6366f1' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#818cf8', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} /> REVISIÓN DE SPRINT & PLANIFICACIÓN
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                  {review.title}
                </h3>
              </div>
              <div style={{ background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '10px', borderRadius: '12px', color: '#818cf8' }}>
                <Clock size={24} />
              </div>
            </div>

            {/* Countdown Box */}
            <div style={{ background: '#0b0f19', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '18px 20px', borderRadius: '14px', margin: '14px 0' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', justifyBetween: 'space-between', width: '100%' }}>
                <span>TIEMPO RESTANTE</span>
                <span style={{ color: '#818cf8', marginLeft: 'auto', fontFamily: 'var(--font-mono)' }}>{review.scheduleText}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', padding: '10px 6px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1 }}>{timeLeft.days}</div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, marginTop: '4px' }}>DÍAS</div>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', padding: '10px 6px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1 }}>{timeLeft.hours}</div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, marginTop: '4px' }}>HORAS</div>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', padding: '10px 6px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1 }}>{timeLeft.minutes}</div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, marginTop: '4px' }}>MINS</div>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '10px 6px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#818cf8', lineHeight: 1 }}>{timeLeft.seconds}</div>
                  <div style={{ fontSize: '0.7rem', color: '#818cf8', fontWeight: 700, marginTop: '4px' }}>SEGS</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', padding: '10px 14px', borderRadius: '10px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            <MapPin size={16} color="#38bdf8" />
            <span><strong>Ubicación:</strong> {review.location}</span>
          </div>
        </div>

        {/* Card 2: Objetivo del Sprint */}
        <div className="dash-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '4px solid #06b6d4' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#22d3ee', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Flag size={14} /> INICIATIVA CLAVE DEL EQUIPO
                </span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                  {sprintGoal.title}
                </h3>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(6, 182, 212, 0.3)', fontWeight: 700 }}>
                {sprintGoal.code}
              </span>
            </div>

            <p style={{ fontSize: '1.02rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: '8px' }}>
              {sprintGoal.description}
            </p>
          </div>

          <div style={{ background: 'rgba(6, 182, 212, 0.06)', border: '1px solid rgba(6, 182, 212, 0.15)', padding: '10px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Target size={18} color="#22d3ee" />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Prioridad crítica para la entrega del sprint activo</span>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Bus TUS Santander Paradas 488 y 487 */}
      <div style={{ height: '100%' }}>
        <BusTUSWidget />
      </div>
    </div>
  );
}

