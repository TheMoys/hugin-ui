import React, { useState, useEffect } from 'react';
import { Flame, LayoutGrid, Activity, Monitor, Clock, ShieldCheck } from 'lucide-react';
import FenixPlanning from './components/FenixPlanning';
import ProjectsBoard from './components/ProjectsBoard';
import { INITIAL_PROJECTS } from './data/initialData';

export default function App() {
  const [activeTab, setActiveTab] = useState('fenix'); // 'fenix' or 'projects'
  const [projects] = useState(INITIAL_PROJECTS);
  const [slideTimer, setSlideTimer] = useState(15); // 15 seconds rotation for testing / preview

  // Tick timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      setSlideTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Switch tab when countdown reaches 0
  useEffect(() => {
    if (slideTimer <= 0) {
      setActiveTab(prev => (prev === 'fenix' ? 'projects' : 'fenix'));
      setSlideTimer(15);
    }
  }, [slideTimer]);

  const progressPercent = Math.min(100, Math.max(0, ((15 - slideTimer) / 15) * 100));

  return (
    <div className="dashboard-frame">
      <div className="dashboard-main">
        {/* Top TV Slide Progress Bar */}
        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${progressPercent}%`,
              background: 'linear-gradient(90deg, #6366f1, #06b6d4, #10b981)',
              transition: 'width 1s linear',
              boxShadow: '0 0 10px rgba(99, 102, 241, 0.8)'
            }}
          ></div>
        </div>

        {/* Executive Header */}
        <header className="dashboard-header">
          <div className="brand-badge">
            <div className="brand-icon-wrapper">
              <Activity size={26} />
            </div>
            <div>
              <div className="brand-title">
                HUGIN CONTROL CENTER
                <span style={{ fontSize: '0.75rem', padding: '3px 8px', background: 'rgba(99, 102, 241, 0.2)', border: '1px solid rgba(99, 102, 241, 0.4)', borderRadius: '6px', color: '#a5b4fc', fontWeight: 600, letterSpacing: '0.05em' }}>
                  PRO
                </span>
              </div>
              <div className="brand-subtitle">
                Panel Operativo y de Proyectos del Equipo • Transmisión en Tiempo Real
              </div>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="nav-tabs">
            <button
              className={`tab-btn ${activeTab === 'fenix' ? 'active' : ''}`}
              onClick={() => { setActiveTab('fenix'); setSlideTimer(15); }}
            >
              <Flame size={18} /> Planificación Fénix
            </button>
            <button
              className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => { setActiveTab('projects'); setSlideTimer(15); }}
            >
              <LayoutGrid size={18} /> Proyectos Activos ({projects.length})
            </button>
          </div>

          {/* TV Projection Status Badge */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '8px 16px',
              borderRadius: '12px',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Monitor size={20} color="#38bdf8" />
              <span style={{ position: 'absolute', top: -2, right: -2, width: 7, height: 7, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }}></span>
            </div>
            <div>
              <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={14} color="#34d399" /> Modo Proyección Activo
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '1px' }}>
                <Clock size={13} color="#f59e0b" /> Rotación en: <strong style={{ color: '#f59e0b', fontSize: '0.9rem', fontFamily: 'var(--font-mono)' }}>{slideTimer}s</strong>
              </div>
            </div>
          </div>
        </header>

        {/* Board Body Content */}
        <main className="dashboard-content">
          {activeTab === 'fenix' ? (
            <FenixPlanning />
          ) : (
            <ProjectsBoard projects={projects} />
          )}
        </main>
      </div>
    </div>
  );
}

