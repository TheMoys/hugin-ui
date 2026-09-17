export const INITIAL_REVIEW = {
  id: 'review-1',
  title: 'Review Próximo - Sprint 24 Fénix',
  targetDate: new Date(Date.now() + (2 * 24 * 60 * 60 + 4 * 60 * 60 + 15 * 60) * 1000).toISOString(), // ~2 days from now
  location: 'Sala Fénix / Google Meet',
  checklist: [
    { id: 'c1', text: 'Demo interactiva del nuevo Hugin-UI (Pizarra de Corcho)', completed: true },
    { id: 'c2', text: 'Integración API TUS Santander (Parada PCTCAN Uneatlantico)', completed: true },
    { id: 'c3', text: 'Revisión de tarjetas de proyectos y estado de equipo', completed: false },
    { id: 'c4', text: 'Planificación del Sprint 25 & Backlog grooming', completed: false },
  ]
};

export const INITIAL_SPRINT_GOAL = {
  id: 'sprint-goal-1',
  code: 'SPRINT-24',
  title: '🚀 Objetivo del Sprint Fénix',
  description: 'Desplegar la primera versión del dashboard de control Hugin-UI en formato pizarra de corcho con métricas de proyecto e información del autobús TUS en tiempo real para la parada PCTCAN Uneatlantico.',
  progress: 78,
  deliverables: [
    { id: 'd1', label: 'Diseño responsive estilo Pizarra de Corcho con chinchetas', completed: true },
    { id: 'd2', text: 'Sección Fénix Planning con cuenta regresiva y objetivo', completed: true },
    { id: 'd3', text: 'Conector de datos API TUS Santander (Líneas 1, 24C1, 24C2, 13)', completed: true },
    { id: 'd4', text: 'Gestión de Cards de Proyectos y filtros interactivos', completed: true },
    { id: 'd5', text: 'Modal para agregar y modificar notas en la pizarra', completed: false },
  ]
};

export const INITIAL_PROJECTS = [
  {
    id: 'proj-1',
    code: 'HUGIN-UI',
    title: 'Hugin-UI Pizarra de Corcho',
    description: 'Dashboard principal del equipo para visualizar en tiempo real el progreso de proyectos y datos clave.',
    status: 'en_progreso', // 'en_progreso', 'en_revision', 'completado', 'bloqueado', 'planificado'
    priority: 'alta',
    progress: 85,
    dueDate: '2026-09-25',
    color: 'yellow', // yellow, mint, blue, pink, amber
    rotation: -1.8,
    lead: 'Diego Moys',
    team: ['Diego M.', 'Carlos R.', 'Ana P.'],
    tags: ['React', 'Vite', 'CSS3', 'TUS API'],
    blockerReason: '',
    tasksCount: { done: 6, total: 8 }
  },
  {
    id: 'proj-2',
    code: 'FENIX-CORE',
    title: 'Fénix Core Engine & API',
    description: 'Motor backend de microservicios y sincronización de tareas de la plataforma Fénix.',
    status: 'en_progreso',
    priority: 'alta',
    progress: 70,
    dueDate: '2026-10-02',
    color: 'mint',
    rotation: 1.5,
    lead: 'Ana Pérez',
    team: ['Ana P.', 'Diego M.'],
    tags: ['FastAPI', 'Python', 'Docker', 'PostgreSQL'],
    blockerReason: '',
    tasksCount: { done: 14, total: 20 }
  },
  {
    id: 'proj-3',
    code: 'TUS-BOT',
    title: 'Bot TUS Santander Alerts',
    description: 'Notificador de tiempos de paso del bus en la parada PCTCAN Uneatlantico para el equipo.',
    status: 'en_revision',
    priority: 'media',
    progress: 92,
    dueDate: '2026-09-20',
    color: 'blue',
    rotation: -2.2,
    lead: 'Laura Sánchez',
    team: ['Laura S.', 'Carlos R.'],
    tags: ['Node.js', 'OpenData', 'Webhooks'],
    blockerReason: '',
    tasksCount: { done: 11, total: 12 }
  },
  {
    id: 'proj-4',
    code: 'GIS-PCTCAN',
    title: 'Mapeo GIS e Infraestructura PCTCAN',
    description: 'Integración de mapas interactivos de movilidad y geo-referenciación en la zona de Uneatlantico.',
    status: 'bloqueado',
    priority: 'alta',
    progress: 40,
    dueDate: '2026-10-15',
    color: 'pink',
    rotation: 2.1,
    lead: 'Carlos Ruiz',
    team: ['Carlos R.', 'Miguel G.'],
    tags: ['GeoJSON', 'Leaflet', 'GIS'],
    blockerReason: 'Pendiente de token de autorización del servidor GeoServer.',
    tasksCount: { done: 4, total: 10 }
  },
  {
    id: 'proj-5',
    code: 'CT-METRICS',
    title: 'CT Metrics Dashboard',
    description: 'Panel de métricas de productividad, rendimiento del servidor y tiempos de respuesta.',
    status: 'planificado',
    priority: 'media',
    progress: 20,
    dueDate: '2026-11-01',
    color: 'amber',
    rotation: -1.2,
    lead: 'Miguel Gómez',
    team: ['Miguel G.'],
    tags: ['Grafana', 'Prometheus', 'Metrics'],
    blockerReason: '',
    tasksCount: { done: 2, total: 10 }
  },
  {
    id: 'proj-6',
    code: 'AUTH-NOTIF',
    title: 'Servicio de Notificaciones Telegram',
    description: 'Alertas automáticas al canal del equipo sobre eventos críticos y deploys.',
    status: 'completado',
    priority: 'baja',
    progress: 100,
    dueDate: '2026-09-10',
    color: 'mint',
    rotation: 2.8,
    lead: 'Diego Moys',
    team: ['Diego M.', 'Laura S.'],
    tags: ['Telegram Bot API', 'Python'],
    blockerReason: '',
    tasksCount: { done: 8, total: 8 }
  }
];

export const BUS_STOPS_CONFIG = {
  stopId: '454',
  stopName: 'PCTCAN - UNEATLANTICO',
  linesSupported: ['1', '24C1', '24C2', '13', '14'],
  defaultArrivals: [
    { line: '1', destination: 'VALDENOJA / PCTCAN', nextMinutes: 4, secondMinutes: 14, distanceMeter: 850, isRealtime: true },
    { line: '24C1', destination: 'CIRCULAR SAN MARTÍN', nextMinutes: 7, secondMinutes: 22, distanceMeter: 1420, isRealtime: true },
    { line: '24C2', destination: 'CIRCULAR SAN MARTÍN', nextMinutes: 11, secondMinutes: 28, distanceMeter: 2300, isRealtime: true },
    { line: '13', destination: 'LLUJA / PCTCAN', nextMinutes: 18, secondMinutes: 39, distanceMeter: 4100, isRealtime: true }
  ]
};
