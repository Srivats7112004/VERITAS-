import React from 'react'
import { motion } from 'framer-motion'

/**
 * Reusable glass card component with motion
 */
const GlassCard = ({ 
  children, 
  className = '', 
  hover = true,
  glow = false,
  delay = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`glassmorphism ${glow ? 'neon-glow' : ''} ${className} ${
        hover ? 'hover:border-cyber-cyan cursor-pointer transition-all' : ''
      }`}
      whileHover={hover ? { y: -5, borderColor: 'rgba(34, 211, 238, 0.5)' } : {}}
    >
      {children}
    </motion.div>
  )
}

export default GlassCard
