import React, { useState } from 'react';
import { Flame, LayoutGrid, Plus, Compass, Bus, Calendar, CheckSquare, Sparkles, Pin } from 'lucide-react';
import FenixPlanning from './components/FenixPlanning';
import ProjectsBoard from './components/ProjectsBoard';
import AddNoteModal from './components/AddNoteModal';
import { INITIAL_PROJECTS } from './data/initialData';

export default function App() {
  const [activeTab, setActiveTab] = useState('all'); // 'fenix', 'projects', 'all'
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Update status of project
  const handleUpdateStatus = (id, newStatus) => {
    setProjects(prev =>
      prev.map(p => {
        if (p.id === id) {
          const newProgress = newStatus === 'completado' ? 100 : newStatus === 'planificado' ? 0 : p.progress;
          return { ...p, status: newStatus, progress: newProgress };
        }
        return p;
      })
    );
  };

  // Add new project note
  const handleAddProject = (newProject) => {
    setProjects(prev => [newProject, ...prev]);
  };

  return (
    <div className="corkboard-frame">
      <div className="corkboard-main">
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
                Pizarra de Corcho del Equipo & Movilidad TUS Santander
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="nav-tabs">
            <button
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              <Compass size={16} /> Ver Pizarra Completa
            </button>
            <button
              className={`tab-btn ${activeTab === 'fenix' ? 'active' : ''}`}
              onClick={() => setActiveTab('fenix')}
            >
              <Flame size={16} /> Fénix Planning
            </button>
            <button
              className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              <LayoutGrid size={16} /> Proyectos ({projects.length})
            </button>
          </div>

          {/* Action button */}
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              background: 'linear-gradient(135deg, #d97706, #b45309)',
              color: '#ffffff',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Plus size={18} /> Nueva Nota
          </button>
        </header>

        {/* Board Body Content */}
        <main className="board-content">
          {activeTab === 'all' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '44px' }}>
              <FenixPlanning />
              <div style={{ borderTop: '2px dashed rgba(255, 255, 255, 0.15)', paddingTop: '32px' }}>
                <ProjectsBoard
                  projects={projects}
                  onUpdateStatus={handleUpdateStatus}
                  onOpenAddModal={() => setIsModalOpen(true)}
                />
              </div>
            </div>
          )}

          {activeTab === 'fenix' && (
            <FenixPlanning />
          )}

          {activeTab === 'projects' && (
            <ProjectsBoard
              projects={projects}
              onUpdateStatus={handleUpdateStatus}
              onOpenAddModal={() => setIsModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Modal for adding notes */}
      <AddNoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddProject={handleAddProject}
      />
    </div>
  );
}
