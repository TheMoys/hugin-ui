import React, { useState, useEffect } from 'react';
import { Calendar, Target, Clock, MapPin, Sparkles } from 'lucide-react';
import BusTUSWidget from './BusTUSWidget';
import { INITIAL_REVIEW, INITIAL_SPRINT_GOAL } from '../data/initialData';

export default function FenixPlanning() {
  const [review] = useState(INITIAL_REVIEW);
  const [sprintGoal] = useState(INITIAL_SPRINT_GOAL);
  const [timeLeft, setTimeLeft] = useState({ days: 8, hours: 2, minutes: 53, seconds: 38 });

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
        setTimeLeft({ days: 8, hours: 2, minutes: 53, seconds: 38 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [review.targetDate]);

  return (
    <div className="fenix-grid">
      {/* LEFT COLUMN: Recordatorio Review & Objetivo del Sprint */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', height: '100%' }}>

        {/* Card 1: Próximo Review */}
        <div className="dash-card dash-card-orange" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ background: 'var(--orange-subtle)', border: '1px solid var(--orange-border)', padding: '12px', borderRadius: '12px', color: 'var(--orange-primary)' }}>
                <Calendar size={26} />
              </div>
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--orange-primary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  REVISIÓN DE SPRINT & PLANIFICACIÓN
                </span>
                <h3 style={{ fontSize: '1.55rem', fontWeight: 800, color: 'var(--text-primary)', margin: '2px 0 0 0' }}>
                  {review.title}
                </h3>
              </div>
            </div>
          </div>

          <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} color="var(--orange-primary)" />
            <span>TIEMPO RESTANTE ({review.scheduleText})</span>
          </div>

          {/* Countdown Grid - Sleek Large Numbers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '18px' }}>
            <div style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '14px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--orange-primary)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                {timeLeft.days}
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '6px' }}>Días</div>
            </div>

            <div style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '14px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                {timeLeft.hours}
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '6px' }}>Horas</div>
            </div>

            <div style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '14px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                {timeLeft.minutes}
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '6px' }}>Mins</div>
            </div>

            <div style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '14px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--orange-primary)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                {timeLeft.seconds}
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--orange-primary)', textTransform: 'uppercase', marginTop: '6px' }}>Segs</div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-subtle)', padding: '12px 18px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            <MapPin size={18} color="var(--orange-primary)" />
            <span><strong>Ubicación:</strong> {review.location}</span>
          </div>
        </div>

        {/* Card 2: Objetivo del Sprint */}
        <div className="dash-card" style={{ flex: 1, padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '3px solid var(--orange-primary)' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ background: 'var(--orange-subtle)', border: '1px solid var(--orange-border)', padding: '12px', borderRadius: '12px', color: 'var(--orange-primary)' }}>
                  <Target size={26} />
                </div>
                <div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--orange-primary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    SPRINT ACTUAL • INICIATIVA CLAVE
                  </span>
                  <h3 style={{ fontSize: '1.55rem', fontWeight: 800, color: 'var(--text-primary)', margin: '2px 0 0 0' }}>
                    {sprintGoal.title}
                  </h3>
                </div>
              </div>
              <span style={{ background: 'var(--orange-subtle)', color: 'var(--orange-primary)', border: '1px solid var(--orange-border)', fontWeight: 700, fontSize: '0.88rem', padding: '6px 14px', borderRadius: '8px', fontFamily: 'var(--font-mono)' }}>
                {sprintGoal.code}
              </span>
            </div>

            <div style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-subtle)', padding: '20px', borderRadius: '14px', marginTop: '12px' }}>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-primary)', lineHeight: 1.5, fontWeight: 600, margin: 0 }}>
                "{sprintGoal.description}"
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 500 }}>Responsable: Equipo de Desarrollo Fénix</span>
            <span style={{ fontSize: '0.95rem', color: 'var(--orange-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} /> Prioridad Alta
            </span>
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

