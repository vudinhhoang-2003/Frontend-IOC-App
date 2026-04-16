export const checkLimit = (val: number | undefined, min?: number, max?: number) => {
  if (val === undefined) return 'ok';
  if (min !== undefined && val < min) return 'low';
  if (max !== undefined && val > max) return 'high';
  return 'ok';
};
