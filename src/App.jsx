import React, { useState, useEffect } from 'react';
import { Flame, LayoutGrid, Compass, Monitor, Clock, RefreshCw } from 'lucide-react';
import FenixPlanning from './components/FenixPlanning';
import ProjectsBoard from './components/ProjectsBoard';
import { INITIAL_PROJECTS } from './data/initialData';

export default function App() {
  const [activeTab, setActiveTab] = useState('fenix'); // 'fenix' or 'projects'
  const [projects] = useState(INITIAL_PROJECTS);
  const [slideTimer, setSlideTimer] = useState(60); // 60 seconds rotation

  // Auto rotation every 60 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideTimer(prev => {
        if (prev <= 1) {
          // Switch view
          setActiveTab(current => (current === 'fenix' ? 'projects' : 'fenix'));
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const progressPercent = ((60 - slideTimer) / 60) * 100;

  return (
    <div className="corkboard-frame">
      <div className="corkboard-main">
        {/* Top TV Slide Progress Bar */}
        <div style={{ width: '100%', height: '5px', background: 'rgba(0,0,0,0.5)', overflow: 'hidden' }}>
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
              <Compass size={28} />
            </div>
            <div>
              <div className="brand-title">
                HUGIN-UI <span style={{ fontSize: '1.2rem' }}>🦅</span>
              </div>
              <div className="brand-subtitle">
                Pizarra de Corcho del Equipo • Modo Proyección TV
              </div>
            </div>
          </div>

          {/* Nav Tabs & Active View Indicator */}
          <div className="nav-tabs">
            <button
              className={`tab-btn ${activeTab === 'fenix' ? 'active' : ''}`}
              onClick={() => { setActiveTab('fenix'); setSlideTimer(60); }}
            >
              <Flame size={16} /> 1. Fénix Planning
            </button>
            <button
              className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => { setActiveTab('projects'); setSlideTimer(60); }}
            >
              <LayoutGrid size={16} /> 2. Estado de Proyectos ({projects.length})
            </button>
          </div>

          {/* TV Projection Status Badge */}
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.45)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '0.8rem',
              color: '#d1b89d',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <Monitor size={18} color="#34d399" />
            <div>
              <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.825rem' }}>
                Rotación Automática activa (60s)
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={12} color="#f59e0b" /> Cambiando vista en: <strong style={{ color: '#f59e0b' }}>{slideTimer}s</strong>
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
