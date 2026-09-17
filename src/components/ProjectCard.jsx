import React from 'react';
import { AlertTriangle, CheckCircle, Clock, Tag, User, Layers, CheckSquare } from 'lucide-react';

export default function ProjectCard({ project, onUpdateStatus, onDeleteNote, onToggleTask }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'en_progreso':
        return { label: 'En Progreso 🟢', className: 'badge-en_progreso' };
      case 'en_revision':
        return { label: 'En Revisión 🟡', className: 'badge-en_revision' };
      case 'completado':
        return { label: 'Completado 🔵', className: 'badge-completado' };
      case 'bloqueado':
        return { label: 'Bloqueado 🔴', className: 'badge-bloqueado' };
      case 'planificado':
        return { label: 'Planificado 🟣', className: 'badge-planificado' };
      default:
        return { label: status, className: 'badge-en_progreso' };
    }
  };

  const getPinColor = (color) => {
    switch (color) {
      case 'mint': return 'pushpin-green';
      case 'blue': return 'pushpin-blue';
      case 'pink': return 'pushpin-red';
      case 'amber': return 'pushpin-brass';
      default: return 'pushpin-red';
    }
  };

  const badgeInfo = getStatusBadge(project.status);

  return (
    <div
      className={`cork-card bg-${project.color || 'yellow'}`}
      style={{
        transform: `rotate(${project.rotation || 0}deg)`
      }}
    >
      {/* Pushpin */}
      <div className="pushpin">
        <div className={`pushpin-head ${getPinColor(project.color)}`}></div>
      </div>

      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <span className="handwritten" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#3f3f46' }}>
            #{project.code}
          </span>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#18181b', lineHeight: 1.3, marginTop: '2px' }}>
            {project.title}
          </h3>
        </div>
        <span className={`status-badge ${badgeInfo.className}`}>
          {badgeInfo.label}
        </span>
      </div>

      {/* Description */}
      <p style={{ fontSize: '0.875rem', color: '#27272a', lineHeight: 1.45, marginBottom: '14px', flexGrow: 1 }}>
        {project.description}
      </p>

      {/* Blocker Alert Note */}
      {project.status === 'bloqueado' && project.blockerReason && (
        <div style={{ background: '#fee2e2', borderLeft: '4px solid #ef4444', padding: '8px 10px', borderRadius: '6px', fontSize: '0.8rem', color: '#991b1b', marginBottom: '14px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
          <AlertTriangle size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Motivo del Bloqueo:</strong> {project.blockerReason}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, color: '#3f3f46', marginBottom: '4px' }}>
          <span>Progreso ({project.tasksCount?.done || 0}/{project.tasksCount?.total || 0} tareas)</span>
          <span>{project.progress}%</span>
        </div>
        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{
              width: `${project.progress}%`,
              background: project.status === 'completado' ? '#3b82f6' : project.status === 'bloqueado' ? '#ef4444' : undefined
            }}
          ></div>
        </div>
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
        {project.tags.map((tag, idx) => (
          <span key={idx} className="tag-chip">
            #{tag}
          </span>
        ))}
      </div>

      {/* Footer Info & Team Avatars */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px stroke rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <User size={14} color="#52525b" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#3f3f46' }}>
            {project.lead}
          </span>
        </div>

        {/* Status Dropdown Selector */}
        <select
          value={project.status}
          onChange={(e) => onUpdateStatus(project.id, e.target.value)}
          style={{
            background: 'rgba(255, 255, 255, 0.7)',
            border: '1px solid rgba(0,0,0,0.2)',
            borderRadius: '6px',
            fontSize: '0.75rem',
            padding: '4px 8px',
            fontWeight: 700,
            color: '#18181b',
            cursor: 'pointer'
          }}
        >
          <option value="en_progreso">En Progreso 🟢</option>
          <option value="en_revision">En Revisión 🟡</option>
          <option value="completado">Completado 🔵</option>
          <option value="bloqueado">Bloqueado 🔴</option>
          <option value="planificado">Planificado 🟣</option>
        </select>
      </div>
    </div>
  );
}
