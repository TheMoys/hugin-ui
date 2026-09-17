import React, { useState } from 'react';
import { X, Pin, Sparkles } from 'lucide-react';

export default function AddNoteModal({ isOpen, onClose, onAddProject }) {
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('alta');
  const [status, setStatus] = useState('en_progreso');
  const [color, setColor] = useState('yellow');
  const [lead, setLead] = useState('Diego Moys');
  const [tagsInput, setTagsInput] = useState('');
  const [blockerReason, setBlockerReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newProject = {
      id: `proj-${Date.now()}`,
      code: code.trim().toUpperCase() || 'FENIX-NOTE',
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      progress: status === 'completado' ? 100 : status === 'planificado' ? 0 : 40,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      color,
      rotation: (Math.random() * 4 - 2).toFixed(1),
      lead: lead.trim() || 'Equipo Fénix',
      team: [lead.trim() || 'Equipo Fénix'],
      tags: tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(Boolean) : ['Hugin', 'Fénix'],
      blockerReason: status === 'bloqueado' ? blockerReason : '',
      tasksCount: { done: 1, total: 4 }
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #5a381d', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Pin size={24} color="#d97706" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff8f0' }}>
              Fijar Nueva Nota en la Pizarra
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#d1b89d', cursor: 'pointer', padding: '4px' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fef3c7', display: 'block', marginBottom: '4px' }}>Código</label>
              <input
                type="text"
                placeholder="ej: FENIX-UI"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #5a381d', background: '#1c1917', color: '#fff', fontSize: '0.85rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fef3c7', display: 'block', marginBottom: '4px' }}>Título *</label>
              <input
                type="text"
                required
                placeholder="Título del proyecto o nota..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #5a381d', background: '#1c1917', color: '#fff', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fef3c7', display: 'block', marginBottom: '4px' }}>Descripción</label>
            <textarea
              rows={3}
              placeholder="Escribe los detalles clave del proyecto o tarea..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #5a381d', background: '#1c1917', color: '#fff', fontSize: '0.85rem', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fef3c7', display: 'block', marginBottom: '4px' }}>Estado</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #5a381d', background: '#1c1917', color: '#fff', fontSize: '0.8rem' }}
              >
                <option value="en_progreso">En Progreso 🟢</option>
                <option value="en_revision">En Revisión 🟡</option>
                <option value="completado">Completado 🔵</option>
                <option value="bloqueado">Bloqueado 🔴</option>
                <option value="planificado">Planificado 🟣</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fef3c7', display: 'block', marginBottom: '4px' }}>Prioridad</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #5a381d', background: '#1c1917', color: '#fff', fontSize: '0.8rem' }}
              >
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fef3c7', display: 'block', marginBottom: '4px' }}>Color Nota</label>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #5a381d', background: '#1c1917', color: '#fff', fontSize: '0.8rem' }}
              >
                <option value="yellow">Canario 🟡</option>
                <option value="mint">Menta 🟢</option>
                <option value="blue">Cielo 🔵</option>
                <option value="pink">Rosa 🌸</option>
                <option value="amber">Ámbar 🟠</option>
              </select>
            </div>
          </div>

          {status === 'bloqueado' && (
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fca5a5', display: 'block', marginBottom: '4px' }}>Motivo del Bloqueo</label>
              <input
                type="text"
                placeholder="Explicación breve del impedimento..."
                value={blockerReason}
                onChange={(e) => setBlockerReason(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #ef4444', background: '#1c1917', color: '#fff', fontSize: '0.85rem' }}
              />
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fef3c7', display: 'block', marginBottom: '4px' }}>Responsable</label>
              <input
                type="text"
                placeholder="ej: Diego Moys"
                value={lead}
                onChange={(e) => setLead(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #5a381d', background: '#1c1917', color: '#fff', fontSize: '0.85rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fef3c7', display: 'block', marginBottom: '4px' }}>Etiquetas (separadas por coma)</label>
              <input
                type="text"
                placeholder="React, OpenData, GIS"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #5a381d', background: '#1c1917', color: '#fff', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              marginTop: '10px',
              background: 'linear-gradient(135deg, #d97706, #b45309)',
              color: '#ffffff',
              border: 'none',
              padding: '12px',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
            }}
          >
            <Sparkles size={18} /> Pin a la Pizarra de Corcho
          </button>
        </form>
      </div>
    </div>
  );
}
