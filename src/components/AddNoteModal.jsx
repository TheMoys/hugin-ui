import React, { useState } from 'react';
import { X, PlusCircle, Check } from 'lucide-react';

export default function AddNoteModal({ isOpen, onClose, onAddProject }) {
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('alta');
  const [status, setStatus] = useState('en_progreso');
  const [lead, setLead] = useState('Diego Moys');
  const [tagsInput, setTagsInput] = useState('');
  const [blockerReason, setBlockerReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newProject = {
      id: `proj-${Date.now()}`,
      code: code.trim().toUpperCase() || 'SYS-PROJ',
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      progress: status === 'completado' ? 100 : status === 'planificado' ? 0 : 40,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      lead: lead.trim() || 'Equipo Fénix',
      team: [lead.trim() || 'Equipo Fénix'],
      tags: tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(Boolean) : ['Hugin', 'Fénix'],
      blockerReason: status === 'bloqueado' ? blockerReason : '',
      version: 'v1.0.0',
      lastUpdate: new Date().toLocaleDateString('es-ES'),
      nextDeploy: 'Por definir'
    };

    onAddProject(newProject);
    onClose();

    // Reset form
    setCode('');
    setTitle('');
    setDescription('');
    setTagsInput('');
    setBlockerReason('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <PlusCircle size={22} color="#6366f1" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Registrar Nuevo Proyecto en Panel
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Código *</label>
              <input
                type="text"
                placeholder="ej: FENIX-UI"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#0b0f19', color: '#fff', fontSize: '0.85rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Nombre del Proyecto *</label>
              <input
                type="text"
                required
                placeholder="Título del proyecto..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#0b0f19', color: '#fff', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Descripción</label>
            <textarea
              rows={3}
              placeholder="Detalles clave del proyecto..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#0b0f19', color: '#fff', fontSize: '0.85rem', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Estado</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#0b0f19', color: '#fff', fontSize: '0.82rem' }}
              >
                <option value="en_progreso">En Progreso</option>
                <option value="en_revision">En Revisión</option>
                <option value="completado">Completado</option>
                <option value="bloqueado">Bloqueado</option>
                <option value="planificado">Planificado</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Prioridad</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#0b0f19', color: '#fff', fontSize: '0.82rem' }}
              >
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </div>
          </div>

          {status === 'bloqueado' && (
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fb7185', display: 'block', marginBottom: '4px' }}>Motivo del Bloqueo</label>
              <input
                type="text"
                placeholder="Explicación del impedimento..."
                value={blockerReason}
                onChange={(e) => setBlockerReason(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #f43f5e', background: '#0b0f19', color: '#fff', fontSize: '0.85rem' }}
              />
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Responsable</label>
              <input
                type="text"
                placeholder="ej: Diego Moys"
                value={lead}
                onChange={(e) => setLead(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#0b0f19', color: '#fff', fontSize: '0.85rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Etiquetas</label>
              <input
                type="text"
                placeholder="React, OpenData, GIS"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#0b0f19', color: '#fff', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              marginTop: '10px',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              color: '#ffffff',
              border: 'none',
              padding: '12px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
            }}
          >
            <Check size={18} /> Guardar Proyecto
          </button>
        </form>
      </div>
    </div>
  );
}

