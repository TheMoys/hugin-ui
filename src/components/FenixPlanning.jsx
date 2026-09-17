import React, { useState, useEffect } from 'react';
import { Calendar, Target, CheckSquare, Clock, ArrowUpRight, Flame, Award, Sparkles } from 'lucide-react';
import BusTUSWidget from './BusTUSWidget';
import { INITIAL_REVIEW, INITIAL_SPRINT_GOAL } from '../data/initialData';

export default function FenixPlanning() {
  const [review, setReview] = useState(INITIAL_REVIEW);
  const [sprintGoal, setSprintGoal] = useState(INITIAL_SPRINT_GOAL);
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

  // Toggle Review Checklist Item
  const toggleReviewItem = (id) => {
    setReview(prev => ({
      ...prev,
      checklist: prev.checklist.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    }));
  };

  // Toggle Sprint Deliverable
  const toggleDeliverable = (id) => {
    setSprintGoal(prev => {
      const updatedDeliverables = prev.deliverables.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      );
      const completedCount = updatedDeliverables.filter(d => d.completed).length;
      const newProgress = Math.round((completedCount / updatedDeliverables.length) * 100);

      return {
        ...prev,
        deliverables: updatedDeliverables,
        progress: newProgress
      };
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Section Header Title Badge */}
      <div className="section-pinned-title">
        <Flame size={24} color="#f59e0b" />
        <div>
          <h2>Sección Fénix Planning</h2>
          <p style={{ fontSize: '0.85rem', color: '#d1b89d', margin: 0 }}>
            Planificación estratégica del sprint, fechas clave de la review y movilidad en tiempo real.
          </p>
        </div>
      </div>

      <div className="fenix-grid">
        {/* LEFT COLUMN: Recordatorio Próximo Review & Objetivo del Sprint */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Card 1: Próximo Review */}
          <div className="cork-card bg-amber" style={{ transform: 'rotate(-1.2deg)' }}>
            <div className="pushpin">
              <div className="pushpin-head pushpin-red"></div>
            </div>
            <div className="washi-tape"></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#b45309', letterSpacing: '0.05em' }}>
                  RECORDATORIO DE SPRINT
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#451a03', marginTop: '4px' }}>
                  {review.title}
                </h3>
              </div>
              <div style={{ background: 'rgba(217, 119, 6, 0.15)', padding: '8px', borderRadius: '10px' }}>
                <Calendar size={22} color="#b45309" />
              </div>
            </div>

            {/* Countdown Box */}
            <div style={{ background: '#78350f', color: '#fff', padding: '14px 16px', borderRadius: '12px', marginBottom: '18px', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
              <div style={{ fontSize: '0.75rem', color: '#fef3c7', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} color="#f59e0b" /> Tiempo Restante para la Review
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '6px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fef3c7' }}>{timeLeft.days}</div>
                  <div style={{ fontSize: '0.65rem', color: '#fcd34d' }}>DÍAS</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '6px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fef3c7' }}>{timeLeft.hours}</div>
                  <div style={{ fontSize: '0.65rem', color: '#fcd34d' }}>HORAS</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '6px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fef3c7' }}>{timeLeft.minutes}</div>
                  <div style={{ fontSize: '0.65rem', color: '#fcd34d' }}>MINS</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '6px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ef4444' }}>{timeLeft.seconds}</div>
                  <div style={{ fontSize: '0.65rem', color: '#fca5a5' }}>SEGS</div>
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div style={{ marginBottom: '12px' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#78350f', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckSquare size={16} /> Checklist de Preparación para la Review
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {review.checklist.map(item => (
                  <label
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '0.875rem',
                      color: item.completed ? '#78350f' : '#292524',
                      textDecoration: item.completed ? 'line-through' : 'none',
                      opacity: item.completed ? 0.7 : 1,
                      cursor: 'pointer',
                      background: 'rgba(255, 255, 255, 0.4)',
                      padding: '8px 10px',
                      borderRadius: '8px'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleReviewItem(item.id)}
                      style={{ accentColor: '#b45309', width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    {item.text}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Objetivo del Sprint */}
          <div className="cork-card bg-yellow" style={{ transform: 'rotate(1.4deg)' }}>
            <div className="pushpin">
              <div className="pushpin-head pushpin-brass"></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div>
                <span className="handwritten" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#854d0e' }}>
                  {sprintGoal.code}
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#713f12', marginTop: '2px' }}>
                  {sprintGoal.title}
                </h3>
              </div>
              <div style={{ background: 'rgba(161, 98, 7, 0.15)', padding: '8px', borderRadius: '10px' }}>
                <Target size={22} color="#a16207" />
              </div>
            </div>

            <p style={{ fontSize: '0.9rem', color: '#451a03', lineHeight: 1.5, marginBottom: '16px' }}>
              {sprintGoal.description}
            </p>

            {/* Progress Bar */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#854d0e', marginBottom: '6px' }}>
                <span>Progreso del Objetivo</span>
                <span>{sprintGoal.progress}% Consecución</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${sprintGoal.progress}%` }}></div>
              </div>
            </div>

            {/* Deliverables */}
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#713f12', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} color="#ca8a04" /> Hitos Entregables del Sprint
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {sprintGoal.deliverables.map(d => (
                  <label
                    key={d.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '0.85rem',
                      color: d.completed ? '#854d0e' : '#1c1917',
                      textDecoration: d.completed ? 'line-through' : 'none',
                      opacity: d.completed ? 0.75 : 1,
                      cursor: 'pointer',
                      background: 'rgba(255, 255, 255, 0.45)',
                      padding: '8px 10px',
                      borderRadius: '8px'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={d.completed}
                      onChange={() => toggleDeliverable(d.id)}
                      style={{ accentColor: '#ca8a04', width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    {d.label || d.text}
                  </label>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: API TUS Santander Parada PCTCAN UNEATLANTICO */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <BusTUSWidget />
        </div>
      </div>
    </div>
  );
}
