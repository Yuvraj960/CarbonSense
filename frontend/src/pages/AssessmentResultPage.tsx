import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCarbonComparisons, getCarbonRating, getCategoryColor, getCategoryIcon } from '../utils/carbonUtils';
import { ArrowRight, TrendingDown, Leaf } from 'lucide-react';

export default function AssessmentResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    navigate('/onboarding');
    return null;
  }

  const { assessment, comparisons, rating, aiSuggestions } = result;
  const categories = [
    { key: 'transport', label: 'Transport', value: assessment.transport_score },
    { key: 'food', label: 'Food', value: assessment.food_score },
    { key: 'electricity', label: 'Electricity', value: assessment.electricity_score },
    { key: 'shopping', label: 'Shopping', value: assessment.shopping_score },
  ];
  const total = assessment.total_score;
  const ratingInfo = getCarbonRating(total);

  return (
    <div className="animated-bg min-h-screen p-6" style={{ maxWidth: 800, margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10 pt-8">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}
          style={{ fontSize: 56, marginBottom: 12 }}>{ratingInfo.emoji}</motion.div>
        <h1 className="text-4xl font-bold gradient-text mb-2">Your Carbon Footprint</h1>
        <p style={{ color: '#86efac' }}>Here's what your lifestyle contributes to carbon emissions each month</p>
      </motion.div>

      {/* Big Score */}
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
        className="glass p-8 mb-6 text-center glow-green-sm">
        <p style={{ color: '#86efac', fontSize: 14, marginBottom: 8 }}>Monthly CO₂ Footprint</p>
        <p style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: 900, lineHeight: 1, fontFamily: 'Space Grotesk, sans-serif' }} className="gradient-text">
          {total.toFixed(1)} <span style={{ fontSize: '1.5rem' }}>kg CO₂</span>
        </p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: `${ratingInfo.color}18`, border: `1px solid ${ratingInfo.color}40`, borderRadius: 999, padding: '6px 16px', marginTop: 12 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: ratingInfo.color, display: 'inline-block' }} />
          <span style={{ color: ratingInfo.color, fontWeight: 700 }}>{ratingInfo.label}</span>
        </div>
      </motion.div>

      {/* Comparisons */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass p-6 mb-6">
        <p style={{ color: '#86efac', fontSize: 13, marginBottom: 12 }}>THIS IS EQUIVALENT TO</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {(comparisons || getCarbonComparisons(total)).map((comp: string, i: number) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(34,197,94,0.06)', borderRadius: 8, border: '1px solid rgba(34,197,94,0.12)' }}>
              <span style={{ fontSize: 20 }}>{['🚗', '💨', '🌳'][i]}</span>
              <p style={{ color: '#f0fdf4', fontSize: 14 }}>{comp}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Category Breakdown */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass p-6 mb-6">
        <p style={{ color: '#86efac', fontSize: 13, marginBottom: 16 }}>CATEGORY BREAKDOWN</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {categories.sort((a, b) => b.value - a.value).map((cat, i) => {
            const pct = total > 0 ? (cat.value / total) * 100 : 0;
            return (
              <div key={cat.key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: '#f0fdf4', fontSize: 14 }}>{getCategoryIcon(cat.key)} {cat.label}</span>
                  <span style={{ color: getCategoryColor(cat.key), fontWeight: 600, fontSize: 14 }}>
                    {cat.value.toFixed(1)} kg ({pct.toFixed(0)}%)
                  </span>
                </div>
                <div className="progress-bar">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                    style={{ height: '100%', background: getCategoryColor(cat.key), borderRadius: 3 }} />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* AI Suggestions */}
      {aiSuggestions && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass p-6 mb-6">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Leaf size={18} color="#22c55e" />
            <p style={{ color: '#86efac', fontSize: 13 }}>AI RECOMMENDATIONS</p>
          </div>
          <p style={{ color: '#f0fdf4', lineHeight: 1.8, fontSize: 14, whiteSpace: 'pre-line' }}>{aiSuggestions}</p>
        </motion.div>
      )}

      {/* CTA */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/dashboard">
          <motion.button whileHover={{ scale: 1.03 }} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 28px' }}>
            Go to Dashboard <ArrowRight size={16} />
          </motion.button>
        </Link>
        <Link to="/coach">
          <motion.button whileHover={{ scale: 1.03 }} className="btn-secondary" style={{ padding: '14px 28px' }}>
            Get AI Advice 🤖
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
