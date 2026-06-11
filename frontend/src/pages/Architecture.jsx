import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Database, Brain, Zap, Eye, BarChart3 } from 'lucide-react'
import GlassCard from '../components/GlassCard'

/**
 * Architecture Page - Visual system architecture explanation
 */
const Architecture = () => {
  const steps = [
    {
      number: 1,
      title: 'User Input',
      description: 'Collect profile data, messages, and behavioral indicators',
      icon: Eye,
      color: 'from-cyber-cyan to-cyber-blue',
    },
    {
      number: 2,
      title: 'Feature Extraction',
      description: 'Parse and extract key characteristics from input data',
      icon: Database,
      color: 'from-cyber-blue to-cyber-purple',
    },
    {
      number: 3,
      title: 'Detection Engine',
      description: 'Apply rule-based AI logic to identify suspicious patterns',
      icon: Brain,
      color: 'from-cyber-purple to-pink-500',
    },
    {
      number: 4,
      title: 'Twin Detection',
      description: 'Analyze username similarity and impersonation indicators',
      icon: Zap,
      color: 'from-pink-500 to-orange-500',
    },
    {
      number: 5,
      title: 'Risk Scoring',
      description: 'Calculate comprehensive risk score with reasoning',
      icon: BarChart3,
      color: 'from-orange-500 to-yellow-500',
    },
    {
      number: 6,
      title: 'Explainable Output',
      description: 'Generate transparent insights and recommendations',
      icon: Eye,
      color: 'from-yellow-500 to-cyber-cyan',
    },
  ]

  const riskFactors = [
    {
      category: 'Message Analysis',
      factors: [
        'Financial urgency phrases',
        'Unbelievable offers',
        'Authority claims',
        'Pressure tactics',
        'Action requirement language',
      ]
    },
    {
      category: 'Profile Structure',
      factors: [
        'Follower/Following ratio imbalance',
        'New account age',
        'Suspicious username patterns',
        'Missing profile information',
        'Generic profile picture',
      ]
    },
    {
      category: 'Behavioral Indicators',
      factors: [
        'Rapid interaction patterns',
        'Mass following patterns',
        'Identical message templating',
        'Time zone mismatches',
        'Link sharing patterns',
      ]
    },
    {
      category: 'Content Analysis',
      factors: [
        'Crypto/investment keywords',
        'Support/official claims',
        'Help/assistance language',
        'Limited time offers',
        'Verification requests',
      ]
    },
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
    <div className="pt-24 pb-20 px-4">
      <motion.div 
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gradient mb-4">
            System Architecture
          </h1>
          <p className="text-cyber-gray text-lg">
            Understanding the VERITAS AI analysis pipeline
          </p>
        </div>

        {/* Main Pipeline */}
        <motion.section 
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-cyber-cyan">Analysis Pipeline</h2>
          
          <div className="space-y-6">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.number}
                  className="flex items-center gap-6"
                  variants={itemVariants}
                >
                  {/* Step Card */}
                  <div className="flex-shrink-0 w-full md:w-auto">
                    <GlassCard className="p-6 md:w-64">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${step.color} flex items-center justify-center mb-4`}>
                        <Icon size={24} className="text-cyber-dark" />
                      </div>
                      <h3 className="text-lg font-bold text-cyber-cyan mb-2">
                        {step.number}. {step.title}
                      </h3>
                      <p className="text-cyber-gray text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </GlassCard>
                  </div>

                  {/* Arrow */}
                  {index < steps.length - 1 && (
                    <motion.div 
                      className="hidden md:flex flex-1 items-center justify-center"
                      animate={{ x: [0, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    >
                      <ArrowRight className="text-cyber-cyan w-8 h-8" />
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* Risk Factors Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-cyber-cyan">Detection Factors</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {riskFactors.map((category, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
              >
                <GlassCard glow className="p-6 h-full">
                  <h3 className="text-lg font-bold text-cyber-cyan mb-4">
                    {category.category}
                  </h3>
                  <ul className="space-y-2">
                    {category.factors.map((factor, idx) => (
                      <motion.li
                        key={idx}
                        className="text-cyber-gray text-sm flex items-start gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + idx * 0.05 }}
                      >
                        <span className="text-cyber-cyan font-bold mt-1">•</span>
                        <span>{factor}</span>
                      </motion.li>
                    ))}
                  </ul>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* AI Algorithm Explanation */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="grid md:grid-cols-2 gap-8">
            {/* Algorithm Logic */}
            <GlassCard glow className="p-8">
              <h2 className="text-2xl font-bold text-cyber-cyan mb-6">Scoring Algorithm</h2>
              <div className="space-y-4 text-cyber-gray text-sm leading-relaxed">
                <p>
                  <span className="font-semibold text-cyber-cyan">Step 1:</span> Analyze message content for urgency phrases, financial offers, and authority claims
                </p>
                <p>
                  <span className="font-semibold text-cyber-cyan">Step 2:</span> Evaluate profile metrics including follower ratios, account age, and username patterns
                </p>
                <p>
                  <span className="font-semibold text-cyber-cyan">Step 3:</span> Detect impersonation through username similarity and structural analysis
                </p>
                <p>
                  <span className="font-semibold text-cyber-cyan">Step 4:</span> Calculate weighted risk score based on detected indicators
                </p>
                <p>
                  <span className="font-semibold text-cyber-cyan">Step 5:</span> Generate explainable output with specific reasoning for each risk factor
                </p>
              </div>
            </GlassCard>

            {/* Risk Score Formula */}
            <GlassCard className="p-8 border-cyber-purple border-opacity-30">
              <h2 className="text-2xl font-bold text-cyber-cyan mb-6">Risk Calculation</h2>
              <div className="space-y-4 bg-cyber-dark bg-opacity-50 p-6 rounded-lg font-mono text-sm text-cyber-cyan mb-6">
                <p>Risk Score = Σ (Factor Weight × Factor Value)</p>
                <p className="text-cyber-gray">where:</p>
                <p>• Message Risk: 0-40 points</p>
                <p>• Profile Risk: 0-30 points</p>
                <p>• Behavioral Risk: 0-20 points</p>
                <p>• Impersonation Risk: 0-10 points</p>
              </div>
              <p className="text-cyber-gray text-sm">
                Each factor is weighted based on historical scam patterns and success rates
              </p>
            </GlassCard>
          </div>
        </motion.section>

        {/* Technology Stack */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 pt-16 border-t border-cyber-cyan border-opacity-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-cyber-cyan">Technology Stack</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <GlassCard className="p-8">
              <h3 className="text-xl font-bold text-cyber-cyan mb-4">Frontend</h3>
              <ul className="space-y-2 text-cyber-gray text-sm">
                <li>• React.js + Vite</li>
                <li>• Tailwind CSS</li>
                <li>• Framer Motion</li>
                <li>• Recharts</li>
                <li>• Lucide Icons</li>
              </ul>
            </GlassCard>

            <GlassCard className="p-8">
              <h3 className="text-xl font-bold text-cyber-cyan mb-4">Backend</h3>
              <ul className="space-y-2 text-cyber-gray text-sm">
                <li>• Python FastAPI</li>
                <li>• Rule-based AI</li>
                <li>• NLP Processing</li>
                <li>• JSON Storage</li>
                <li>• CORS Enabled</li>
              </ul>
            </GlassCard>

            <GlassCard className="p-8">
              <h3 className="text-xl font-bold text-cyber-cyan mb-4">Features</h3>
              <ul className="space-y-2 text-cyber-gray text-sm">
                <li>• Real-time Analysis</li>
                <li>• Pattern Detection</li>
                <li>• Similarity Matching</li>
                <li>• Risk Scoring</li>
                <li>• Explainable AI</li>
              </ul>
            </GlassCard>
          </div>
        </motion.section>
      </motion.div>
    </div>
  )
}

export default Architecture
