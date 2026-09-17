// Calculate next Friday at 14:00:00 CEST
const getNextSprintFriday = () => {
  const now = new Date();
  // Target Friday 14:00 (Tomorrow, Sept 18 2026)
  const target = new Date(now);
  target.setDate(now.getDate() + 1); // Tomorrow Friday
  target.setHours(14, 0, 0, 0);
  return target.toISOString();
};

export const INITIAL_REVIEW = {
  id: 'review-1',
  title: 'Próximo Sprint Review - Fénix',
  targetDate: getNextSprintFriday(),
  scheduleText: 'Todos los viernes cada 2 semanas a las 14:00',
  location: 'Sala de Reuniones Fénix / Pantalla Principal'
};

export const INITIAL_SPRINT_GOAL = {
  id: 'sprint-goal-1',
  code: 'SPRINT-24',
  title: '🎯 Objetivo del Sprint',
  description: 'Despliegue de la versión inicial de Hugin-UI para proyección en pantalla con información de proyectos y monitoreo TUS Santander en directo para las paradas 488 y 487 del PCTCAN.',
};

export const INITIAL_PROJECTS = [
  {
    id: 'proj-1',
    code: 'HUGIN-UI',
    title: 'Hugin-UI Dashboard',
    version: 'v1.4.0',
    status: 'en_progreso',
    lastUpdate: '16 Sep 2026',
    nextDeploy: '18 Sep 2026 (Mañana)',
    color: 'yellow',
    rotation: -1.5,
  },
  {
    id: 'proj-2',
    code: 'FENIX-CORE',
    title: 'Fénix Core API',
    version: 'v2.1.0-rc2',
    status: 'en_progreso',
    lastUpdate: '15 Sep 2026',
    nextDeploy: '25 Sep 2026',
    color: 'mint',
    rotation: 1.2,
  },
  {
    id: 'proj-3',
    code: 'TUS-BOT',
    title: 'Bot TUS Santander Alerts',
    version: 'v1.0.4',
    status: 'completado',
    lastUpdate: '14 Sep 2026',
    nextDeploy: '20 Sep 2026',
    color: 'blue',
    rotation: -2.0,
  },
  {
    id: 'proj-4',
    code: 'GIS-PCTCAN',
    title: 'Mapeo GIS PCTCAN',
    version: 'v0.8.5',
    status: 'bloqueado',
    lastUpdate: '10 Sep 2026',
    nextDeploy: '02 Oct 2026',
    color: 'pink',
    rotation: 1.8,
  },
  {
    id: 'proj-5',
    code: 'CT-METRICS',
    title: 'CT Metrics Engine',
    version: 'v0.9.0',
    status: 'planificado',
    lastUpdate: '12 Sep 2026',
    nextDeploy: '09 Oct 2026',
    color: 'amber',
    rotation: -1.0,
  },
  {
    id: 'proj-6',
    code: 'AUTH-NOTIF',
    title: 'Servicio Notificaciones Telegram',
    version: 'v1.2.1',
    status: 'completado',
    lastUpdate: '08 Sep 2026',
    nextDeploy: '15 Oct 2026',
    color: 'mint',
    rotation: 2.2,
  }
];

export const TARGET_BUS_STOPS = [
  { id: '488', name: 'Pctcan (UNEATLANTICO)', linesHint: 'L1, L24C1, L24C2' },
  { id: '487', name: 'Pctcan 3 (Lluja)', linesHint: 'L13, L14' }
];
