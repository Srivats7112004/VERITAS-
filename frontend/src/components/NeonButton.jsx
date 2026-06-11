import React from 'react'
import { motion } from 'framer-motion'

/**
 * Neon button component with cyber styling
 */
const NeonButton = ({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  fullWidth = false,
  ...props 
}) => {
  const baseStyles = 'btn-cyber font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2'
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  const variants = {
    primary: 'bg-gradient-to-r from-cyber-cyan to-cyber-blue text-cyber-dark hover:shadow-lg hover:shadow-cyber-cyan/50',
    secondary: 'bg-gradient-to-r from-cyber-purple to-cyber-blue text-white hover:shadow-lg hover:shadow-cyber-purple/50',
    outline: 'border-2 border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan hover:bg-opacity-10',
    ghost: 'text-cyber-cyan hover:bg-cyber-cyan hover:bg-opacity-5',
  }

  const width = fullWidth ? 'w-full' : ''
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : ''

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${width} ${disabledClass} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export default NeonButton
