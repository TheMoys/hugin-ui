import React from 'react';
import { Layers, Activity, Wrench, CheckCircle2 } from 'lucide-react';
import ProjectCard from './ProjectCard';

export default function ProjectsBoard({ projects }) {
  const inProgressCount = projects.filter(p => p.status === 'en_progreso' || p.status === 'en_desarrollo').length;
  const supportCount = projects.filter(p => p.status === 'soporte').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px', height: '100%' }}>
      {/* KPI Metrics Summary Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '22px' }}>
        <div className="dash-card" style={{ padding: '20px 26px', display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ background: 'var(--orange-subtle)', border: '1px solid var(--orange-border)', padding: '14px', borderRadius: '14px', color: 'var(--orange-primary)' }}>
            <Layers size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>TOTAL SISTEMAS</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-mono)', lineHeight: 1, marginTop: '4px' }}>{projects.length}</div>
          </div>
        </div>

        <div className="dash-card" style={{ padding: '20px 26px', display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ background: 'rgba(34, 197, 94, 0.18)', border: '1px solid #22c55e', padding: '14px', borderRadius: '14px', color: '#4ade80' }}>
            <Activity size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>EN DESARROLLO</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#4ade80', fontFamily: 'var(--font-mono)', lineHeight: 1, marginTop: '4px' }}>{inProgressCount}</div>
          </div>
        </div>



        <div className="dash-card" style={{ padding: '20px 26px', display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.18)', border: '1px solid #f59e0b', padding: '14px', borderRadius: '14px', color: '#fcd34d' }}>
            <Wrench size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>MANTENIMIENTO</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fcd34d', fontFamily: 'var(--font-mono)', lineHeight: 1, marginTop: '4px' }}>{supportCount}</div>
          </div>
        </div>

        <div className="dash-card dash-card-orange" style={{ padding: '20px 26px', display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ background: 'var(--orange-subtle)', border: '1px solid var(--orange-border)', padding: '14px', borderRadius: '14px', color: 'var(--orange-primary)' }}>
            <CheckCircle2 size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', color: 'var(--orange-bright)', fontWeight: 800, textTransform: 'uppercase' }}>VERSIÓN ESTABLE</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-mono)', lineHeight: 1, marginTop: '4px' }}>{projects.length}</div>
          </div>
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




