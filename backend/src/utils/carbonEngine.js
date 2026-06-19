// Carbon Emission Factors (kg CO2 per unit)
const EMISSION_FACTORS = {
  transport: {
    car: 0.21,        // kg CO2 per km
    bike: 0.11,       // motorcycle
    metro: 0.04,
    bus: 0.089,
    train: 0.037,
    flight: 0.255,
    walk: 0,
  },
  food: {
    vegetarian: 50,       // kg CO2 per month
    eggetarian: 70,
    mixed: 100,
    'meat-heavy': 140,
  },
  electricity: 0.82,    // kg CO2 per kWh (India grid factor)
  shopping: 6,          // kg CO2 per online order
};

/**
 * Calculate carbon footprint in kg CO2/month
 */
function calculateCarbonScore({ transport_mode, transport_km_per_week, food_type, electricity_units, shopping_orders_per_month }) {
  const transport_score = (EMISSION_FACTORS.transport[transport_mode] || 0) * transport_km_per_week * 4;
  const food_score = EMISSION_FACTORS.food[food_type] || 100;
  const electricity_score = electricity_units * EMISSION_FACTORS.electricity;
  const shopping_score = shopping_orders_per_month * EMISSION_FACTORS.shopping;
  const total_score = transport_score + food_score + electricity_score + shopping_score;

  return {
    transport_score: parseFloat(transport_score.toFixed(2)),
    food_score: parseFloat(food_score.toFixed(2)),
    electricity_score: parseFloat(electricity_score.toFixed(2)),
    shopping_score: parseFloat(shopping_score.toFixed(2)),
    total_score: parseFloat(total_score.toFixed(2)),
  };
}

/**
 * Translate kg CO2 into human-readable equivalents
 */
function translateCarbon(kgCO2) {
  return {
    car_km: parseFloat((kgCO2 * 4.76).toFixed(0)),             // km in a petrol car
    fan_days: parseFloat((kgCO2 * 1.52).toFixed(0)),           // days running ceiling fan
    tree_months: parseFloat((kgCO2 / 1.7).toFixed(1)),         // months for a tree to absorb
    flights_percent: parseFloat((kgCO2 / 255).toFixed(2)),      // fraction of a domestic flight
    bulb_hours: parseFloat((kgCO2 * 1000 / 0.82 / 9).toFixed(0)), // hours of 9W LED bulb
    smartphone_charges: parseFloat((kgCO2 / 0.009).toFixed(0)),   // smartphone charges
  };
}

/**
 * Get a human-friendly comparison string for given kg CO2
 */
function getCarbonComparisons(kgCO2) {
  const t = translateCarbon(kgCO2);
  const comparisons = [];
  if (t.car_km > 0) comparisons.push(`Driving ${t.car_km} km in a petrol car`);
  if (t.fan_days > 0) comparisons.push(`Running a ceiling fan for ${t.fan_days} days`);
  if (t.tree_months > 0) comparisons.push(`${t.tree_months} months of carbon absorption by one tree`);
  if (t.smartphone_charges > 0) comparisons.push(`Charging a smartphone ${t.smartphone_charges} times`);
  return comparisons.slice(0, 3);
}

/**
 * Get carbon score rating
 */
function getCarbonRating(totalKg) {
  if (totalKg < 80) return { label: 'Excellent', color: 'green', emoji: '🌟' };
  if (totalKg < 150) return { label: 'Good', color: 'lime', emoji: '🌿' };
  if (totalKg < 250) return { label: 'Average', color: 'yellow', emoji: '⚡' };
  if (totalKg < 400) return { label: 'High', color: 'orange', emoji: '🔥' };
  return { label: 'Very High', color: 'red', emoji: '🚨' };
}

/**
 * XP needed to reach next level
 */
function xpForLevel(level) {
  return level * 100;
}

module.exports = { calculateCarbonScore, translateCarbon, getCarbonComparisons, getCarbonRating, xpForLevel };
