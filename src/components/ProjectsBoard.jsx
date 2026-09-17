import React from 'react';
import { LayoutGrid, Compass } from 'lucide-react';
import ProjectCard from './ProjectCard';

export default function ProjectsBoard({ projects }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Projects Grid */}
      <div className="projects-grid">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
