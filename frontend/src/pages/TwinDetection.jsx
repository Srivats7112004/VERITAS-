import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, AlertTriangle } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import NeonButton from '../components/NeonButton'
import { detectTwin } from '../utils/api'

/**
 * Twin Detection Engine - Detects impersonation and duplicate accounts
 */
const TwinDetection = () => {
  const [realUsername, setRealUsername] = useState('')
  const [suspiciousUsername, setSuspiciousUsername] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleDetect = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await detectTwin({
        legitimate_username: realUsername,
        suspicious_username: suspiciousUsername,
      })
      setResult(response.data)
    } catch (err) {
      console.error('Twin detection error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-24 pb-20 px-4">
      <motion.div 
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gradient mb-4">
            Identity Twin Detection
          </h1>
          <p className="text-cyber-gray text-lg">
            Detect impersonation attempts and identify duplicate fake accounts
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard glow className="p-8">
              <h2 className="text-2xl font-bold text-cyber-cyan mb-6">Compare Identities</h2>
              
              <form onSubmit={handleDetect} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-cyber-gray mb-2">
                    Legitimate Username
                  </label>
                  <input
                    type="text"
                    value={realUsername}
                    onChange={(e) => setRealUsername(e.target.value)}
                    placeholder="Official account username"
                    className="w-full px-4 py-3 bg-cyber-dark bg-opacity-50 border border-cyber-cyan border-opacity-20 rounded-lg text-white placeholder-cyber-gray focus:outline-none focus:border-cyber-cyan focus:border-opacity-50 transition-all"
                    required
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-cyber-cyan border-opacity-20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gradient-cyber text-cyber-cyan">vs</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-cyber-gray mb-2">
                    Suspicious Username
                  </label>
                  <input
                    type="text"
                    value={suspiciousUsername}
                    onChange={(e) => setSuspiciousUsername(e.target.value)}
                    placeholder="Potentially fake account"
                    className="w-full px-4 py-3 bg-cyber-dark bg-opacity-50 border border-cyber-cyan border-opacity-20 rounded-lg text-white placeholder-cyber-gray focus:outline-none focus:border-cyber-cyan focus:border-opacity-50 transition-all"
                    required
                  />
                </div>

                <NeonButton
                  type="submit"
                  fullWidth
                  size="lg"
                  disabled={loading}
                  className="gap-2 mt-6"
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-5 h-5 border-2 border-cyber-dark border-t-transparent rounded-full"
                      />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Compare & Detect
                    </>
                  )}
                </NeonButton>
              </form>
            </GlassCard>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {result ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {/* Detection Result */}
                <GlassCard 
                  glow={result.is_impersonation}
                  className={`p-8 ${result.is_impersonation ? 'border-red-500 border-opacity-30' : 'border-green-500 border-opacity-30'}`}
                >
                  <div className="flex items-start gap-4 mb-6">
                    {result.is_impersonation ? (
                      <AlertTriangle className="text-red-400 flex-shrink-0" size={32} />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                        ✓
                      </div>
                    )}
                    <div>
                      <h3 className={`text-2xl font-bold mb-2 ${result.is_impersonation ? 'text-red-400' : 'text-green-400'}`}>
                        {result.is_impersonation ? 'Impersonation Detected' : 'No Impersonation Found'}
                      </h3>
                      <p className="text-cyber-gray">
                        Similarity: <span className="text-cyber-cyan font-semibold">{Math.round(result.similarity_score * 100)}%</span>
                      </p>
                    </div>
                  </div>
                </GlassCard>

                {/* Similarity Analysis */}
                <GlassCard className="p-6">
                  <h3 className="text-lg font-bold text-cyber-cyan mb-4">Similarity Analysis</h3>
                  
                  {/* Similarity Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-cyber-gray">Match Level</span>
                      <span className="font-semibold text-cyber-cyan">{Math.round(result.similarity_score * 100)}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-cyber-dark relative overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${result.similarity_score * 100}%` }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                      />
                    </div>
                  </div>

                  {/* Matching Patterns */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-cyber-gray text-sm">Matching Patterns:</h4>
                    {result.matching_patterns?.map((pattern, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-3 rounded-lg bg-cyber-cyan bg-opacity-5 border border-cyber-cyan border-opacity-20"
                      >
                        <p className="text-cyber-gray text-sm">{pattern}</p>
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>

                {/* Suspicious Indicators */}
                {result.suspicious_indicators && result.suspicious_indicators.length > 0 && (
                  <GlassCard className="p-6 border-red-500 border-opacity-30">
                    <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
                      <AlertTriangle size={20} />
                      Suspicious Indicators
                    </h3>
                    <div className="space-y-2">
                      {result.suspicious_indicators.map((indicator, index) => (
                        <p key={index} className="text-red-400 text-sm">• {indicator}</p>
                      ))}
                    </div>
                  </GlassCard>
                )}

                {/* Recommendation */}
                <GlassCard className="p-6">
                  <h3 className="text-lg font-bold text-cyber-cyan mb-3">Recommendation</h3>
                  <p className="text-cyber-gray text-sm leading-relaxed">
                    {result.recommendation}
                  </p>
                </GlassCard>
              </motion.div>
            ) : (
              <GlassCard className="p-8 h-full flex items-center justify-center text-center">
                <div>
                  <p className="text-cyber-gray text-lg">
                    Enter two usernames to compare and detect impersonation
                  </p>
                </div>
              </GlassCard>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default TwinDetection
