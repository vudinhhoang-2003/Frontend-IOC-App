import { LIMS_DATA } from './mockLabData';

export function getStatusColor(value: number, key: keyof typeof LIMS_DATA.limits): string {
  const lim = LIMS_DATA.limits[key];
  if (!lim) return 'var(--text)';
  if (key === 'coliform') return value > 0 ? 'var(--red)' : 'var(--green)';
  if (value < lim.min || value > lim.max) return 'var(--red)';
  const rangePct = (value - lim.min) / (lim.max - lim.min);
  return rangePct < 0.2 || rangePct > 0.8 ? 'var(--yellow)' : 'var(--green)';
}

export function getParamBadge(value: number | null | undefined, key: keyof typeof LIMS_DATA.limits) {
  const lim = LIMS_DATA.limits[key];
  if (value === undefined || value === null || !lim) {
    return { className: 'badge badge-gray', text: '—' };
  }
  const isAlert = key === 'coliform' ? value > 0 : (value < lim.min || value > lim.max);
  const isWarning = !isAlert && (() => {
    const rangePct = (value - lim.min) / (lim.max - lim.min);
    return rangePct < 0.2 || rangePct > 0.8;
  })();
  
  const className = isAlert ? 'badge badge-red' : 
                    isWarning ? 'badge badge-yellow' : 
                    'badge badge-green';
  
  return { className, text: `${value} ${lim.unit}` };
}
