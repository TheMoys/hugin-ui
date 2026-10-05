import React, { useState } from 'react';
import { X, Save, RotateCcw, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function EditDashboardModal({
  isOpen,
  onClose,
  data,
  onSave,
  onReset,
  isMuninConnected
}) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('sprintGoal');
  const [formData, setFormData] = useState(JSON.parse(JSON.stringify(data)));
  const [newTag, setNewTag] = useState('NUTRIX');
  const [newTitle, setNewTitle] = useState('');
  const [saveStatus, setSaveStatus] = useState(null);

  const handleGoalChange = (field, val) => {
    setFormData(prev => ({
      ...prev,
      sprintGoal: { ...prev.sprintGoal, [field]: val }
    }));
  };

  const handleReviewChange = (field, val) => {
    setFormData(prev => ({
      ...prev,
      review: { ...prev.review, [field]: val }
    }));
  };

  const handleAddDeliverable = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newDel = {
      id: `del-${Date.now()}`,
      tag: newTag.trim().toUpperCase(),
      title: newTitle.trim()
    };
    setFormData(prev => ({
      ...prev,
      sprintGoal: {
        ...prev.sprintGoal,
        deliverables: [...(prev.sprintGoal.deliverables || []), newDel]
      }
    }));
    setNewTitle('');
  };

  const handleRemoveDeliverable = (id) => {
    setFormData(prev => ({
      ...prev,
      sprintGoal: {
        ...prev.sprintGoal,
        deliverables: prev.sprintGoal.deliverables.filter(d => d.id !== id)
      }
    }));
  };

  const handleProjectChange = (id, field, val) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map(p => (p.id === id ? { ...p, [field]: val } : p))
    }));
  };

  const handleSubmit = async () => {
    setSaveStatus('Guardando...');
    try {
      await onSave(formData);
      setSaveStatus('¡Guardado con éxito!');
      setTimeout(() => {
        setSaveStatus(null);
        onClose();
      }, 1000);
    } catch (err) {
      setSaveStatus('Error al guardar');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        background: '#141824',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '750px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px rgba(0,0,0,0.7)',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255,255,255,0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>🦅</span>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#fff', fontWeight: 800 }}>
                Ajustes Dinámicos de Hugin
              </h2>
              <span style={{ fontSize: '0.8rem', color: isMuninConnected ? '#4ade80' : '#f59e0b', fontWeight: 600 }}>
                {isMuninConnected ? '● Sincronizado con Munin Assistant (API activa)' : '○ Modo Local (Cambios en memoria)'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(0,0,0,0.2)',
          padding: '0 16px'
        }}>
          {[
            { id: 'sprintGoal', label: '🎯 Objetivo del Sprint' },
            { id: 'review', label: '🗓️ Próxima Review' },
            { id: 'projects', label: '📊 Proyectos Activos' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 18px',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid var(--orange-primary)' : '2px solid transparent',
                color: activeTab === tab.id ? 'var(--orange-primary)' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {activeTab === 'sprintGoal' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  CÓDIGO DEL SPRINT
                </label>
                <input
                  type="text"
                  value={formData.sprintGoal?.code || ''}
                  onChange={(e) => handleGoalChange('code', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-inner)',
                    border: '1px solid var(--border-subtle)',
                    color: '#fff',
                    fontSize: '0.95rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  DESCRIPCIÓN DEL OBJETIVO GENERAL
                </label>
                <textarea
                  rows={3}
                  value={formData.sprintGoal?.description || ''}
                  onChange={(e) => handleGoalChange('description', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-inner)',
                    border: '1px solid var(--border-subtle)',
                    color: '#fff',
                    fontSize: '0.95rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>
                  ENTREGABLES CLAVE ({formData.sprintGoal?.deliverables?.length || 0})
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                  {formData.sprintGoal?.deliverables?.map(del => (
                    <div
                      key={del.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'var(--bg-inner)',
                        border: '1px solid var(--border-subtle)',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '0.9rem'
                      }}
                    >
                      <span>
                        <strong style={{ color: 'var(--orange-primary)' }}>[{del.tag}]</strong> {del.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDeliverable(del.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#f87171',
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new deliverable form */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="TAG (ej. MAHINE)"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    style={{
                      width: '110px',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      background: 'var(--bg-inner)',
                      border: '1px solid var(--border-subtle)',
                      color: '#fff',
                      fontSize: '0.85rem'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Título del entregable..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 10px',
                      borderRadius: '8px',
                      background: 'var(--bg-inner)',
                      border: '1px solid var(--border-subtle)',
                      color: '#fff',
                      fontSize: '0.85rem'
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddDeliverable}
                    style={{
                      background: 'var(--orange-subtle)',
                      border: '1px solid var(--orange-border)',
                      color: 'var(--orange-primary)',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Plus size={16} /> Añadir
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'review' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  TÍTULO DE LA REVISIÓN
                </label>
                <input
                  type="text"
                  value={formData.review?.title || ''}
                  onChange={(e) => handleReviewChange('title', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-inner)',
                    border: '1px solid var(--border-subtle)',
                    color: '#fff',
                    fontSize: '0.95rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  FECHA Y HORA OBJETIVO (CUENTA ATRÁS ISO: YYYY-MM-DDTHH:MM:SS)
                </label>
                <input
                  type="datetime-local"
                  value={formData.review?.targetDate ? formData.review.targetDate.slice(0, 16) : ''}
                  onChange={(e) => handleReviewChange('targetDate', `${e.target.value}:00`)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-inner)',
                    border: '1px solid var(--border-subtle)',
                    color: '#fff',
                    fontSize: '0.95rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  TEXTO DE HORARIO VISUAL
                </label>
                <input
                  type="text"
                  value={formData.review?.scheduleText || ''}
                  onChange={(e) => handleReviewChange('scheduleText', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-inner)',
                    border: '1px solid var(--border-subtle)',
                    color: '#fff',
                    fontSize: '0.95rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  ESTADO DEL SPRINT
                </label>
                <input
                  type="text"
                  value={formData.review?.status || ''}
                  onChange={(e) => handleReviewChange('status', e.target.value)}
                  placeholder="ej. En Progreso (Semana 2)"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-inner)',
                    border: '1px solid var(--border-subtle)',
                    color: '#fff',
                    fontSize: '0.95rem'
                  }}
                />
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {formData.projects?.map(proj => (
                <div
                  key={proj.id}
                  style={{
                    background: 'var(--bg-inner)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1fr 1.2fr 1.2fr',
                    gap: '10px',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 800, color: '#fff', fontSize: '0.95rem' }}>{proj.title}</span>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{proj.code}</div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '3px' }}>Versión</label>
                    <input
                      type="text"
                      value={proj.version || ''}
                      onChange={(e) => handleProjectChange(proj.id, 'version', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '6px 8px',
                        borderRadius: '6px',
                        background: '#0d1117',
                        border: '1px solid var(--border-subtle)',
                        color: '#fff',
                        fontSize: '0.82rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '3px' }}>Estado</label>
                    <select
                      value={proj.status || 'en_desarrollo'}
                      onChange={(e) => handleProjectChange(proj.id, 'status', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '6px 8px',
                        borderRadius: '6px',
                        background: '#0d1117',
                        border: '1px solid var(--border-subtle)',
                        color: '#fff',
                        fontSize: '0.82rem'
                      }}
                    >
                      <option value="en_desarrollo">En Desarrollo</option>
                      <option value="en_progreso">En Progreso</option>
                      <option value="soporte">Soporte</option>
                      <option value="completado">Completado</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '3px' }}>Próx. Despliegue</label>
                    <input
                      type="text"
                      value={proj.nextDeploy || ''}
                      onChange={(e) => handleProjectChange(proj.id, 'nextDeploy', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '6px 8px',
                        borderRadius: '6px',
                        background: '#0d1117',
                        border: '1px solid var(--border-subtle)',
                        color: '#fff',
                        fontSize: '0.82rem'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255,255,255,0.02)'
        }}>
          <button
            type="button"
            onClick={onReset}
            style={{
              background: 'transparent',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#f87171',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RotateCcw size={15} /> Restablecer Defaults
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {saveStatus && (
              <span style={{ fontSize: '0.88rem', color: saveStatus.includes('éxito') ? '#4ade80' : 'var(--orange-primary)' }}>
                {saveStatus}
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              style={{
                background: 'var(--orange-primary)',
                border: 'none',
                color: '#fff',
                padding: '8px 20px',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Save size={16} /> Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
