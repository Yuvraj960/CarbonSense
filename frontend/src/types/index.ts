export interface User {
  _id: string;
  name: string;
  email: string;
  xp: number;
  eco_points: number;
  level: number;
  streak_current: number;
  streak_best: number;
  team_id: string | null;
  badges: string[];
  ecoworld_level: number;
  createdAt: string;
}

export interface CarbonAssessment {
  _id: string;
  user_id: string;
  transport_mode: string;
  transport_km_per_week: number;
  food_type: string;
  electricity_units: number;
  shopping_orders_per_month: number;
  transport_score: number;
  food_score: number;
  electricity_score: number;
  shopping_score: number;
  total_score: number;
  createdAt: string;
}

export interface DailyAction {
  _id: string;
  action_key: string;
  action_name: string;
  category: string;
  carbon_saved: number;
  xp_earned: number;
  eco_points_earned: number;
  createdAt: string;
}

export interface ActionCatalogItem {
  key: string;
  name: string;
  category: string;
  carbon_saved: number;
  xp_earned: number;
  eco_points_earned: number;
  icon: string;
  description: string;
}

export interface Challenge {
  _id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  duration_days: number;
  target_actions: number;
  xp_reward: number;
  eco_points_reward: number;
  badge_id: string;
  is_joined: boolean;
  user_progress: number;
  user_completed: boolean;
}

export interface Team {
  _id: string;
  name: string;
  description: string;
  members: User[];
  invite_code: string;
  member_count?: number;
}

export interface LeaderboardEntry {
  _id: string;
  name: string;
  level: number;
  eco_points: number;
  streak_best: number;
  badges: string[];
  ranking_score: number;
  latest_carbon: number | null;
}

export interface CarbonRating {
  label: string;
  color: string;
  emoji: string;
}

export interface AssessmentFormData {
  transport_mode: string;
  transport_km_per_week: number;
  food_type: string;
  electricity_units: number;
  shopping_orders_per_month: number;
}
