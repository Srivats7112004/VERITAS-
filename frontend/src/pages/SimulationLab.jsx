import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import NeonButton from '../components/NeonButton'
import { getSimulationScenarios, submitSimulationResponse } from '../utils/api'

/**
 * Social Engineering Simulation Lab - Interactive training scenarios
 */
const SimulationLab = () => {
  const [scenarios, setScenarios] = useState([])
  const [selectedScenario, setSelectedScenario] = useState(null)
  const [userResponse, setUserResponse] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadScenarios = async () => {
      try {
        const response = await getSimulationScenarios()
        setScenarios(response.data.scenarios || [])
      } catch (err) {
        console.error('Failed to load scenarios:', err)
        // Fallback scenarios
        setScenarios([
          {
            id: 1,
            title: 'Crypto Doubling Scam',
            type: 'financial',
            scenario: 'You receive a DM from an account claiming to be a crypto analyst. They say: "Send 1 BTC, I\'ll double it and return 2 BTC. Limited offer - 24 hours only!"',
            correct_response: 'Ignore',
            manipulation_tactics: [
              'Scarcity - Limited time offer',
              'Urgency - 24 hour deadline',
              'Easy profit - Unrealistic returns',
              'Authority impersonation'
            ]
          },
          {
            id: 2,
            title: 'Fake Instagram Support',
            type: 'account_security',
            scenario: 'An account with name "Instagram Support" follows you and sends: "Your account has suspicious activity. Click here to verify: [suspicious-link.com]. Act now to secure your account."',
            correct_response: 'Verify',
            manipulation_tactics: [
              'Urgency - Account security threat',
              'Impersonation - Fake official account',
              'Authority exploitation',
              'Social engineering'
            ]
          },
          {
            id: 3,
            title: 'Fake Job Recruiter',
            type: 'employment',
            scenario: 'A profile named "Global Recruitment Agency" messages: "Congratulations! You\'re selected for a remote position. Salary: $5000/month. Send resume and $500 processing fee to confirm."',
            correct_response: 'Ignore',
            manipulation_tactics: [
              'Too-good-to-be-true offer',
              'Upfront payment requirement',
              'Urgency - Limited spots',
              'Authority impersonation'
            ]
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    loadScenarios()
  }, [])

  const handleResponse = async (response) => {
    if (!selectedScenario) return

    setUserResponse(response)
    
    try {
      const feedbackResponse = await submitSimulationResponse(selectedScenario.id, response)
      setFeedback(feedbackResponse.data)
    } catch (err) {
      console.error('Failed to submit response:', err)
      // Fallback feedback
      const isCorrect = response === selectedScenario.correct_response
      setFeedback({
        is_correct: isCorrect,
        your_response: response,
        correct_response: selectedScenario.correct_response,
        explanation: isCorrect ? 'Great judgment! You avoided the scam.' : 'This was a scam attempt. You should have chosen a different action.',
        tactics_used: selectedScenario.manipulation_tactics
      })
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
            Social Engineering Simulation Lab
          </h1>
          <p className="text-cyber-gray text-lg">
            Train yourself to recognize and respond to scam attempts
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Scenario List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <GlassCard glow className="p-6">
              <h2 className="text-xl font-bold text-cyber-cyan mb-4">Available Scenarios</h2>
              <div className="space-y-3">
                {loading ? (
                  <p className="text-cyber-gray text-sm">Loading scenarios...</p>
                ) : (
                  scenarios.map((scenario) => (
                    <motion.button
                      key={scenario.id}
                      onClick={() => {
                        setSelectedScenario(scenario)
                        setUserResponse(null)
                        setFeedback(null)
                      }}
                      className={`w-full p-4 rounded-lg text-left transition-all ${
                        selectedScenario?.id === scenario.id
                          ? 'bg-cyber-cyan bg-opacity-20 border border-cyber-cyan'
                          : 'bg-cyber-dark bg-opacity-30 border border-cyber-cyan border-opacity-20 hover:border-cyber-cyan hover:border-opacity-50'
                      }`}
                      whileHover={{ x: 5 }}
                    >
                      <p className="font-semibold text-sm text-cyber-cyan">{scenario.title}</p>
                      <p className="text-xs text-cyber-gray mt-1 capitalize">{scenario.type.replace('_', ' ')}</p>
                    </motion.button>
                  ))
                )}
              </div>
            </GlassCard>
          </motion.div>

          {/* Scenario Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            {selectedScenario ? (
              <>
                {/* Scenario Card */}
                <GlassCard glow className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <MessageCircle className="text-cyber-cyan flex-shrink-0" size={32} />
                    <div>
                      <h2 className="text-3xl font-bold text-gradient mb-2">{selectedScenario.title}</h2>
                      <p className="text-cyber-gray capitalize">{selectedScenario.type.replace('_', ' ')} Scam</p>
                    </div>
                  </div>

                  {/* Message Bubble */}
                  <div className="bg-cyber-dark bg-opacity-50 border border-cyber-cyan border-opacity-20 rounded-lg p-6 mb-8">
                    <p className="text-white leading-relaxed italic">
                      "{selectedScenario.scenario}"
                    </p>
                  </div>

                  {/* Response Options */}
                  {!feedback && (
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-cyber-gray mb-4">How would you respond?</p>
                      <div className="grid grid-cols-3 gap-3">
                        <NeonButton
                          onClick={() => handleResponse('Trust')}
                          variant="outline"
                          fullWidth
                          className="text-sm"
                        >
                          Trust
                        </NeonButton>
                        <NeonButton
                          onClick={() => handleResponse('Verify')}
                          variant="secondary"
                          fullWidth
                          className="text-sm"
                        >
                          Verify
                        </NeonButton>
                        <NeonButton
                          onClick={() => handleResponse('Ignore')}
                          variant="primary"
                          fullWidth
                          className="text-sm"
                        >
                          Ignore
                        </NeonButton>
                      </div>
                    </div>
                  )}
                </GlassCard>

                {/* Feedback */}
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    {/* Result */}
                    <GlassCard 
                      className={`p-8 border ${feedback.is_correct ? 'border-green-500 border-opacity-30' : 'border-red-500 border-opacity-30'}`}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        {feedback.is_correct ? (
                          <CheckCircle className="text-green-400" size={40} />
                        ) : (
                          <XCircle className="text-red-400" size={40} />
                        )}
                        <h3 className={`text-2xl font-bold ${feedback.is_correct ? 'text-green-400' : 'text-red-400'}`}>
                          {feedback.is_correct ? 'Correct!' : 'Incorrect'}
                        </h3>
                      </div>
                      <p className="text-cyber-gray">
                        <span className="font-semibold text-cyber-cyan">Your response: </span>
                        {feedback.your_response}
                        {feedback.your_response !== feedback.correct_response && (
                          <>
                            <br />
                            <span className="font-semibold text-cyber-cyan">Correct response: </span>
                            {feedback.correct_response}
                          </>
                        )}
                      </p>
                    </GlassCard>

                    {/* Explanation */}
                    <GlassCard className="p-6">
                      <h4 className="text-lg font-bold text-cyber-cyan mb-3">Explanation</h4>
                      <p className="text-cyber-gray leading-relaxed text-sm">
                        {feedback.explanation}
                      </p>
                    </GlassCard>

                    {/* Tactics Used */}
                    <GlassCard className="p-6 border-orange-500 border-opacity-30">
                      <h4 className="text-lg font-bold text-orange-400 mb-4 flex items-center gap-2">
                        <AlertCircle size={20} />
                        Manipulation Tactics Used
                      </h4>
                      <div className="space-y-2">
                        {feedback.tactics_used?.map((tactic, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-3 rounded-lg bg-orange-500 bg-opacity-5 border border-orange-500 border-opacity-20"
                          >
                            <p className="text-orange-400 text-sm font-semibold">{tactic}</p>
                          </motion.div>
                        ))}
                      </div>
                    </GlassCard>

                    {/* Next Button */}
                    <NeonButton
                      onClick={() => {
                        setUserResponse(null)
                        setFeedback(null)
                      }}
                      fullWidth
                      size="lg"
                      variant="secondary"
                    >
                      Try Another Scenario
                    </NeonButton>
                  </motion.div>
                )}
              </>
            ) : (
              <GlassCard className="p-12 text-center">
                <p className="text-cyber-gray text-lg">
                  Select a scenario from the list to begin the simulation
                </p>
              </GlassCard>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default SimulationLab
