import React from 'react'
import { motion } from 'framer-motion'

/**
 * Animated Risk Gauge - displays risk score with circular gauge
 * @param {number} score - Risk score from 0-100
 * @param {string} category - Risk category (Low, Medium, High)
 */
const RiskGauge = ({ score = 0, category = 'Low' }) => {
  const getRiskColor = (score) => {
    if (score <= 30) return { bg: 'from-green-500 to-emerald-500', text: 'text-green-400', accent: 'bg-green-500' }
    if (score <= 60) return { bg: 'from-yellow-500 to-orange-500', text: 'text-yellow-400', accent: 'bg-yellow-500' }
    return { bg: 'from-red-500 to-rose-500', text: 'text-red-400', accent: 'bg-red-500' }
  }

  const colors = getRiskColor(score)
  const circumference = 2 * Math.PI * 45
  const offset = circumference - (score / 100) * circumference

  return (
    <motion.div 
      className="flex flex-col items-center justify-center"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="relative w-32 h-32 mb-4">
        {/* Background Circle */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(34, 211, 238, 0.1)"
            strokeWidth="3"
          />
          {/* Animated Progress Circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={`bg-gradient-to-r ${colors.bg} stroke-current transition-all duration-500`}
            style={{
              stroke: score <= 30 ? '#10b981' : score <= 60 ? '#f59e0b' : '#ef4444',
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div 
            className={`text-3xl font-bold ${colors.text}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {Math.round(score)}
          </motion.div>
          <div className="text-xs text-cyber-gray">/ 100</div>
        </div>
      </div>

      {/* Category */}
      <div className={`px-4 py-2 rounded-lg ${colors.accent} bg-opacity-10 border border-opacity-30 ${colors.accent}`}>
        <span className={`font-semibold ${colors.text}`}>{category}</span>
      </div>
    </motion.div>
  )
}

export default RiskGauge
