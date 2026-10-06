import React, { useState, useEffect, useCallback } from 'react';
import { Flame, LayoutGrid, Activity, Monitor, Clock, Settings, Radio } from 'lucide-react';
import FenixPlanning from './components/FenixPlanning';
import ProjectsBoard from './components/ProjectsBoard';
import EditDashboardModal from './components/EditDashboardModal';
import MuninChatView from './components/MuninChatView';
import { INITIAL_PROJECTS, INITIAL_REVIEW, INITIAL_SPRINT_GOAL } from './data/initialData';

// URL del backend de Munin Assistant (soporta localhost, IP de red local o dominio en la nube)
const MUNIN_API_URL = import.meta.env.VITE_MUNIN_API_URL || 
  (typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:8088` : 'http://localhost:8088');

export default function App() {
  const queryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const isTvLocked = queryParams?.get('mode') === 'tv';

  // Si ?mode=tv está presente, la TV inicia en modo proyección ('fenix').
  // En cualquier otro caso (móvil, app PWA, PC), arranca de forma predeterminada en 'copilot' (Munin Assistant).
  const [activeTab, setActiveTab] = useState(() => {
    if (isTvLocked) return 'fenix';
    if (queryParams?.get('tab') === 'fenix') return 'fenix';
    if (queryParams?.get('tab') === 'projects') return 'projects';
    return 'copilot';
  });

  const [slideTimer, setSlideTimer] = useState(15);

  // Estados dinámicos sincronizados con Munin Assistant
  const [review, setReview] = useState(INITIAL_REVIEW);
  const [sprintGoal, setSprintGoal] = useState(INITIAL_SPRINT_GOAL);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  
  // Estado de conexión con Munin
  const [isMuninConnected, setIsMuninConnected] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Consulta el backend de Munin Assistant
  const fetchDashboardData = useCallback(async () => {
    try {
      const res = await fetch(`${MUNIN_API_URL}/api/hugin/data`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json && json.status === 'ok' && json.data) {
        if (json.data.review) setReview(json.data.review);
        if (json.data.sprintGoal) setSprintGoal(json.data.sprintGoal);
        if (json.data.projects && Array.isArray(json.data.projects)) setProjects(json.data.projects);
        setIsMuninConnected(true);
      }
    } catch {
      // Fallback silencioso a datos locales
      setIsMuninConnected(false);
    }
  }, []);

  // Polling automático cada 10 segundos para actualizar sin recargar la TV
  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 10000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  // Rotación automática entre pestañas cada 15 segundos (solo en vistas de proyección TV)
  useEffect(() => {
    if (activeTab === 'copilot') return; // En Copilot no rota para permitir chatear y dictar
    const interval = setInterval(() => {
      setSlideTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'copilot') return;
    if (slideTimer <= 0) {
      setActiveTab(prev => (prev === 'fenix' ? 'projects' : 'fenix'));
      setSlideTimer(15);
    }
  }, [slideTimer, activeTab]);

  const handleSaveModal = async (updatedData) => {
    try {
      const res = await fetch(`${MUNIN_API_URL}/api/hugin/data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          if (json.data.review) setReview(json.data.review);
          if (json.data.sprintGoal) setSprintGoal(json.data.sprintGoal);
          if (json.data.projects) setProjects(json.data.projects);
        }
      } else {
        if (updatedData.review) setReview(updatedData.review);
        if (updatedData.sprintGoal) setSprintGoal(updatedData.sprintGoal);
        if (updatedData.projects) setProjects(updatedData.projects);
      }
    } catch {
      if (updatedData.review) setReview(updatedData.review);
      if (updatedData.sprintGoal) setSprintGoal(updatedData.sprintGoal);
      if (updatedData.projects) setProjects(updatedData.projects);
    }
  };

  const handleResetModal = async () => {
    try {
      const res = await fetch(`${MUNIN_API_URL}/api/hugin/reset`, { method: 'POST' });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setReview(json.data.review);
          setSprintGoal(json.data.sprintGoal);
          setProjects(json.data.projects);
        }
      } else {
        setReview(INITIAL_REVIEW);
        setSprintGoal(INITIAL_SPRINT_GOAL);
        setProjects(INITIAL_PROJECTS);
      }
    } catch {
      setReview(INITIAL_REVIEW);
      setSprintGoal(INITIAL_SPRINT_GOAL);
      setProjects(INITIAL_PROJECTS);
    }
    setIsEditModalOpen(false);
  };

  const progressPercent = Math.min(100, Math.max(0, ((15 - slideTimer) / 15) * 100));

  return (
    <div className="dashboard-frame">
      <div className="dashboard-main">
        {/* Sleek Top Progress Line (solo en modo rotación TV) */}
        {activeTab !== 'copilot' && (
          <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${progressPercent}%`,
                background: 'var(--orange-primary)',
                transition: 'width 1s linear'
              }}
            ></div>
          </div>
        )}

        {/* Executive Header */}
        <header className="dashboard-header">
          <div className="brand-badge">
            <div className="brand-icon-wrapper">
              <Activity size={24} />
            </div>
            <div>
              <div className="brand-title">
                HUGIN CONTROL CENTER
                <span style={{ fontSize: '0.85rem', padding: '3px 10px', background: 'var(--orange-subtle)', border: '1px solid var(--orange-border)', borderRadius: '6px', color: 'var(--orange-primary)', fontWeight: 700 }}>
                  EQUIPO FÉNIX
                </span>
              </div>
              <div className="brand-subtitle">
                Panel Operativo y Copiloto de IA
              </div>
            </div>
          </div>

          {/* Nav Tabs Principales */}
          <div className="nav-tabs">
            {/* Pestaña Munin Copilot (visible en móvil y PC; oculta en modo ?mode=tv para la sala) */}
            {!isTvLocked && (
              <button
                className={`tab-btn ${activeTab === 'copilot' ? 'active' : ''}`}
                onClick={() => setActiveTab('copilot')}
                style={{
                  border: activeTab === 'copilot' ? '1px solid #38bdf8' : '1px solid rgba(56, 189, 248, 0.3)',
                  color: activeTab === 'copilot' ? '#ffffff' : '#38bdf8',
                  background: activeTab === 'copilot' ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'rgba(0, 117, 168, 0.1)',
                  fontWeight: 800,
                  boxShadow: activeTab === 'copilot' ? '0 0 12px rgba(2, 132, 199, 0.5)' : 'none'
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>🦅</span> Munin Copilot
              </button>
            )}

            <button
              className={`tab-btn ${activeTab === 'fenix' ? 'active' : ''}`}
              onClick={() => { setActiveTab('fenix'); setSlideTimer(15); }}
            >
              <Flame size={20} /> Planificación Fénix
            </button>
            <button
              className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => { setActiveTab('projects'); setSlideTimer(15); }}
            >
              <LayoutGrid size={20} /> Proyectos Activos ({projects.length})
            </button>
          </div>

          {/* Right Header Status Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Munin Sync Status Badge */}
            <div
              onClick={() => setIsEditModalOpen(true)}
              title="Sincronización Huginn & Muninn. Haz clic para editar manualmente."
              className="header-badge"
            >
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.1rem' }}>🦅</span>
                <span style={{
                  position: 'absolute',
                  bottom: -1,
                  right: -3,
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: isMuninConnected ? '#22c55e' : '#f59e0b',
                  boxShadow: isMuninConnected ? '0 0 6px #22c55e' : 'none'
                }}></span>
              </div>
              <div>
                <div style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.82rem', lineHeight: 1.1 }}>
                  Munin
                </div>
                <div className="hide-compact" style={{ color: isMuninConnected ? '#4ade80' : 'var(--text-muted)', fontSize: '0.72rem', marginTop: '1px', fontWeight: 600 }}>
                  {isMuninConnected ? 'En línea' : 'Modo Local'}
                </div>
              </div>
            </div>

            {/* Quick Edit Button */}
            <button
              onClick={() => setIsEditModalOpen(true)}
              title="Ajustes y edición del Dashboard"
              style={{
                background: 'var(--bg-inner)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                padding: '6px 8px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Settings size={16} color="var(--orange-primary)" />
            </button>

            {/* Projection Status Badge (visible en modo TV) */}
            {activeTab !== 'copilot' && (
              <div className="header-badge">
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Monitor size={16} color="var(--orange-primary)" />
                  <span style={{ position: 'absolute', top: -1, right: -1, width: 6, height: 6, borderRadius: '50%', background: 'var(--orange-primary)' }}></span>
                </div>
                <div>
                  <div className="hide-compact" style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.82rem', lineHeight: 1.1 }}>
                    TV
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={11} color="var(--orange-primary)" /> <strong style={{ color: 'var(--orange-primary)', fontFamily: 'var(--font-mono)' }}>{slideTimer}s</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Board Body Content */}
        <main
          className="dashboard-content"
          style={{
            overflow: activeTab === 'copilot' ? 'hidden' : 'auto',
            padding: activeTab === 'copilot' ? 0 : undefined,
            height: 'calc(100vh - 72px)',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {activeTab === 'copilot' ? (
            <MuninChatView
              apiUrl={MUNIN_API_URL}
              isMuninConnected={isMuninConnected}
              onSwitchToTvMode={() => { setActiveTab('fenix'); setSlideTimer(15); }}
              isTvAvailable={true}
            />
          ) : activeTab === 'fenix' ? (
            <FenixPlanning review={review} sprintGoal={sprintGoal} />
          ) : (
            <ProjectsBoard projects={projects} />
          )}
        </main>
      </div>

      {/* Quick Edit Modal */}
      <EditDashboardModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        data={{ review, sprintGoal, projects }}
        onSave={handleSaveModal}
        onReset={handleResetModal}
        isMuninConnected={isMuninConnected}
      />
    </div>
  );
}
