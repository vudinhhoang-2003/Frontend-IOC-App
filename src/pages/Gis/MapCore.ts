import L from 'leaflet';
import type { GisPipe, GisValve } from './types';

// Pipe Styling
export function getPipeStyle(pipe: GisPipe) {
  const isTransmission = pipe.type === 'transmission';
  const isMeter = pipe.type === 'meter';
  const statusColors: Record<string, string> = {
    active: '#00c8ff',
    warning: '#ffca28',
    leaking: '#ff1744',
    closed: '#546e7a',
  };
  const color = statusColors[pipe.status] || '#00c8ff';
  return {
    color,
    weight: isTransmission ? 5 : isMeter ? 4 : pipe.diameter >= 150 ? 3 : 2.5,
    opacity: isTransmission ? 0.85 : 0.72,
    dashArray: pipe.status === 'closed' ? '8 6' : pipe.type === 'meter' ? '4 4' : undefined,
    lineCap: 'round' as const,
    lineJoin: 'round' as const,
  };
}

// Icons
export function makeValveIcon(valve: GisValve) {
  const statusColors: Record<string, string> = { open: '#00e676', closed: '#ff1744', warning: '#ffca28', active: '#00c8ff' };
  const c = statusColors[valve.status] || '#00e676';

  let svgInner = '';
  if (valve.type === 'gate') {
    svgInner = `
      <rect x="5" y="9" width="14" height="10" rx="2" fill="${c}22" stroke="${c}" stroke-width="1.5"/>
      <line x1="12" y1="4" x2="12" y2="9" stroke="${c}" stroke-width="2" stroke-linecap="round"/>
      <line x1="9" y1="4" x2="15" y2="4" stroke="${c}" stroke-width="2" stroke-linecap="round"/>
      <line x1="8" y1="13" x2="16" y2="13" stroke="${c}" stroke-width="1.2" stroke-linecap="round"/>
      ${valve.status === 'closed' ? `<line x1="7" y1="11" x2="17" y2="17" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>` : ''}`;
  } else if (valve.type === 'butterfly') {
    svgInner = `
      <circle cx="12" cy="14" r="6" fill="${c}22" stroke="${c}" stroke-width="1.5"/>
      <ellipse cx="12" cy="14" rx="2.5" ry="5.5" fill="${c}55" stroke="${c}" stroke-width="1"
        transform="rotate(${valve.status === 'closed' ? 90 : 0} 12 14)"/>
      <line x1="12" y1="4" x2="12" y2="8" stroke="${c}" stroke-width="2" stroke-linecap="round"/>
      <line x1="9" y1="4" x2="15" y2="4" stroke="${c}" stroke-width="2" stroke-linecap="round"/>`;
  } else if (valve.type === 'check') {
    svgInner = `
      <rect x="5" y="9" width="14" height="10" rx="2" fill="${c}22" stroke="${c}" stroke-width="1.5"/>
      <polyline points="9,19 14,14 9,9" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;
  } else if (valve.type === 'meter') {
    svgInner = `
      <circle cx="12" cy="14" r="7" fill="${c}22" stroke="${c}" stroke-width="1.5"/>
      <circle cx="12" cy="14" r="3" fill="${c}55" stroke="${c}" stroke-width="1"/>
      <line x1="12" y1="7" x2="12" y2="5" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="17" y1="9" x2="18.5" y2="7.5" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="19" y1="14" x2="21" y2="14" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>
      <text x="12" y="22" text-anchor="middle" font-size="5" fill="${c}" font-family="monospace">m³</text>`;
  }

  const outerRing = valve.status === 'closed'
    ? `<circle cx="12" cy="14" r="11" fill="none" stroke="${c}" stroke-width="1" stroke-dasharray="3 2" opacity="0.5"/>`
    : '';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="28" viewBox="0 0 24 28">
    <circle cx="12" cy="14" r="11.5" fill="rgba(3,14,28,0.88)" stroke="${c}" stroke-width="1.5"/>
    ${outerRing}
    ${svgInner}
  </svg>`;

  return L.divIcon({
    html: svg,
    className: 'gis-valve-icon',
    iconSize: [24, 28],
    iconAnchor: [12, 14],
    popupAnchor: [0, -14],
  });
}

export function makeStationIcon(status: string) {
  const c = { online: '#00e676', warning: '#ffca28', offline: '#ff1744' }[status as 'online'|'warning'|'offline'] || '#546e7a';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26">
    <circle cx="13" cy="13" r="10" fill="rgba(3,14,28,.9)" stroke="${c}" stroke-width="2"/>
    <circle cx="13" cy="13" r="5" fill="${c}" opacity=".8"/>
    <circle cx="13" cy="13" r="5" fill="none" stroke="${c}" stroke-width="8" opacity=".12"/>
  </svg>`;
  return L.divIcon({ html: svg, className: '', iconSize: [26, 26], iconAnchor: [13, 13] });
}

export function makeFactoryIcon() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
    <rect x="3" y="3" width="24" height="24" rx="5" fill="rgba(3,14,28,.92)" stroke="#00c8ff" stroke-width="1.8"/>
    <rect x="8" y="14" width="4" height="9" fill="#00c8ff" opacity=".8"/>
    <rect x="13" y="12" width="4" height="11" fill="#00c8ff" opacity=".9"/>
    <rect x="18" y="16" width="4" height="7" fill="#00c8ff" opacity=".7"/>
    <line x1="7" y1="22" x2="23" y2="22" stroke="#00c8ff" stroke-width="1.2" opacity=".5"/>
    <line x1="8" y1="9" x2="8" y2="14" stroke="#00c8ff" stroke-width="1.5"/>
    <line x1="13" y1="8" x2="13" y2="12" stroke="#00c8ff" stroke-width="1.5"/>
    <line x1="18" y1="10" x2="18" y2="16" stroke="#00c8ff" stroke-width="1.5"/>
  </svg>`;
  return L.divIcon({ html: svg, className: '', iconSize: [30, 30], iconAnchor: [15, 15] });
}

export function makeIncidentIcon() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26">
    <polygon points="13,3 24,23 2,23" fill="rgba(255,23,68,.18)" stroke="#ff1744" stroke-width="2" stroke-linejoin="round"/>
    <line x1="13" y1="10" x2="13" y2="17" stroke="#ff5252" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="13" cy="20" r="1.5" fill="#ff5252"/>
  </svg>`;
  return L.divIcon({ html: svg, className: '', iconSize: [26, 26], iconAnchor: [13, 23] });
}

// Global Custom CSS injected once
export function injectGlobalLeafletCss() {
  if (document.getElementById('gisV2Styles')) return;
  const s = document.createElement('style');
  s.id = 'gisV2Styles';
  s.textContent = `
    .gis-popup .leaflet-popup-content-wrapper{background:transparent!important;box-shadow:none!important;padding:0!important}
    .gis-popup .leaflet-popup-content{margin:0!important}
    .gis-popup .leaflet-popup-tip{background:var(--bg-elevated, #071629)}
    
    .gis-popup-inner{
      background: var(--bg-elevated, #071629);
      border: 1px solid var(--border, rgba(0,200,255,.2));
      border-radius: 12px;
      padding: 14px;
      min-width: 200px;
      max-width: 260px;
      font-family: Inter,sans-serif;
      color: var(--text, #e3f2fd);
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
    }
    
    .gis-popup-title{font-size:13px;font-weight:700;color:var(--cyan, #00c8ff);margin-bottom:3px;display:flex;align-items:center;gap:6px}
    .gis-popup-sub{font-size:11px;color:var(--muted, #546e7a);margin-bottom:10px}
    .gis-popup-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px}
    .gis-popup-key{font-size:10px;color:var(--muted, #546e7a)}
    .gis-popup-val{font-size:13px;font-weight:700}
    .gis-popup-status{
      font-size:11px;
      padding: 4px 10px;
      border-radius: 20px;
      display: inline-block;
      background: var(--bg-hover, rgba(0,200,255,.08));
      border: 1px solid var(--border, rgba(0,200,255,.2));
      color: var(--text-2, #90caf9);
    }

    .gis-valve-icon{background:none!important;border:none!important}
    .gis-dma-label{background:none!important;border:none!important;font-family:Inter,sans-serif}
    
    .leaflet-control-zoom{
      border:1px solid var(--border, rgba(0,200,255,.2))!important;
      background: var(--bg-elevated, rgba(7,22,41,.9))!important;
      border-radius: 8px!important;
      overflow: hidden;
      backdrop-filter: blur(10px);
    }
    .leaflet-control-zoom a{background:transparent!important;color:var(--cyan, #00c8ff)!important;border-color:var(--border, rgba(0,200,255,.15))!important;font-size:18px!important;line-height:28px!important}
    .leaflet-control-zoom a:hover{background:var(--bg-hover, rgba(0,200,255,.1))!important}
    
    .gis-pipe-tooltip{
      background: var(--bg-elevated, rgba(7,22,41,.95))!important;
      border: 1px solid var(--border-active, rgba(0,200,255,.25))!important;
      color: var(--cyan, #00c8ff)!important;
      font-size: 11px!important;
      padding: 4px 10px!important;
      border-radius: 7px!important;
      font-family: Inter,sans-serif!important;
      box-shadow: var(--shadow)!important;
    }

    /* Light Theme specific overrides if vars are not enough */
    body.light .gis-popup-inner {
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
  `;
  document.head.appendChild(s);
}
