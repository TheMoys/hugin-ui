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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #2a2a2a', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <PlusCircle size={26} color="#ff6b00" />
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff' }}>
              Registrar Nuevo Proyecto en Panel
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#a3a3a3', cursor: 'pointer', padding: '4px' }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#d4d4d4', display: 'block', marginBottom: '6px' }}>Código *</label>
              <input
                type="text"
                placeholder="ej: FENIX-UI"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '2px solid #333333', background: '#000000', color: '#fff', fontSize: '0.95rem', fontWeight: 700 }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#d4d4d4', display: 'block', marginBottom: '6px' }}>Nombre del Proyecto *</label>
              <input
                type="text"
                required
                placeholder="Título del proyecto..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '2px solid #333333', background: '#000000', color: '#fff', fontSize: '0.95rem', fontWeight: 700 }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#d4d4d4', display: 'block', marginBottom: '6px' }}>Descripción</label>
            <textarea
              rows={3}
              placeholder="Detalles clave del proyecto..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '2px solid #333333', background: '#000000', color: '#fff', fontSize: '0.95rem', fontWeight: 600, resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#d4d4d4', display: 'block', marginBottom: '6px' }}>Estado</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '2px solid #333333', background: '#000000', color: '#fff', fontSize: '0.92rem', fontWeight: 700 }}
              >
                <option value="en_progreso">En Progreso</option>
                <option value="en_revision">En Revisión</option>
                <option value="completado">Completado</option>
                <option value="bloqueado">Bloqueado</option>
                <option value="planificado">Planificado</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#d4d4d4', display: 'block', marginBottom: '6px' }}>Prioridad</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '2px solid #333333', background: '#000000', color: '#fff', fontSize: '0.92rem', fontWeight: 700 }}
              >
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </div>
          </div>

          {status === 'bloqueado' && (
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ef4444', display: 'block', marginBottom: '6px' }}>Motivo del Bloqueo</label>
              <input
                type="text"
                placeholder="Explicación del impedimento..."
                value={blockerReason}
                onChange={(e) => setBlockerReason(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '2px solid #ef4444', background: '#000000', color: '#fff', fontSize: '0.95rem' }}
              />
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#d4d4d4', display: 'block', marginBottom: '6px' }}>Responsable</label>
              <input
                type="text"
                placeholder="ej: Diego Moys"
                value={lead}
                onChange={(e) => setLead(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '2px solid #333333', background: '#000000', color: '#fff', fontSize: '0.95rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#d4d4d4', display: 'block', marginBottom: '6px' }}>Etiquetas</label>
              <input
                type="text"
                placeholder="React, OpenData, GIS"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '2px solid #333333', background: '#000000', color: '#fff', fontSize: '0.95rem' }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              marginTop: '12px',
              background: 'linear-gradient(135deg, #ff6b00 0%, #cc5200 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '14px',
              borderRadius: '12px',
              fontWeight: 900,
              fontSize: '1.05rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 4px 18px rgba(255, 107, 0, 0.4)'
            }}
          >
            <Check size={20} /> Guardar Proyecto
          </button>
        </form>
      </div>
    </div>
  );
}


