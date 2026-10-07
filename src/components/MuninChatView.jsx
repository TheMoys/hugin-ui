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
  AlertCircle,
  Square,
  Volume2,
  ShieldAlert,
  Info
} from 'lucide-react';

export default function MuninChatView({
  apiUrl = '',
  isMuninConnected = false,
  onSwitchToTvMode,
  isTvAvailable = true
}) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedType, setCopiedType] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [micPermissionState, setMicPermissionState] = useState('prompt'); // 'granted', 'denied', 'prompt', 'unsupported'
  const [showSecurityHelper, setShowSecurityHelper] = useState(false);

  // Multi-tenancy context
  const [userId] = useState('diego');
  const [workspaceId, setWorkspaceId] = useState('fenix');

  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordTimerRef = useRef(null);
  const recordingActiveRef = useRef(false);
  const streamRef = useRef(null);

  // Determinar si el contexto es seguro para getUserMedia
  const isSecureEnv = typeof window !== 'undefined' && (
    window.isSecureContext ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  );

  // Auto-scroll al final
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  // Verificar soporte y permisos de micrófono
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      if (navigator.permissions && navigator.permissions.query) {
        navigator.permissions.query({ name: 'microphone' })
          .then(permissionStatus => {
            setMicPermissionState(permissionStatus.state);
            permissionStatus.onchange = () => {
              setMicPermissionState(permissionStatus.state);
            };
          })
          .catch(() => {
            setMicPermissionState('prompt');
          });
      } else {
        setMicPermissionState('prompt');
      }
    } else {
      setMicPermissionState('unsupported');
    }
  }, []);

  // Cargar historial inicial al montar
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const targetUrl = apiUrl 
          ? `${apiUrl}/api/munin/history?user_id=${userId}&workspace_id=${workspaceId}&limit=30`
          : `/api/munin/history?user_id=${userId}&workspace_id=${workspaceId}&limit=30`;

        const res = await fetch(targetUrl);
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
        console.warn('Historial de Munin no accesible temporalmente:', err);
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
      const targetUrl = apiUrl ? `${apiUrl}/api/munin/chat` : `/api/munin/chat`;
      const res = await fetch(targetUrl, {
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
      const targetUrl = apiUrl 
        ? `${apiUrl}/api/munin/reset?user_id=${userId}&workspace_id=${workspaceId}`
        : `/api/munin/reset?user_id=${userId}&workspace_id=${workspaceId}`;

      const res = await fetch(targetUrl, { method: 'POST' });
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

  // Solicitar explícitamente permisos de micrófono
  const handleRequestMicPermission = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setShowSecurityHelper(true);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setMicPermissionState('granted');
      showToast('✅ Permiso de micrófono concedido');
    } catch (err) {
      console.error('Permiso denegado:', err);
      setMicPermissionState('denied');
      showToast('⚠️ Permiso denegado en el navegador');
    }
  };

  // ==========================================
  // GRABACIÓN DE AUDIO (Dual: Push-to-Talk y Tap-to-Talk)
  // ==========================================
  const startRecordingAudio = async () => {
    if (recordingActiveRef.current || isProcessing) return;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setShowSecurityHelper(true);
      return;
    }

    recordingActiveRef.current = true;

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(40);
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setMicPermissionState('granted');
      audioChunksRef.current = [];

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
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }

        const finalChunks = audioChunksRef.current;
        if (!finalChunks || finalChunks.length === 0) {
          setIsRecording(false);
          return;
        }

        const audioBlob = new Blob(finalChunks, { type: recorder.mimeType || 'audio/webm' });
        if (audioBlob.size < 600) {
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
      setMicPermissionState('denied');
      setShowSecurityHelper(true);
    }
  };

  const stopRecordingAudio = () => {
    if (!recordingActiveRef.current) return;
    recordingActiveRef.current = false;

    if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([25, 35]);
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const cancelRecordingAudio = () => {
    recordingActiveRef.current = false;
    if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    audioChunksRef.current = [];
    setIsRecording(false);
    showToast('Grabación cancelada');
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

      const targetUrl = apiUrl ? `${apiUrl}/api/munin/audio` : `/api/munin/audio`;
      const res = await fetch(targetUrl, {
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
          text: `⚠️ No pude procesar el audio: ${err.message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const quickPrompts = [
    { label: '🎯 Sprint Goal', text: '¿Cuál es el objetivo y los entregables del Sprint actual?' },
    { label: '⏳ Próximo Review', text: '¿Cuándo es el próximo Sprint Review y cuánto tiempo falta?' },
    { label: '🚍 Autobús TUS', text: '¿Cuáles son las próximas salidas de bus en las paradas 454 y 488?' },
    { label: '⚡ Ticket Padmasana', text: 'Redacta una historia de usuario para Padmasana dividida en Backend y Frontend.' }
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      background: 'var(--bg-card)',
      border: '1px solid var(--border-card)',
      borderRadius: '16px',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--orange-primary)',
          color: '#ffffff',
          padding: '8px 18px',
          borderRadius: '20px',
          fontSize: '0.88rem',
          fontWeight: 700,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
          zIndex: 60,
          animation: 'fadeIn 0.2s ease'
        }}>
          {toastMessage}
        </div>
      )}

      {/* Modal Ayuda Seguridad / Micrófono */}
      {showSecurityHelper && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(10, 12, 18, 0.92)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 70
        }}>
          <div style={{
            background: 'var(--bg-inner)',
            border: '1px solid var(--border-card)',
            borderRadius: '16px',
            maxWidth: '520px',
            width: '100%',
            padding: '24px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.7)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f59e0b', marginBottom: '14px' }}>
              <ShieldAlert size={26} />
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff', fontWeight: 800 }}>
                Permisos de Micrófono y PWA Móvil
              </h3>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              Los navegadores móviles (Chrome/Safari) exigen un <strong>entorno seguro</strong> para pedir permiso de micrófono y permitir la instalación completa de la PWA. En red local existen dos formas directas:
            </p>

            <div style={{ background: '#0d1117', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '12px', marginBottom: '12px' }}>
              <div style={{ fontWeight: 800, color: 'var(--orange-primary)', fontSize: '0.88rem', marginBottom: '6px' }}>
                Opción 1: Habilitar IP en Chrome Móvil (Recomendada)
              </div>
              <ol style={{ fontSize: '0.82rem', color: '#e2e8f0', paddingLeft: '18px', margin: 0, lineHeight: 1.6 }}>
                <li>Abre Chrome en tu móvil y ve a: <br /><code style={{ color: '#38bdf8' }}>chrome://flags/#unsafely-treat-insecure-origin-as-secure</code></li>
                <li>Añade la URL: <br /><code style={{ color: '#4ade80' }}>http://172.22.101.100:8096</code></li>
                <li>Cambia el selector a <strong>Enabled</strong> y pulsa <strong>Relaunch</strong>.</li>
                <li>¡Listo! El móvil pedirá permiso de micrófono y Chrome mostrará el botón <em>"Instalar aplicación"</em>.</li>
              </ol>
            </div>

            <div style={{ background: '#0d1117', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '12px', marginBottom: '16px' }}>
              <div style={{ fontWeight: 800, color: '#38bdf8', fontSize: '0.88rem', marginBottom: '6px' }}>
                Opción 2: Acceso por HTTPS
              </div>
              <p style={{ fontSize: '0.82rem', color: '#cbd5e1', margin: 0 }}>
                Accede desde el móvil a <a href="https://172.22.101.100:8443" target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'underline' }}>https://172.22.101.100:8443</a> y acepta la excepción de seguridad local.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setShowSecurityHelper(false)}
                style={{
                  background: 'var(--orange-primary)',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header del Copiloto */}
      <div style={{
        padding: '12px 18px',
        borderBottom: '1px solid var(--border-card)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--bg-header)',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'var(--orange-subtle)',
            border: '1px solid var(--orange-border)',
            borderRadius: '10px',
            padding: '8px',
            color: 'var(--orange-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sparkles size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                MUNIN COPILOT
              </h2>
              <span style={{
                fontSize: '0.75rem',
                padding: '2px 8px',
                borderRadius: '12px',
                background: isMuninConnected ? 'rgba(74, 222, 128, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                color: isMuninConnected ? '#4ade80' : '#f59e0b',
                border: `1px solid ${isMuninConnected ? 'rgba(74, 222, 128, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                fontWeight: 700
              }}>
                {isMuninConnected ? '● Online' : '○ Standby'}
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Asistente Jarvis • Multi-Tenant • Padmasana Orchestrator
            </div>
          </div>
        </div>

        {/* Controles de cabecera */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Selector de Workspace */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--bg-inner)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '4px 10px',
            fontSize: '0.82rem',
            color: 'var(--text-secondary)'
          }}>
            <Briefcase size={14} color="var(--orange-primary)" />
            <select
              value={workspaceId}
              onChange={e => setWorkspaceId(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '0.82rem',
                fontWeight: 700,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="fenix" style={{ background: '#101827', color: '#fff' }}>Workspace Fénix</option>
              <option value="nutrix" style={{ background: '#101827', color: '#fff' }}>Workspace Nutrix</option>
              <option value="mahine" style={{ background: '#101827', color: '#fff' }}>Workspace Mahine</option>
            </select>
          </div>

          {/* Botón estado de micrófono */}
          <button
            onClick={micPermissionState === 'granted' ? () => showToast('Micrófono habilitado ✅') : handleRequestMicPermission}
            title={micPermissionState === 'granted' ? 'Micrófono con permiso concedido' : 'Solicitar / Verificar permiso de micrófono'}
            style={{
              background: micPermissionState === 'granted' ? 'rgba(74, 222, 128, 0.12)' : 'var(--bg-inner)',
              border: `1px solid ${micPermissionState === 'granted' ? 'rgba(74, 222, 128, 0.3)' : 'var(--border-subtle)'}`,
              color: micPermissionState === 'granted' ? '#4ade80' : 'var(--text-secondary)',
              borderRadius: '8px',
              padding: '6px 10px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Mic size={14} />
            <span>{micPermissionState === 'granted' ? 'Mic Activo' : 'Permiso Mic'}</span>
          </button>

          {/* Información de seguridad si HTTP */}
          {!isSecureEnv && (
            <button
              onClick={() => setShowSecurityHelper(true)}
              title="Información de HTTPS / Flags para móvil"
              style={{
                background: 'var(--bg-inner)',
                border: '1px solid #f59e0b',
                color: '#f59e0b',
                borderRadius: '8px',
                padding: '6px 8px',
                cursor: 'pointer'
              }}
            >
              <Info size={15} />
            </button>
          )}

          {/* Reiniciar chat */}
          <button
            onClick={handleResetHistory}
            title="Reiniciar contexto de memoria (/reset)"
            style={{
              background: 'var(--bg-inner)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
              borderRadius: '8px',
              padding: '6px 10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '0.8rem'
            }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Área de Mensajes */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        background: 'rgba(11, 13, 20, 0.6)'
      }}>
        {messages.length === 0 ? (
          <div style={{
            margin: 'auto',
            textAlign: 'center',
            maxWidth: '500px',
            padding: '30px 20px',
            color: 'var(--text-muted)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--orange-subtle)',
              border: '1px solid var(--orange-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: 'var(--orange-primary)'
            }}>
              <MessageSquare size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '8px', fontWeight: 800 }}>
              Hola Diego, soy Munin
            </h3>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '20px' }}>
              Tu orquestador Jarvis. Puedes dictar por voz usando el modo <strong>Walkie-Talkie</strong> o escribir directamente.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', textAlign: 'left' }}>
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(p.text)}
                  style={{
                    background: 'var(--bg-inner)',
                    border: '1px solid var(--border-subtle)',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    color: 'var(--text-primary)',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'border-color 0.2s',
                    lineHeight: 1.3
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--orange-primary)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                >
                  <strong style={{ color: 'var(--orange-primary)', display: 'block', marginBottom: '3px' }}>{p.label}</strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{p.text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            const hasPadmasana = msg.text && (msg.text.includes('Historia 1') || msg.text.includes('Historia 2') || msg.text.includes('Backend') || msg.text.includes('Frontend'));

            return (
              <div
                key={msg.id || index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isUser ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  alignSelf: isUser ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  background: isUser ? 'var(--orange-primary)' : 'var(--bg-inner)',
                  color: isUser ? '#ffffff' : 'var(--text-primary)',
                  padding: '12px 16px',
                  borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  border: isUser ? 'none' : '1px solid var(--border-subtle)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  fontSize: '0.94rem',
                  lineHeight: 1.55,
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap'
                }}>
                  {msg.text}
                </div>

                {/* Acciones y timestamp debajo del mensaje */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '4px',
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)'
                }}>
                  <span>{msg.timestamp || 'Ahora'}</span>

                  {!isUser && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '6px' }}>
                      <button
                        onClick={() => copyToClipboard(msg.text, index, 'all')}
                        title="Copiar mensaje completo"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: copiedIndex === index && copiedType === 'all' ? '#4ade80' : 'var(--text-muted)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          padding: '2px 4px',
                          borderRadius: '4px'
                        }}
                      >
                        {copiedIndex === index && copiedType === 'all' ? <Check size={12} /> : <Copy size={12} />}
                        <span>Copiar</span>
                      </button>

                      {hasPadmasana && (
                        <>
                          <button
                            onClick={() => copyToClipboard(msg.text, index, 'backend')}
                            title="Copiar Ticket Backend para Padmasana"
                            style={{
                              background: 'rgba(56, 189, 248, 0.12)',
                              border: '1px solid rgba(56, 189, 248, 0.3)',
                              color: copiedIndex === index && copiedType === 'backend' ? '#4ade80' : '#38bdf8',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '3px',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontWeight: 700
                            }}
                          >
                            {copiedIndex === index && copiedType === 'backend' ? <Check size={12} /> : <Copy size={12} />}
                            <span>[Ticket Backend]</span>
                          </button>

                          <button
                            onClick={() => copyToClipboard(msg.text, index, 'frontend')}
                            title="Copiar Ticket Frontend para Padmasana"
                            style={{
                              background: 'rgba(168, 85, 247, 0.12)',
                              border: '1px solid rgba(168, 85, 247, 0.3)',
                              color: copiedIndex === index && copiedType === 'frontend' ? '#4ade80' : '#c084fc',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '3px',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontWeight: 700
                            }}
                          >
                            {copiedIndex === index && copiedType === 'frontend' ? <Check size={12} /> : <Copy size={12} />}
                            <span>[Ticket Frontend]</span>
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {isProcessing && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--orange-primary)',
            fontSize: '0.85rem',
            fontWeight: 600,
            padding: '8px 12px',
            background: 'var(--bg-inner)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            alignSelf: 'flex-start'
          }}>
            <RefreshCw size={14} className="spin-animation" style={{ animation: 'spin 1.2s linear infinite' }} />
            <span>Munin está procesando tu petición...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Barra de Grabación Activa */}
      {isRecording && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.12)',
          borderTop: '2px solid #ef4444',
          padding: '10px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f87171', fontWeight: 700 }}>
            <span style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#ef4444',
              display: 'inline-block',
              animation: 'pulse 1s infinite'
            }} />
            <span>Grabando audio: {recordDuration}s</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={cancelRecordingAudio}
              style={{
                background: 'transparent',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#f87171',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button
              onClick={stopRecordingAudio}
              style={{
                background: '#ef4444',
                border: 'none',
                color: '#fff',
                padding: '6px 16px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Send size={14} /> Enviar Audio
            </button>
          </div>
        </div>
      )}

      {/* Barra de Entrada de Mensaje */}
      <div style={{
        padding: '12px 18px',
        borderTop: '1px solid var(--border-card)',
        background: 'var(--bg-header)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        {/* Botón Tap-to-Record / Tap-to-Send (Un toque para grabar, un toque para enviar) */}
        <button
          type="button"
          onClick={isRecording ? stopRecordingAudio : startRecordingAudio}
          title={isRecording ? "Toque para enviar nota de voz" : "Toque para empezar a grabar voz"}
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: isRecording ? '#ef4444' : 'var(--orange-subtle)',
            border: `2px solid ${isRecording ? '#ef4444' : 'var(--orange-border)'}`,
            color: isRecording ? '#ffffff' : 'var(--orange-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'all 0.15s ease',
            boxShadow: isRecording ? '0 0 16px rgba(239, 68, 68, 0.7)' : 'none'
          }}
        >
          {isRecording ? <Send size={20} /> : <Mic size={22} />}
        </button>

        {/* Input de texto */}
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder={isRecording ? "🔴 Grabando... pulsa el botón rojo para enviar" : "Escribe un mensaje o pulsa el micro para hablar..."}
          disabled={isProcessing || isRecording}
          style={{
            flex: 1,
            background: 'var(--bg-inner)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '12px 16px',
            color: 'var(--text-primary)',
            fontSize: '0.92rem',
            outline: 'none',
            fontFamily: 'inherit'
          }}
        />

        {/* Botón de Enviar */}
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || isProcessing || isRecording}
          style={{
            background: inputText.trim() && !isProcessing ? 'var(--orange-primary)' : 'rgba(255, 255, 255, 0.05)',
            color: inputText.trim() && !isProcessing ? '#ffffff' : 'var(--text-muted)',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 18px',
            cursor: inputText.trim() && !isProcessing ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            fontWeight: 700
          }}
        >
          <Send size={18} />
        </button>
      </div>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.9); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
