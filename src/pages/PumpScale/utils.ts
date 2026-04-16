export const hexToRgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
};

export const getIntervalLabel = (start: number, duration: number) => {
  const startH = Math.floor(start);
  const startM = Math.round((start % 1) * 60);
  const endVal = start + duration;
  const endH = Math.floor(endVal);
  const endM = Math.round((endVal % 1) * 60);
  const fmt = (h: number, m: number) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  return `${fmt(startH, startM)}–${fmt(endH, endM)}`;
};
