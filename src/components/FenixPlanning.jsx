import React, { useState, useEffect } from 'react';
import { Calendar, Target, Clock, MapPin, Sparkles, CheckCircle2, Users } from 'lucide-react';
import BusTUSWidget from './BusTUSWidget';
import { INITIAL_REVIEW, INITIAL_SPRINT_GOAL } from '../data/initialData';

export default function FenixPlanning({ review = INITIAL_REVIEW, sprintGoal = INITIAL_SPRINT_GOAL }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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
      {/* COLUMN 1: Próximo Sprint Planning / Review */}
      <div className="dash-card dash-card-orange" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '12px 14px' }}>
        <div>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px', marginBottom: '10px' }}>
            <div style={{ background: 'var(--orange-subtle)', border: '1px solid var(--orange-border)', padding: '6px', borderRadius: '8px', color: 'var(--orange-primary)' }}>
              <Calendar size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--orange-primary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                REVISIÓN DE SPRINT
              </span>
              <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: 'var(--text-primary)', margin: '1px 0 0 0' }}>
                {review.title}
              </h3>
            </div>
          </div>

          <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={14} color="var(--orange-primary)" />
            <span>TIEMPO RESTANTE</span>
          </div>

          {/* Countdown Grid - Compact */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '10px' }}>
            <div style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '6px 2px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--orange-primary)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                {timeLeft.days}
              </div>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '2px' }}>Días</div>
            </div>

            <div style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '6px 2px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                {timeLeft.hours}
              </div>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '2px' }}>Horas</div>
            </div>

            <div style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '6px 2px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                {timeLeft.minutes}
              </div>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '2px' }}>Mins</div>
            </div>

            <div style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '6px 2px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--orange-primary)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                {timeLeft.seconds}
              </div>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--orange-primary)', textTransform: 'uppercase', marginTop: '2px' }}>Segs</div>
            </div>
          </div>

          {/* Details List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-subtle)', padding: '6px 10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              <Clock size={14} color="var(--orange-primary)" />
              <span><strong>Horario:</strong> {review.scheduleText}</span>
            </div>

            <div style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-subtle)', padding: '6px 10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              <MapPin size={14} color="var(--orange-primary)" />
              <span><strong>Ubicación:</strong> {review.location}</span>
            </div>

            <div style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-subtle)', padding: '6px 10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              <Users size={14} color="var(--orange-primary)" />
              <span><strong>Convocados:</strong> Equipo Fénix + PO</span>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '8px', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
          <span>Estado del Sprint:</span>
          <span style={{ color: 'var(--orange-primary)', fontWeight: 800 }}>{review.status || 'En Progreso'}</span>
        </div>
      </div>

      {/* COLUMN 2: Objetivo del Sprint & Entregables Clave */}
      <div className="dash-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '12px 14px', borderLeft: '4px solid var(--orange-primary)' }}>
        <div>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ background: 'var(--orange-subtle)', border: '1px solid var(--orange-border)', padding: '6px', borderRadius: '8px', color: 'var(--orange-primary)' }}>
                <Target size={18} />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--orange-primary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  INICIATIVA CLAVE
                </span>
                <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: 'var(--text-primary)', margin: '1px 0 0 0' }}>
                  {sprintGoal.title}
                </h3>
              </div>
            </div>
            <span style={{ background: 'var(--orange-subtle)', color: 'var(--orange-primary)', border: '1px solid var(--orange-border)', fontWeight: 800, fontSize: '0.78rem', padding: '3px 8px', borderRadius: '4px', fontFamily: 'var(--font-mono)' }}>
              {sprintGoal.code}
            </span>
          </div>

          {/* Quote Block */}
          <div style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-subtle)', borderLeft: '3px solid var(--orange-primary)', padding: '8px 12px', borderRadius: '8px', marginBottom: '10px' }}>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-primary)', lineHeight: 1.4, fontWeight: 600, margin: 0 }}>
              "{sprintGoal.description}"
            </p>
          </div>

          {/* Entregables List */}
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Entregables Clave:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {sprintGoal.deliverables && sprintGoal.deliverables.length > 0 ? (
              sprintGoal.deliverables.map((item) => (
                <div key={item.id} style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-subtle)', padding: '6px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  <CheckCircle2 size={15} color="#4ade80" />
                  <span><strong>{item.tag}:</strong> {item.title}</span>
                </div>
              ))
            ) : (
              <div style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-subtle)', padding: '6px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                <CheckCircle2 size={15} color="#4ade80" />
                <span>Sprint Goal actualizado</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', marginTop: '8px' }}>
          <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Equipo Fénix</span>
          <span style={{ color: 'var(--orange-primary)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={13} /> Prioridad Alta
          </span>
        </div>
      </div>

      {/* COLUMN 3: Bus TUS Santander Paradas 488 y 454 */}
      <div style={{ height: '100%' }}>
        <BusTUSWidget />
      </div>
    </div>
  );
}
