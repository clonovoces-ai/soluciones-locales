export function formatMoney(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDateTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('es-AR', {
      dateStyle: 'short',
      timeStyle: 'medium',
    }).format(date);
  } catch {
    return isoString;
  }
}

export function formatTimeOnly(isoString: string): string {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('es-AR', {
      timeStyle: 'short',
    }).format(date);
  } catch {
    return isoString;
  }
}

export function calculateMargin(cost: number, sale: number): number {
  if (cost <= 0) return 100;
  return Math.round(((sale - cost) / cost) * 100);
}
