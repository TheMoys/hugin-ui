import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Send,
  Trash2,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  Briefcase,
  Tv,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

export default function MuninChatView({
  apiUrl,
  isMuninConnected,
  onSwitchToTvMode,
  isTvAvailable = true
}) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedType, setCopiedType] = useState(null); // 'all', 'backend', 'frontend'
  const [toastMessage, setToastMessage] = useState(null);

  // Multi-tenancy context
  const [userId] = useState('diego');
  const [workspaceId, setWorkspaceId] = useState('fenix');

  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordTimerRef = useRef(null);
  const recordingActiveRef = useRef(false);

  // Auto-scroll al final
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  // Cargar historial inicial al montar
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(
          `${apiUrl}/api/munin/history?user_id=${userId}&workspace_id=${workspaceId}&limit=30`
        );
        if (res.ok) {
          const data = await res.json();
          if (data && data.turns && Array.isArray(data.turns)) {
            setMessages(
              data.turns.map(t => ({
                id: t.id,
                role: t.role,
                text: t.content,
                timestamp: t.timestamp
              }))
            );
          }
        }
      } catch (err) {
        console.error('Error cargando historial de Munin:', err);
      }
    };
    fetchHistory();
  }, [apiUrl, userId, workspaceId]);

  // Enviar mensaje de texto
  const handleSendMessage = async (textToSend = null) => {
    const text = (textToSend || inputText).trim();
    if (!text || isProcessing) return;

    setInputText('');
    const tempUserMsg = {
      id: Date.now(),
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, tempUserMsg]);
    setIsProcessing(true);

    try {
      const res = await fetch(`${apiUrl}/api/munin/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId,
          'X-Workspace-Id': workspaceId
        },
        body: JSON.stringify({
          message: text,
          user_id: userId,
          workspace_id: workspaceId
        })
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'model',
          text: data.response || 'Solicitud procesada.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error('Error enviando mensaje a Munin:', err);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'model',
          text: `⚠️ No pude comunicarme con Munin: ${err.message}. Comprueba que el backend esté activo.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Reiniciar historial (/reset)
  const handleResetHistory = async () => {
    if (!window.confirm('¿Quieres reiniciar la memoria conversacional de Munin?')) return;
    try {
      const res = await fetch(
        `${apiUrl}/api/munin/reset?user_id=${userId}&workspace_id=${workspaceId}`,
        { method: 'POST' }
      );
      if (res.ok) {
        const data = await res.json();
        setMessages([
          {
            id: Date.now(),
            role: 'model',
            text: data.message || '🧹 Memoria reiniciada. ¿En qué te ayudo hoy, Diego?',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        showToast('Memoria reiniciada');
      }
    } catch (err) {
      console.error('Error al reiniciar memoria:', err);
    }
  };

  // Toast efímero
  const showToast = msg => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Copiar al portapapeles con extracción inteligente de Padmasana
  const copyToClipboard = (text, msgIndex, type = 'all') => {
    let textToCopy = text;

    if (type === 'backend') {
      const beMatch = text.match(/(?:Historia 1|Backend)[\s\S]*?(?=(?:Historia 2|Frontend|💡|\n---|$))/i);
      if (beMatch) textToCopy = beMatch[0].trim();
    } else if (type === 'frontend') {
      const feMatch = text.match(/(?:Historia 2|Frontend)[\s\S]*?(?=(?:💡|\n---|$))/i);
      if (feMatch) textToCopy = feMatch[0].trim();
    }

    navigator.clipboard.writeText(textToCopy);
    setCopiedIndex(msgIndex);
    setCopiedType(type);
    showToast(
      type === 'backend'
        ? 'Ticket Backend copiado 📋'
        : type === 'frontend'
        ? 'Ticket Frontend copiado 📋'
        : 'Mensaje copiado 📋'
    );
    setTimeout(() => {
      setCopiedIndex(null);
      setCopiedType(null);
    }, 2000);
  };

  // ==========================================
  // WALKIE-TALKIE PUSH-TO-TALK RECORDING
  // ==========================================
  const startRecording = async e => {
    // Evitar disparos repetidos
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (recordingActiveRef.current || isProcessing) return;
    recordingActiveRef.current = true;

    // Vibración táctil si el dispositivo lo soporta
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(40);
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      // Seleccionar el formato de audio más compatible
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        if (MediaRecorder.isTypeSupported('audio/mp4')) mimeType = 'audio/mp4';
        else if (MediaRecorder.isTypeSupported('audio/ogg')) mimeType = 'audio/ogg';
        else mimeType = '';
      }

      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = event => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        // Detener pistas del micro
        stream.getTracks().forEach(track => track.stop());

        const finalChunks = audioChunksRef.current;
        if (!finalChunks || finalChunks.length === 0) {
          setIsRecording(false);
          return;
        }

        const audioBlob = new Blob(finalChunks, { type: recorder.mimeType || 'audio/webm' });
        // Si el audio es excesivamente corto (< 400ms), ignorar
        if (audioBlob.size < 500) {
          setIsRecording(false);
          return;
        }

        await sendAudioMessage(audioBlob);
        setIsRecording(false);
      };

      recorder.start(100);
      setIsRecording(true);
      setRecordDuration(0);

      recordTimerRef.current = setInterval(() => {
        setRecordDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error accediendo al micrófono:', err);
      recordingActiveRef.current = false;
      setIsRecording(false);
      showToast('⚠️ Permiso de micrófono requerido');
    }
  };

  const stopRecording = e => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!recordingActiveRef.current) return;
    recordingActiveRef.current = false;

    if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }

    // Vibración al soltar
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([20, 30]);
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const sendAudioMessage = async audioBlob => {
    setIsProcessing(true);
    const tempUserMsg = {
      id: Date.now(),
      role: 'user',
      text: '🎙️ [Nota de voz dictada]',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'voice_note.webm');
      formData.append('user_id', userId);
      formData.append('workspace_id', workspaceId);

      const res = await fetch(`${apiUrl}/api/munin/audio`, {
        method: 'POST',
        headers: {
          'X-User-Id': userId,
          'X-Workspace-Id': workspaceId
        },
        body: formData
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'model',
          text: data.response || 'Audio procesado.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error('Error procesando audio con Munin:', err);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'model',
          text: `⚠️ Error procesando nota de voz: ${err.message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Formateador simple de texto con detección de markdown
  const renderFormattedText = text => {
    if (!text) return null;

    // Detectar si contiene Padmasana tickets
    const hasBackend = /(?:Historia 1|Backend)/i.test(text) && /(?:Criterios de aceptación|CA1)/i.test(text);
    const hasFrontend = /(?:Historia 2|Frontend)/i.test(text) && /(?:Criterios de aceptación|CA1)/i.test(text);

    const lines = text.split('\n');

    return (
      <div style={{ lineHeight: 1.55, fontSize: '0.94rem' }}>
        {lines.map((line, i) => {
          let trimmed = line.trim();
          if (!trimmed) return <div key={i} style={{ height: '8px' }} />;

          // Encabezados o sugerencias
          if (trimmed.startsWith('💡') || trimmed.startsWith('🎯') || trimmed.startsWith('📅') || trimmed.startsWith('🗑️') || trimmed.startsWith('🔔')) {
            return (
              <div key={i} style={{ fontWeight: 700, margin: '8px 0 4px', color: '#38bdf8' }}>
                {trimmed}
              </div>
            );
          }

          // Viñetas
          if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
            return (
              <div key={i} style={{ display: 'flex', gap: '8px', margin: '3px 0', paddingLeft: '4px' }}>
                <span style={{ color: 'var(--orange-primary)', fontWeight: 800 }}>•</span>
                <span>{formatInlineMarkdown(trimmed.replace(/^[•\-]\s*/, ''))}</span>
              </div>
            );
          }

          // Criterios de Aceptación o Especificaciones
          if (/^(CA\d+:|Titulo:|Criterios de aceptación:|Especificaciones técnicas:)/i.test(trimmed)) {
            return (
              <div key={i} style={{ fontWeight: 700, margin: '6px 0 2px', color: '#f8fafc' }}>
                {formatInlineMarkdown(trimmed)}
              </div>
            );
          }

          return <div key={i} style={{ margin: '2px 0' }}>{formatInlineMarkdown(line)}</div>;
        })}

        {/* Acciones de copia inteligentes para Padmasana */}
        {(hasBackend || hasFrontend) && (
          <div
            style={{
              marginTop: '12px',
              paddingTop: '10px',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px'
            }}
          >
            {hasBackend && (
              <button
                onClick={() => copyToClipboard(text, null, 'backend')}
                style={{
                  background: 'rgba(0, 117, 168, 0.25)',
                  border: '1px solid var(--orange-border)',
                  color: '#38bdf8',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <Copy size={13} /> Copiar Backend
              </button>
            )}
            {hasFrontend && (
              <button
                onClick={() => copyToClipboard(text, null, 'frontend')}
                style={{
                  background: 'rgba(168, 85, 247, 0.2)',
                  border: '1px solid rgba(168, 85, 247, 0.4)',
                  color: '#d8b4fe',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <Copy size={13} /> Copiar Frontend
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  // Formato inline simple: negrita y cursiva
  const formatInlineMarkdown = str => {
    // Reemplaza **texto** o *texto* por <strong>
    const parts = [];
    const regex = /(\*\*.*?\*\*|\*.*?\*|_.*?_|`.*?`)/g;
    let lastIdx = 0;
    let match;

    while ((match = regex.exec(str)) !== null) {
      if (match.index > lastIdx) {
        parts.push(str.substring(lastIdx, match.index));
      }
      const raw = match[0];
      if (raw.startsWith('**') && raw.endsWith('**')) {
        parts.push(<strong key={match.index} style={{ color: '#fff' }}>{raw.slice(2, -2)}</strong>);
      } else if (raw.startsWith('*') && raw.endsWith('*')) {
        parts.push(<strong key={match.index} style={{ color: '#fff' }}>{raw.slice(1, -1)}</strong>);
      } else if (raw.startsWith('_') && raw.endsWith('_')) {
        parts.push(<em key={match.index} style={{ color: 'var(--text-muted)' }}>{raw.slice(1, -1)}</em>);
      } else if (raw.startsWith('`') && raw.endsWith('`')) {
        parts.push(
          <code
            key={match.index}
            style={{
              background: 'rgba(255,255,255,0.08)',
              padding: '1px 5px',
              borderRadius: '4px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85em',
              color: '#38bdf8'
            }}
          >
            {raw.slice(1, -1)}
          </code>
        );
      }
      lastIdx = regex.lastIndex;
    }
    if (lastIdx < str.length) {
      parts.push(str.substring(lastIdx));
    }
    return parts.length > 0 ? parts : str;
  };

  const formatTimer = sec => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        background: 'var(--bg-app)',
        color: 'var(--text-primary)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Toast Notificación */}
      {toastMessage && (
        <div
          style={{
            position: 'absolute',
            top: '70px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid var(--orange-primary)',
            color: '#38bdf8',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: 700,
            zIndex: 100,
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Sparkles size={14} />
          {toastMessage}
        </div>
      )}

      {/* Header del Copilot */}
      <header
        style={{
          background: 'var(--bg-header)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          zIndex: 10
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              boxShadow: '0 2px 10px rgba(2, 132, 199, 0.4)'
            }}
          >
            🦅
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 800, fontSize: '0.98rem', letterSpacing: '0.3px' }}>
                Munin Copilot
              </span>
              <span
                style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: isMuninConnected ? '#22c55e' : '#f59e0b',
                  boxShadow: isMuninConnected ? '0 0 8px #22c55e' : 'none'
                }}
              />
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {isMuninConnected ? 'Conectado a FastAPI' : 'Reconectando con Munin...'}
            </div>
          </div>
        </div>

        {/* Acciones de Cabecera: Selector Workspace & Vista TV */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Workspace Pill */}
          <div
            style={{
              background: 'var(--bg-inner)',
              border: '1px solid var(--orange-border)',
              padding: '4px 10px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: 'var(--orange-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <Briefcase size={12} />
            <span>Fénix</span>
          </div>

          {/* Reset Memoria */}
          <button
            onClick={handleResetHistory}
            title="Reiniciar conversación (/reset)"
            style={{
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
              padding: '6px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Trash2 size={16} />
          </button>

          {/* Switch a TV Display si está disponible */}
          {isTvAvailable && onSwitchToTvMode && (
            <button
              onClick={onSwitchToTvMode}
              title="Cambiar a pantalla TV"
              style={{
                background: 'rgba(0, 117, 168, 0.15)',
                border: '1px solid var(--orange-border)',
                color: '#38bdf8',
                padding: '6px 10px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.78rem',
                fontWeight: 700
              }}
            >
              <Tv size={14} />
              <span className="hide-mobile">Modo TV</span>
            </button>
          )}
        </div>
      </header>

      {/* Mensajes / Chat Scroll Area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {messages.length === 0 && (
          <div
            style={{
              margin: 'auto',
              textAlign: 'center',
              maxWidth: '320px',
              color: 'var(--text-muted)',
              padding: '20px'
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🦅</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
              Munin Asistente Virtual
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
              Mantén presionado el botón central de micrófono para dictar tus reuniones, historias de Padmasana o preguntas.
            </p>
          </div>
        )}

        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id || index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isUser ? 'flex-end' : 'flex-start',
                width: '100%'
              }}
            >
              <div
                style={{
                  maxWidth: isUser ? '85%' : '92%',
                  background: isUser ? 'rgba(0, 117, 168, 0.28)' : 'var(--bg-card)',
                  border: `1px solid ${isUser ? 'var(--orange-border)' : 'var(--border-subtle)'}`,
                  borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  padding: '12px 14px',
                  position: 'relative',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
              >
                {/* Header de mensaje */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '6px',
                    gap: '12px',
                    fontSize: '0.72rem',
                    color: isUser ? '#38bdf8' : 'var(--text-muted)',
                    fontWeight: 700
                  }}
                >
                  <span>{isUser ? 'Diego' : 'Munin'}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {msg.timestamp && <span>{msg.timestamp}</span>}
                    {!isUser && (
                      <button
                        onClick={() => copyToClipboard(msg.text, index, 'all')}
                        title="Copiar mensaje"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: copiedIndex === index && copiedType === 'all' ? '#4ade80' : 'var(--text-muted)',
                          cursor: 'pointer',
                          padding: '2px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        {copiedIndex === index && copiedType === 'all' ? <Check size={13} /> : <Copy size={13} />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Contenido renderizado */}
                {renderFormattedText(msg.text)}
              </div>
            </div>
          );
        })}

        {/* Indicador de proceso */}
        {isProcessing && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', padding: '6px 12px' }}>
            <RefreshCw size={16} className="spin-animation" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Munin está procesando...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ======================================================== */}
      {/* WALKIE-TALKIE CONTROL CENTER & INPUT BAR                 */}
      {/* ======================================================== */}
      <footer
        style={{
          background: 'var(--bg-header)',
          borderTop: '1px solid var(--border-subtle)',
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          flexShrink: 0,
          position: 'relative'
        }}
      >
        {/* Banner de grabación activa si está hablando */}
        {isRecording && (
          <div
            style={{
              position: 'absolute',
              top: '-42px',
              background: '#ef4444',
              color: '#ffffff',
              padding: '6px 18px',
              borderRadius: '20px',
              fontSize: '0.82rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(239, 68, 68, 0.5)',
              animation: 'pulse 1s infinite'
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#ffffff'
              }}
            />
            <span>GRABANDO ({formatTimer(recordDuration)}) • SUELTA PARA ENVIAR</span>
          </div>
        )}

        {/* Input Bar con Send y Micrófono Central Walkie-Talkie */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            maxWidth: '680px',
            gap: '10px'
          }}
        >
          {/* Input de texto fallback */}
          <div
            style={{
              flex: 1,
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder={isRecording ? 'Escuchando audio...' : 'Escribe a Munin o mantén el micro...'}
              disabled={isRecording || isProcessing}
              style={{
                width: '100%',
                background: 'var(--bg-inner)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                padding: '12px 42px 12px 14px',
                borderRadius: '14px',
                fontSize: '0.92rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isProcessing}
              style={{
                position: 'absolute',
                right: '8px',
                background: inputText.trim() ? 'var(--orange-primary)' : 'transparent',
                border: 'none',
                color: inputText.trim() ? '#ffffff' : 'var(--text-muted)',
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                cursor: inputText.trim() ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s'
              }}
            >
              <Send size={16} />
            </button>
          </div>

          {/* BOTÓN WALKIE-TALKIE PUSH-TO-TALK */}
          <button
            onPointerDown={startRecording}
            onPointerUp={stopRecording}
            onPointerCancel={stopRecording}
            disabled={isProcessing}
            title="Mantén presionado para hablar, suelta para enviar"
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: isRecording
                ? '#ef4444'
                : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              border: isRecording ? '3px solid #fecaca' : '2px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              boxShadow: isRecording
                ? '0 0 25px rgba(239, 68, 68, 0.8)'
                : '0 4px 15px rgba(2, 132, 199, 0.45)',
              transform: isRecording ? 'scale(1.12)' : 'scale(1)',
              transition: 'transform 0.15s, background 0.2s, box-shadow 0.2s',
              touchAction: 'none',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              flexShrink: 0
            }}
          >
            <Mic size={24} />
          </button>
        </div>

        {/* Guía inferior sutil */}
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          Pulsa y mantén el botón azul para hablar con Munin
        </div>
      </footer>

      {/* Estilos CSS para animaciones locales */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-animation {
          animation: spin 1.2s linear infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.04); }
        }
        @media (max-width: 640px) {
          .hide-mobile {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
