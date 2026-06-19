const Challenge = require('./src/models/Challenge');
require('dotenv').config();
const mongoose = require('mongoose');

const challenges = [
  {
    title: 'No-Car Week',
    description: 'Go 7 days without using a personal car. Use metro, bus, cycle or walk instead.',
    icon: '🚗',
    category: 'transport',
    duration_days: 7,
    target_actions: 7,
    xp_reward: 200,
    eco_points_reward: 150,
    badge_id: 'no_car_week',
    is_active: true,
  },
  {
    title: 'Plastic-Free Weekend',
    description: 'Spend 2 days avoiding all single-use plastic — bottles, straws, bags.',
    icon: '♻️',
    category: 'general',
    duration_days: 2,
    target_actions: 4,
    xp_reward: 100,
    eco_points_reward: 80,
    badge_id: 'plastic_free_warrior',
    is_active: true,
  },
  {
    title: 'Green Commute Challenge',
    description: 'Use public transit or non-motorized transport for 5 commutes this week.',
    icon: '🚇',
    category: 'transport',
    duration_days: 7,
    target_actions: 5,
    xp_reward: 150,
    eco_points_reward: 120,
    badge_id: 'green_commuter',
    is_active: true,
  },
  {
    title: 'Sustainable Shopping Challenge',
    description: 'Make 3 eco-friendly shopping choices — thrift, local, or reusable.',
    icon: '🛍️',
    category: 'shopping',
    duration_days: 7,
    target_actions: 3,
    xp_reward: 120,
    eco_points_reward: 100,
    badge_id: 'eco_shopper',
    is_active: true,
  },
  {
    title: 'Plant-Based Week',
    description: 'Eat at least one plant-based meal every day for 7 days.',
    icon: '🥗',
    category: 'food',
    duration_days: 7,
    target_actions: 7,
    xp_reward: 180,
    eco_points_reward: 140,
    badge_id: 'plant_power',
    is_active: true,
  },
  {
    title: 'Energy Saver',
    description: 'Log 5 energy-saving actions this week — lights off, unplug devices, short showers.',
    icon: '💡',
    category: 'energy',
    duration_days: 7,
    target_actions: 5,
    xp_reward: 130,
    eco_points_reward: 100,
    badge_id: 'energy_saver',
    is_active: true,
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Challenge.deleteMany({});
  await Challenge.insertMany(challenges);
  console.log('✅ Challenges seeded successfully');
  mongoose.disconnect();
}

seed().catch(console.error);
