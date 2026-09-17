import React, { useState, useEffect } from 'react';
import { Calendar, Target, Clock, Flame } from 'lucide-react';
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', height: '100%', justifyContent: 'space-between' }}>
        
        {/* Card 1: Próximo Review */}
        <div className="cork-card bg-amber" style={{ transform: 'rotate(-1.2deg)', padding: '32px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div className="pushpin">
            <div className="pushpin-head pushpin-red"></div>
          </div>
          <div className="washi-tape"></div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <span style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', color: '#b45309', letterSpacing: '0.06em' }}>
                RECORDATORIO DE SPRINT REVIEW
              </span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#451a03', marginTop: '6px' }}>
                {review.title}
              </h3>
            </div>
            <div style={{ background: 'rgba(217, 119, 6, 0.2)', padding: '12px', borderRadius: '14px' }}>
              <Calendar size={32} color="#b45309" />
            </div>
          </div>

          {/* Countdown Box */}
          <div style={{ background: '#78350f', color: '#fff', padding: '22px 24px', borderRadius: '16px', margin: '14px 0', boxShadow: '0 8px 20px rgba(0,0,0,0.3)' }}>
            <div style={{ fontSize: '0.9rem', color: '#fef3c7', textTransform: 'uppercase', fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="#f59e0b" /> TIEMPO RESTANTE (VIERNES 14:00 CADA 2 SEMANAS)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px 8px', borderRadius: '10px' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fef3c7', lineHeight: 1 }}>{timeLeft.days}</div>
                <div style={{ fontSize: '0.8rem', color: '#fcd34d', fontWeight: 800, marginTop: '4px' }}>DÍAS</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px 8px', borderRadius: '10px' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fef3c7', lineHeight: 1 }}>{timeLeft.hours}</div>
                <div style={{ fontSize: '0.8rem', color: '#fcd34d', fontWeight: 800, marginTop: '4px' }}>HORAS</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px 8px', borderRadius: '10px' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fef3c7', lineHeight: 1 }}>{timeLeft.minutes}</div>
                <div style={{ fontSize: '0.8rem', color: '#fcd34d', fontWeight: 800, marginTop: '4px' }}>MINS</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px 8px', borderRadius: '10px' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ef4444', lineHeight: 1 }}>{timeLeft.seconds}</div>
                <div style={{ fontSize: '0.8rem', color: '#fca5a5', fontWeight: 800, marginTop: '4px' }}>SEGS</div>
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.55)', padding: '14px 18px', borderRadius: '12px', fontSize: '1.05rem', color: '#78350f', fontWeight: 800 }}>
            📍 {review.location}
          </div>
        </div>

        {/* Card 2: Objetivo del Sprint */}
        <div className="cork-card bg-yellow" style={{ transform: 'rotate(1.4deg)', padding: '32px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div className="pushpin">
            <div className="pushpin-head pushpin-brass"></div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div>
              <span className="handwritten" style={{ fontSize: '1.8rem', fontWeight: 700, color: '#854d0e' }}>
                {sprintGoal.code}
              </span>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#713f12', marginTop: '2px' }}>
                {sprintGoal.title}
              </h3>
            </div>
            <div style={{ background: 'rgba(161, 98, 7, 0.2)', padding: '12px', borderRadius: '14px' }}>
              <Target size={32} color="#a16207" />
            </div>
          </div>

          <p style={{ fontSize: '1.25rem', color: '#451a03', lineHeight: 1.6, fontWeight: 600 }}>
            {sprintGoal.description}
          </p>
        </div>

      </div>

      {/* RIGHT COLUMN: Bus TUS Santander Paradas 488 y 487 */}
      <div style={{ height: '100%' }}>
        <BusTUSWidget />
      </div>
    </div>
  );
}
