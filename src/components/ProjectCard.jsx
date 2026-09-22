import React from 'react';
import { Calendar, Clock, GitBranch, ArrowUpRight } from 'lucide-react';

export default function ProjectCard({ project }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'en_progreso':
        return { label: 'En Progreso', className: 'badge-en_progreso', dotClass: 'dot-green' };
      case 'en_desarrollo':
        return { label: 'En Desarrollo', className: 'badge-en_progreso', dotClass: 'dot-green' };
      case 'soporte':
        return { label: 'Mantenimiento / Soporte', className: 'badge-en_revision', dotClass: 'dot-amber' };
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
        padding: '24px',
        minHeight: '230px',
        justifyContent: 'space-between',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header: Code & Status */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-cyan)', background: 'rgba(6, 182, 212, 0.12)', border: '1px solid rgba(6, 182, 212, 0.25)', padding: '3px 10px', borderRadius: '6px', fontWeight: 700 }}>
            #{project.code}
          </span>
          <span className={`status-badge ${statusInfo.className}`}>
            <span className={`status-dot ${statusInfo.dotClass}`}></span>
            {statusInfo.label}
          </span>
        </div>

        {/* Project Title */}
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px', lineHeight: 1.25, letterSpacing: '-0.01em' }}>
          {project.title}
        </h3>

        {/* Version Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          <GitBranch size={14} color="#818cf8" />
          <span>Versión {project.version}</span>
        </div>
      </div>

      {/* Dates Section */}
      <div style={{ background: '#0b0f19', border: '1px solid rgba(255, 255, 255, 0.06)', padding: '12px 14px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
            <Clock size={13} /> Úl. Actualización
          </span>
          <strong style={{ fontWeight: 600, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{project.lastUpdate}</strong>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399' }}>
            <Calendar size={13} /> Sig. Despliegue
          </span>
          <strong style={{ fontWeight: 700, color: '#34d399', fontFamily: 'var(--font-mono)' }}>{project.nextDeploy}</strong>
        </div>
      </div>
    </div>
  );
}

