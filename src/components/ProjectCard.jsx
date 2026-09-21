import React from 'react';
import { Calendar, Clock, GitBranch } from 'lucide-react';

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
      case 'en_desarrollo':
        return { label: 'En Desarrollo 🚀', className: 'badge-en_progreso' };
      case 'soporte':
        return { label: 'Solo Soporte 🛠️', className: 'badge-en_revision' };
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
        padding: '32px',
        minHeight: '260px',
        justifyContent: 'space-between',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Pushpin */}
      <div className="pushpin">
        <div className={`pushpin-head ${getPinColor(project.color)}`}></div>
      </div>

      {/* Header: Code & Version */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span className="handwritten" style={{ fontSize: '1.8rem', fontWeight: 700, color: '#3f3f46' }}>
            #{project.code}
          </span>
          <span className={`status-badge ${statusInfo.className}`}>
            {statusInfo.label}
          </span>
        </div>

        {/* Project Name */}
        <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#18181b', marginBottom: '12px', lineHeight: 1.25 }}>
          {project.title}
        </h3>

        {/* Version Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.08)', padding: '6px 14px', borderRadius: '8px', fontSize: '1.15rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#18181b', marginBottom: '20px' }}>
          <GitBranch size={18} color="#374151" />
          <span>Versión: {project.version}</span>
        </div>
      </div>

      {/* Dates Section */}
      <div style={{ background: 'rgba(255, 255, 255, 0.65)', padding: '16px 18px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '1.05rem', color: '#27272a' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#52525b', fontWeight: 700 }}>
            <Clock size={18} color="#52525b" /> Última actualización:
          </span>
          <strong style={{ fontWeight: 800 }}>{project.lastUpdate}</strong>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '1.05rem', color: '#18181b', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '10px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#15803d', fontWeight: 800 }}>
            <Calendar size={18} color="#15803d" /> Siguiente despliegue:
          </span>
          <strong style={{ fontWeight: 800, color: '#166534' }}>{project.nextDeploy}</strong>
        </div>
      </div>
    </div>
  );
}
