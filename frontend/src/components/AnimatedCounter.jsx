import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

/**
 * Animated counter component for displaying numbers
 */
const AnimatedCounter = ({ from = 0, to, duration = 1.5, suffix = '', prefix = '' }) => {
  const [value, setValue] = useState(from)

  useEffect(() => {
    let startTime = null
    const animate = (currentTime) => {
      if (startTime === null) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / (duration * 1000), 1)
      
      setValue(Math.floor(from + (to - from) * progress))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    const id = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(id)
  }, [from, to, duration])

  return (
    <span className="font-semibold text-cyber-cyan">
      {prefix}{value}{suffix}
    </span>
  )
}

export default AnimatedCounter
