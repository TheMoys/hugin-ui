import React from 'react';
import { Layers, Activity, Wrench, CheckCircle2 } from 'lucide-react';
import ProjectCard from './ProjectCard';

export default function ProjectsBoard({ projects }) {
  const inProgressCount = projects.filter(p => p.status === 'en_progreso' || p.status === 'en_desarrollo').length;
  const supportCount = projects.filter(p => p.status === 'soporte').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '100%' }}>
      {/* KPI Metrics Summary Bar - Compact Mode */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
        <div className="dash-card" style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: 'var(--orange-subtle)', border: '1px solid var(--orange-border)', padding: '6px', borderRadius: '6px', color: 'var(--orange-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={16} />
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
              TOTAL SISTEMAS
            </span>
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
            {projects.length}
          </span>
        </div>

        <div className="dash-card" style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: 'rgba(34, 197, 94, 0.18)', border: '1px solid #22c55e', padding: '6px', borderRadius: '6px', color: '#4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={16} />
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
              EN DESARROLLO
            </span>
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#4ade80', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
            {inProgressCount}
          </span>
        </div>

        <div className="dash-card" style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.18)', border: '1px solid #f59e0b', padding: '6px', borderRadius: '6px', color: '#fcd34d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wrench size={16} />
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
              MANTENIMIENTO
            </span>
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fcd34d', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
            {supportCount}
          </span>
        </div>

        <div className="dash-card dash-card-orange" style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: 'var(--orange-subtle)', border: '1px solid var(--orange-border)', padding: '6px', borderRadius: '6px', color: 'var(--orange-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={16} />
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--orange-bright)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
              VERSIÓN ESTABLE
            </span>
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
            {projects.length}
          </span>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="projects-grid">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
