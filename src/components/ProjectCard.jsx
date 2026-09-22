import React from 'react';
import { Calendar, Clock, GitBranch } from 'lucide-react';

export default function ProjectCard({ project }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'en_desarrollo':
        return { label: 'En Desarrollo', className: 'badge-en_desarrollo', dotClass: 'dot-green' };
      case 'en_progreso':
        return { label: 'En Progreso', className: 'badge-en_progreso', dotClass: 'dot-purple' };
      case 'soporte':
        return { label: 'Soporte / Mant.', className: 'badge-soporte', dotClass: 'dot-amber' };
      case 'en_revision':
        return { label: 'En Revisión', className: 'badge-en_revision', dotClass: 'dot-amber' };

      case 'completado':
        return { label: 'Completado', className: 'badge-completado', dotClass: 'dot-blue' };
      case 'bloqueado':
        return { label: 'Bloqueado', className: 'badge-bloqueado', dotClass: 'dot-red' };
      case 'planificado':
        return { label: 'Planificado', className: 'badge-planificado', dotClass: 'dot-purple' };
      default:
        return { label: status, className: 'badge-en_progreso', dotClass: 'dot-green' };
    }
  };

  const statusInfo = getStatusBadge(project.status);

  return (
    <div
      className="dash-card"
      style={{
        padding: '28px',
        minHeight: '260px',
        justifyContent: 'space-between',
        display: 'flex',
        flexDirection: 'column',
        borderLeft: '4px solid var(--orange-primary)'
      }}
    >
      {/* Header: Code & Status */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', color: 'var(--orange-bright)', background: 'var(--orange-subtle)', border: '1px solid var(--orange-border)', padding: '5px 14px', borderRadius: '8px', fontWeight: 800 }}>
            #{project.code}
          </span>
          <span className={`status-badge ${statusInfo.className}`}>
            <span className={`status-dot ${statusInfo.dotClass}`}></span>
            {statusInfo.label}
          </span>
        </div>

        {/* Project Title */}
        <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#ffffff', marginBottom: '14px', lineHeight: 1.25 }}>
          {project.title}
        </h3>

        {/* Version Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--bg-inner)', border: '1px solid var(--border-subtle)', padding: '6px 14px', borderRadius: '8px', fontSize: '1.05rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginBottom: '18px' }}>
          <GitBranch size={18} color="var(--orange-primary)" />
          <span>Versión {project.version}</span>
        </div>
      </div>

      {/* Dates Section */}
      <div style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-subtle)', padding: '16px 20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '1.05rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontWeight: 600 }}>
            <Clock size={16} color="var(--orange-primary)" /> Úl. Actualización:
          </span>
          <strong style={{ fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)', fontSize: '1.1rem' }}>{project.lastUpdate}</strong>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '1.05rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4ade80', fontWeight: 700 }}>
            <Calendar size={16} color="#4ade80" /> Sig. Despliegue:
          </span>
          <strong style={{ fontWeight: 800, color: '#4ade80', fontFamily: 'var(--font-mono)', fontSize: '1.1rem' }}>{project.nextDeploy}</strong>
        </div>
      </div>
    </div>
  );
}




