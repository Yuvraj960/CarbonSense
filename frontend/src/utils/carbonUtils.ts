// Carbon translator utility — mirrors the backend engine for frontend use

export function translateCarbon(kgCO2: number) {
  return {
    car_km: Math.round(kgCO2 * 4.76),
    fan_days: Math.round(kgCO2 * 1.52),
    tree_months: parseFloat((kgCO2 / 1.7).toFixed(1)),
    smartphone_charges: Math.round(kgCO2 / 0.009),
    bulb_hours: Math.round((kgCO2 * 1000) / 0.82 / 9),
  };
}

export function getCarbonComparisons(kgCO2: number): string[] {
  const t = translateCarbon(kgCO2);
  return [
    `Driving ${t.car_km} km in a petrol car`,
    `Running a ceiling fan for ${t.fan_days} days`,
    `${t.tree_months} months of absorption by 1 tree`,
    `Charging a smartphone ${t.smartphone_charges} times`,
  ].slice(0, 3);
}

export function getCarbonRating(total: number) {
  if (total < 80) return { label: 'Excellent', color: '#22c55e', emoji: '🌟', score: 90 };
  if (total < 150) return { label: 'Good', color: '#84cc16', emoji: '🌿', score: 75 };
  if (total < 250) return { label: 'Average', color: '#eab308', emoji: '⚡', score: 55 };
  if (total < 400) return { label: 'High', color: '#f97316', emoji: '🔥', score: 35 };
  return { label: 'Very High', color: '#ef4444', emoji: '🚨', score: 15 };
}

export function formatCO2(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)} tonnes`;
  return `${kg.toFixed(1)} kg`;
}

export function xpToNextLevel(level: number, currentXP: number): { needed: number; current: number; percent: number } {
  const needed = level * 100;
  return { needed, current: currentXP, percent: Math.min(100, Math.round((currentXP / needed) * 100)) };
}

export function getCategoryIcon(category: string): string {
  const map: Record<string, string> = {
    transport: '🚗', food: '🥗', electricity: '💡', shopping: '🛍️', general: '🌱', energy: '⚡',
  };
  return map[category] || '🌿';
}

export function getCategoryColor(category: string): string {
  const map: Record<string, string> = {
    transport: '#60a5fa', food: '#4ade80', electricity: '#fbbf24', shopping: '#c084fc', general: '#34d399', energy: '#fb923c',
  };
  return map[category] || '#4ade80';
}

export function getEcoworldLabel(level: number): string {
  const labels = ['Barren Land', 'First Sprouts', 'Young Forest', 'Lush Grove', 'Thriving Ecosystem', 'Paradise'];
  return labels[Math.min(level, 5)];
}
