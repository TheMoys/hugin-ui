import React from 'react';
import { Calendar, Clock, GitBranch, ShieldAlert } from 'lucide-react';

export default function ProjectCard({ project }) {
  const getPinColor = (color) => {
    switch (color) {
      case 'mint': return 'pushpin-green';
      case 'blue': return 'pushpin-blue';
      case 'pink': return 'pushpin-red';
      case 'amber': return 'pushpin-brass';
      default: return 'pushpin-red';
    }
  };

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

  const statusInfo = getStatusBadge(project.status);

  return (
    <div
      className={`cork-card bg-${project.color || 'yellow'}`}
      style={{
        transform: `rotate(${project.rotation || 0}deg)`,
        padding: '24px',
        minHeight: '220px',
        justifyContent: 'space-between'
      }}
    >
      {/* Pushpin */}
      <div className="pushpin">
        <div className={`pushpin-head ${getPinColor(project.color)}`}></div>
      </div>

      {/* Header: Code & Version */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span className="handwritten" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#3f3f46' }}>
            #{project.code}
          </span>
          <span className={`status-badge ${statusInfo.className}`}>
            {statusInfo.label}
          </span>
        </div>

        {/* Project Name */}
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#18181b', marginBottom: '8px' }}>
          {project.title}
        </h3>

        {/* Version Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(0,0,0,0.08)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#27272a', marginBottom: '16px' }}>
          <GitBranch size={14} color="#4b5563" />
          <span>Versión: {project.version}</span>
        </div>
      </div>

      {/* Dates Section */}
      <div style={{ background: 'rgba(255, 255, 255, 0.55)', padding: '12px 14px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.825rem', color: '#27272a' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#52525b', fontWeight: 600 }}>
            <Clock size={14} color="#71717a" /> Última actualización:
          </span>
          <strong style={{ fontWeight: 700 }}>{project.lastUpdate}</strong>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.825rem', color: '#18181b', borderTop: '1px stroke rgba(0,0,0,0.08)', paddingTop: '6px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#15803d', fontWeight: 700 }}>
            <Calendar size={14} color="#15803d" /> Siguiente despliegue:
          </span>
          <strong style={{ fontWeight: 800, color: '#166534' }}>{project.nextDeploy}</strong>
        </div>
      </div>
    </div>
  );
}
