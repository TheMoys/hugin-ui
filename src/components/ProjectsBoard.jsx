import React, { useState } from 'react';
import { LayoutGrid, Search, Filter, Plus, CheckCircle2, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import ProjectCard from './ProjectCard';

export default function ProjectsBoard({ projects, onUpdateStatus, onOpenAddModal }) {
  const [filterStatus, setFilterStatus] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('prioridad');

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesStatus = filterStatus === 'todos' || project.status === filterStatus;
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.lead.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'prioridad') {
      const priorityOrder = { alta: 1, media: 2, baja: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    if (sortBy === 'avance') {
      return b.progress - a.progress;
    }
    if (sortBy === 'nombre') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  // Calculate statistics
  const totalCount = projects.length;
  const inProgressCount = projects.filter(p => p.status === 'en_progreso').length;
  const blockedCount = projects.filter(p => p.status === 'bloqueado').length;
  const completedCount = projects.filter(p => p.status === 'completado').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header Title Badge */}
      <div className="section-pinned-title" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <LayoutGrid size={24} color="#3b82f6" />
          <div>
            <h2>Sección de Proyectos y Estado del Equipo</h2>
            <p style={{ fontSize: '0.85rem', color: '#d1b89d', margin: 0 }}>
              Visualización interactiva en formato tarjetas fijadas a la pizarra.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAddModal}
          style={{
            background: 'linear-gradient(135deg, #10b981, #047857)',
            color: '#ffffff',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <Plus size={18} /> Nueva Nota de Proyecto
        </button>
      </div>

      {/* Quick Summary Cards bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div style={{ background: 'rgba(30, 27, 24, 0.8)', border: '1px solid #5a381d', borderRadius: '12px', padding: '14px 18px', color: '#fff' }}>
          <div style={{ fontSize: '0.75rem', color: '#a1a1aa', fontWeight: 700, textTransform: 'uppercase' }}>TOTAL PROYECTOS</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fef3c7', marginTop: '2px' }}>{totalCount}</div>
        </div>
        <div style={{ background: 'rgba(30, 27, 24, 0.8)', border: '1px solid #065f46', borderRadius: '12px', padding: '14px 18px', color: '#fff' }}>
          <div style={{ fontSize: '0.75rem', color: '#6ee7b7', fontWeight: 700, textTransform: 'uppercase' }}>EN PROGRESO</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399', marginTop: '2px' }}>{inProgressCount}</div>
        </div>
        <div style={{ background: 'rgba(30, 27, 24, 0.8)', border: '1px solid #991b1b', borderRadius: '12px', padding: '14px 18px', color: '#fff' }}>
          <div style={{ fontSize: '0.75rem', color: '#fca5a5', fontWeight: 700, textTransform: 'uppercase' }}>BLOQUEADOS</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f87171', marginTop: '2px' }}>{blockedCount}</div>
        </div>
        <div style={{ background: 'rgba(30, 27, 24, 0.8)', border: '1px solid #1e40af', borderRadius: '12px', padding: '14px 18px', color: '#fff' }}>
          <div style={{ fontSize: '0.75rem', color: '#93c5fd', fontWeight: 700, textTransform: 'uppercase' }}>COMPLETADOS</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#60a5fa', marginTop: '2px' }}>{completedCount}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          background: 'rgba(43, 27, 16, 0.85)',
          padding: '16px 20px',
          borderRadius: '14px',
          border: '1px solid #5a381d',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {/* Search input */}
        <div style={{ position: 'relative', flexGrow: 1, minWidth: '240px' }}>
          <Search size={18} color="#a1a1aa" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Buscar por proyecto, etiqueta o responsable..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '8px',
              padding: '10px 12px 10px 38px',
              color: '#ffffff',
              fontSize: '0.875rem',
              outline: 'none'
            }}
          />
        </div>

        {/* Filter by status buttons */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'en_progreso', label: 'En Progreso 🟢' },
            { id: 'en_revision', label: 'En Revisión 🟡' },
            { id: 'bloqueado', label: 'Bloqueado 🔴' },
            { id: 'completado', label: 'Completado 🔵' },
            { id: 'planificado', label: 'Planificado 🟣' }
          ].map(st => (
            <button
              key={st.id}
              onClick={() => setFilterStatus(st.id)}
              style={{
                background: filterStatus === st.id ? '#d97706' : 'rgba(0,0,0,0.3)',
                color: filterStatus === st.id ? '#ffffff' : '#d1b89d',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Sort option */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d1b89d', fontSize: '0.8rem' }}>
          <Filter size={14} />
          <span>Ordenar por:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '6px',
              color: '#ffffff',
              padding: '6px 10px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <option value="prioridad">Prioridad</option>
            <option value="avance">Mayor Avance</option>
            <option value="nombre">Nombre A-Z</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {sortedProjects.length > 0 ? (
        <div className="projects-grid">
          {sortedProjects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onUpdateStatus={onUpdateStatus}
            />
          ))}
        </div>
      ) : (
        <div
          style={{
            background: 'rgba(43, 27, 16, 0.6)',
            border: '2px dashed #5a381d',
            borderRadius: '16px',
            padding: '40px',
            textAlign: 'center',
            color: '#fef3c7'
          }}
        >
          <Search size={48} color="#d97706" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>No se encontraron proyectos</h3>
          <p style={{ fontSize: '0.9rem', color: '#d1b89d', marginTop: '4px' }}>
            Prueba a cambiar el filtro de estado o el término de búsqueda.
          </p>
        </div>
      )}
    </div>
  );
}
