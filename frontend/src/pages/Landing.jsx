import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Shield, Brain, Network, BarChart3, Zap, Eye } from 'lucide-react'
import NeonButton from '../components/NeonButton'
import GlassCard from '../components/GlassCard'

/**
 * Landing page - Hero section with feature highlights and CTA
 */
const Landing = () => {
  const features = [
    {
      icon: Shield,
      title: 'Risk Analysis',
      description: 'Advanced AI-powered analysis of social media profiles for scam and fraud detection'
    },
    {
      icon: Eye,
      title: 'Twin Detection',
      description: 'Identify impersonation attempts and duplicate fake accounts'
    },
    {
      icon: Brain,
      title: 'Smart Learning',
      description: 'Interactive simulations to enhance cybersecurity awareness'
    },
    {
      icon: Network,
      title: 'Deception Graph',
      description: 'Visual intelligence network of fraudulent connections'
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description: 'Comprehensive statistics and trend analysis dashboard'
    },
    {
      icon: Zap,
      title: 'Real-time Detection',
      description: 'Instant feedback and explainable AI reasoning'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="page-section px-4">
      {/* Hero Section */}
      <motion.section 
        className="max-w-6xl mx-auto text-center mb-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="section-title font-bold mb-6">
            <span className="text-gradient">VERITAS</span>
          </h1>
          <p className="section-subtitle mx-auto mb-8">
            Because <span className="text-cyber-cyan font-semibold">Appearances Deceive</span>
          </p>
        </motion.div>

        <motion.p 
          className="text-lg text-cyber-gray max-w-2xl mx-auto mb-12 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Advanced AI-powered social media identity risk assessment. Detect scams, impersonation attempts, 
          and deceptive behavior patterns with explainable intelligence.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link to="/analyze">
            <NeonButton size="lg" variant="primary" className="gap-3">
              <Shield size={20} />
              Analyze Identity
              <ArrowRight size={20} />
            </NeonButton>
          </Link>
          <Link to="/simulation">
            <NeonButton size="lg" variant="secondary">
              Run Simulation
            </NeonButton>
          </Link>
        </motion.div>

        {/* Animated Accent */}
        <motion.div 
          className="hero-surface relative w-full h-32 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyber-cyan via-opacity-10 to-transparent animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-cyber-cyan font-semibold">⚡ AI-Powered. Explainable. Intelligent.</p>
          </div>
        </motion.div>
      </motion.section>

      {/* Features Grid */}
      <motion.section 
        className="max-w-6xl mx-auto mb-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2 
          className="text-4xl font-bold text-center mb-12 text-gradient"
          variants={itemVariants}
        >
          Powerful Features
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div key={index} variants={itemVariants}>
                <GlassCard hover glow className="h-full p-6">
                  <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-cyber-cyan to-cyber-blue w-fit">
                    <Icon size={24} className="text-cyber-dark" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-cyber-cyan">{feature.title}</h3>
                  <p className="text-cyber-gray text-sm leading-relaxed">{feature.description}</p>
                </GlassCard>
              </motion.div>
            )
          })}
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section 
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <h2 className="text-4xl font-bold text-center mb-12 text-gradient">How It Works</h2>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {['Input', 'Analysis', 'Detection', 'Output'].map((step, index) => (
            <div key={index} className="flex items-center flex-1">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="w-full"
              >
                <GlassCard className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-blue mx-auto mb-4 flex items-center justify-center font-bold text-cyber-dark">
                    {index + 1}
                  </div>
                  <p className="font-semibold text-cyber-cyan">{step}</p>
                </GlassCard>
              </motion.div>
              {index < 3 && (
                <motion.div 
                  className="hidden md:block mx-4 text-cyber-cyan"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight size={24} />
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <p className="text-cyber-gray mb-6">Ready to protect yourself from digital deception?</p>
          <Link to="/analyze">
            <NeonButton size="lg" variant="primary">
              Start Analysis Now
            </NeonButton>
          </Link>
        </motion.div>
      </motion.section>
    </div>
  )
}

export default Landing
