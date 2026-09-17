import React, { useState, useEffect } from 'react';
import { Flame, LayoutGrid, Compass, Monitor, Clock } from 'lucide-react';
import FenixPlanning from './components/FenixPlanning';
import ProjectsBoard from './components/ProjectsBoard';
import { INITIAL_PROJECTS } from './data/initialData';

export default function App() {
  const [activeTab, setActiveTab] = useState('fenix'); // 'fenix' or 'projects'
  const [projects] = useState(INITIAL_PROJECTS);
  const [slideTimer, setSlideTimer] = useState(15); // 60 seconds rotation

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

  const progressPercent = Math.min(100, Math.max(0, ((60 - slideTimer) / 60) * 100));

  return (
    <div className="corkboard-frame">
      <div className="corkboard-main">
        {/* Top TV Slide Progress Bar */}
        <div style={{ width: '100%', height: '6px', background: 'rgba(0,0,0,0.6)', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${progressPercent}%`,
              background: 'linear-gradient(90deg, #d97706, #3b82f6)',
              transition: 'width 1s linear'
            }}
          ></div>
        </div>

        {/* Top Header - Brass Plaque */}
        <header className="board-header">
          <div className="brand-badge">
            <div className="brand-icon-wrapper">
              <Compass size={32} />
            </div>
            <div>
              <div className="brand-title">
                HUGIN-UI <span style={{ fontSize: '1.4rem' }}>🦅</span>
              </div>
              <div className="brand-subtitle">
                Pizarra de Corcho del Equipo • Modo Proyección TV
              </div>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="nav-tabs">
            <button
              className={`tab-btn ${activeTab === 'fenix' ? 'active' : ''}`}
              onClick={() => { setActiveTab('fenix'); setSlideTimer(60); }}
            >
              <Flame size={20} /> 1. Fénix Planning
            </button>
            <button
              className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => { setActiveTab('projects'); setSlideTimer(60); }}
            >
              <LayoutGrid size={20} /> 2. Estado de Proyectos ({projects.length})
            </button>
          </div>

          {/* TV Projection Status Badge */}
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.55)',
              border: '1.5px solid rgba(255, 255, 255, 0.2)',
              padding: '10px 18px',
              borderRadius: '12px',
              fontSize: '0.9rem',
              color: '#d1b89d',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <Monitor size={22} color="#34d399" />
            <div>
              <div style={{ color: '#ffffff', fontWeight: 800, fontSize: '0.95rem' }}>
                Rotación Automática activos (60s)
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} color="#f59e0b" /> Cambiando vista en: <strong style={{ color: '#f59e0b', fontSize: '1.05rem', fontFamily: 'var(--font-mono)' }}>{slideTimer}s</strong>
              </div>
            </div>
          </div>
        </header>

        {/* Board Body Content */}
        <main className="board-content">
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
