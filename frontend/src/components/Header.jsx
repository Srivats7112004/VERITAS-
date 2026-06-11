import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Menu, X } from 'lucide-react'
import { useState } from 'react'

/**
 * Navigation Header with Logo and Menu
 */
const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Analyze', path: '/analyze' },
    { label: 'Twin Detection', path: '/twin-detection' },
    { label: 'Simulation', path: '/simulation' },
    { label: 'Deception Graph', path: '/deception-graph' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Architecture', path: '/architecture' },
  ]

  return (
    <header className="fixed top-0 w-full z-50 glassmorphism-deep backdrop-blur-xl border-b border-cyber-cyan border-opacity-10 shadow-2xl shadow-cyber-navy/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8 }}
              className="p-3 rounded-2xl bg-gradient-to-r from-cyber-cyan to-cyber-blue shadow-cyber-cyan/20"
            >
              <Shield size={24} className="text-cyber-dark" />
            </motion.div>
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-bold text-gradient">VERITAS</span>
              <span className="text-xs uppercase tracking-[0.35em] text-cyber-gray">Identity Truth Engine</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all ${
                  location.pathname === item.path
                    ? 'text-cyber-cyan bg-cyber-cyan bg-opacity-10 neon-glow'
                    : 'text-cyber-gray hover:text-cyber-cyan hover:bg-cyber-cyan hover:bg-opacity-10'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            className="md:hidden p-2 rounded-xl hover:bg-cyber-cyan hover:bg-opacity-15 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden pb-4 flex flex-col gap-2"
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`px-3 py-2 rounded-2xl text-sm font-medium transition-all ${
                  location.pathname === item.path
                    ? 'text-cyber-cyan bg-cyber-cyan bg-opacity-10'
                    : 'text-cyber-gray hover:text-cyber-cyan hover:bg-cyber-cyan hover:bg-opacity-10'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </motion.nav>
        )}
      </div>
    </header>
  )
}

export default Header
