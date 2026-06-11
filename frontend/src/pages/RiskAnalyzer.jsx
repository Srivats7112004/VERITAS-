import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Send,
  AlertCircle,
  CheckCircle,
  Info,
  Link2,
  Clipboard,
  Download,
  FileText,
  UserCheck,
} from 'lucide-react'
import GlassCard from '../components/GlassCard'
import NeonButton from '../components/NeonButton'
import RiskGauge from '../components/RiskGauge'
import { analyzeIdentity } from '../utils/api'

/**
 * Risk Analyzer Page - Main analysis tool for scanning profiles
 */
const RiskAnalyzer = () => {
  const [formData, setFormData] = useState({
    username: '',
    followers: '',
    following: '',
    bio: '',
    message: '',
  })

  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  const examples = {
    high: {
      username: '@crypto_support_official',
      followers: '50',
      following: '5000',
      bio: 'Official crypto support account. DM for investment help.',
      message:
        'Urgent! Send BTC now and double your money in 24 hours. Limited offer. Verify your account here: https://instagram-security-login.xyz/verify',
    },
    medium: {
      username: '@marketing_tips_daily',
      followers: '500',
      following: '300',
      bio: 'Digital marketing expert helping businesses grow online.',
      message:
        'Great opportunity for selected users. Limited time offer. Contact us for details. Visit http://promo-growth.click/claim',
    },
    low: {
      username: '@john_smith',
      followers: '1500',
      following: '800',
      bio: 'Software engineer | Coffee enthusiast | Tech learner',
      message:
        'Hey, I just published a new blog post about React best practices. Check it out when you are free.',
    },
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const loadExample = (type) => {
    setFormData(examples[type])
    setAnalysis(null)
    setError(null)
    setCopied(false)
  }

  const getRiskCategory = (score) => {
    if (score <= 30) return 'Low'
    if (score <= 60) return 'Medium'
    return 'High'
  }

  const formatScamType = (value) => {
    if (!value) return 'Unknown'
    return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
  }

  const formatProfileLabel = (value) => {
    if (!value) return 'Unknown'
    if (value === 'real') return 'Real-like'
    return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
  }

  const getSeverityClass = (severity) => {
    if (severity === 'High') {
      return 'bg-red-500 bg-opacity-20 text-red-300 border-red-500 border-opacity-30'
    }

    if (severity === 'Medium') {
      return 'bg-yellow-500 bg-opacity-20 text-yellow-300 border-yellow-500 border-opacity-30'
    }

    return 'bg-green-500 bg-opacity-20 text-green-300 border-green-500 border-opacity-30'
  }

  const getMLPredictionClass = (label) => {
    if (label === 'Scam') {
      return 'bg-red-500 bg-opacity-20 text-red-300 border-red-500 border-opacity-30'
    }

    if (label === 'Suspicious') {
      return 'bg-yellow-500 bg-opacity-20 text-yellow-300 border-yellow-500 border-opacity-30'
    }

    return 'bg-green-500 bg-opacity-20 text-green-300 border-green-500 border-opacity-30'
  }

  const getProfilePredictionClass = (label) => {
    if (label === 'fake') {
      return 'bg-red-500 bg-opacity-20 text-red-300 border-red-500 border-opacity-30'
    }

    if (label === 'automated') {
      return 'bg-yellow-500 bg-opacity-20 text-yellow-300 border-yellow-500 border-opacity-30'
    }

    return 'bg-green-500 bg-opacity-20 text-green-300 border-green-500 border-opacity-30'
  }

  const extractErrorMessage = (err) => {
    const detail = err.response?.data?.detail

    if (Array.isArray(detail)) {
      return detail
        .map((item) => {
          const location = item.loc?.join(' → ')
          return location ? `${location}: ${item.msg}` : item.msg
        })
        .join(', ')
    }

    if (typeof detail === 'string') {
      return detail
    }

    return (
      err.response?.data?.message ||
      err.message ||
      'Analysis failed. Please try again.'
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setAnalysis(null)
    setCopied(false)

    try {
      const response = await analyzeIdentity({
        username: formData.username.trim(),
        followers: parseInt(formData.followers, 10) || 0,
        following: parseInt(formData.following, 10) || 0,
        bio: formData.bio.trim(),
        message: formData.message.trim(),
      })

      setAnalysis(response.data)
    } catch (err) {
      setError(extractErrorMessage(err))
      console.error('Analysis error:', err)
    } finally {
      setLoading(false)
    }
  }

  const buildTrustReport = () => {
    if (!analysis) return ''

    const reportDate = new Date().toLocaleString()
    const riskCategory = analysis.category || getRiskCategory(analysis.risk_score || 0)
    const urlAnalysis = analysis.url_analysis
    const urlFindings = urlAnalysis?.findings || []
    const mlAnalysis = analysis.ml_analysis
    const profileAnalysis = analysis.profile_analysis

    const riskFactorsText =
      analysis.risk_factors && analysis.risk_factors.length > 0
        ? analysis.risk_factors.map((factor, index) => `${index + 1}. ${factor}`).join('\n')
        : 'No strong suspicious indicators detected.'

    const scoreBreakdownText =
      analysis.score_breakdown && analysis.score_breakdown.length > 0
        ? analysis.score_breakdown
            .map(
              (item, index) =>
                `${index + 1}. ${item.factor} | Weight: +${Number(item.weight || 0).toFixed(2)} | Source: ${item.source || 'Risk engine'}`
            )
            .join('\n')
        : 'No score breakdown available.'

    const urlText =
      urlFindings.length > 0
        ? urlFindings
            .map((finding, index) => {
              const indicators =
                finding.indicators && finding.indicators.length > 0
                  ? finding.indicators.map((item) => `   - ${item}`).join('\n')
                  : '   - No strong suspicious URL indicators detected.'

              return `${index + 1}. ${finding.url}
   Domain: ${finding.domain}
   URL Risk Score: ${finding.risk_score}
   Severity: ${finding.severity}
   Indicators:
${indicators}
   Recommendation: ${finding.recommendation}`
            })
            .join('\n\n')
        : 'No URLs were found in the bio or message.'

    const mlIndicatorsText =
      mlAnalysis?.indicators && mlAnalysis.indicators.length > 0
        ? mlAnalysis.indicators.map((item, index) => `${index + 1}. ${item}`).join('\n')
        : 'No ML indicators available.'

    const mlProbabilitiesText =
      mlAnalysis?.probabilities
        ? Object.entries(mlAnalysis.probabilities)
            .map(([label, probability]) => `${label}: ${Math.round(Number(probability || 0) * 100)}%`)
            .join('\n')
        : 'No ML probability distribution available.'

    const profileIndicatorsText =
      profileAnalysis?.indicators && profileAnalysis.indicators.length > 0
        ? profileAnalysis.indicators.map((item, index) => `${index + 1}. ${item}`).join('\n')
        : 'No profile ML indicators available.'

    const profileProbabilitiesText =
      profileAnalysis?.probabilities
        ? Object.entries(profileAnalysis.probabilities)
            .map(([label, probability]) => `${formatProfileLabel(label)}: ${Math.round(Number(probability || 0) * 100)}%`)
            .join('\n')
        : 'No profile probability distribution available.'

    return `VERITAS TRUST REPORT
Generated On: ${reportDate}

PROFILE DETAILS
Username: ${formData.username || 'N/A'}
Followers: ${formData.followers || '0'}
Following: ${formData.following || '0'}
Bio: ${formData.bio || 'N/A'}

MESSAGE ANALYZED
${formData.message || 'N/A'}

RISK VERDICT
Risk Score: ${Number(analysis.risk_score || 0).toFixed(1)}/100
Risk Category: ${riskCategory}
Scam Type: ${formatScamType(analysis.scam_type)}
Confidence: ${analysis.confidence || 'Low'}

NLP / ML CLASSIFIER
Prediction: ${mlAnalysis?.label || 'Not available'}
Confidence: ${Math.round((mlAnalysis?.confidence || 0) * 100)}%
ML Risk Score: ${Number(mlAnalysis?.risk_score || 0).toFixed(1)}

ML Indicators:
${mlIndicatorsText}

ML Probability Distribution:
${mlProbabilitiesText}

PROFILE ML CLASSIFIER
Prediction: ${formatProfileLabel(profileAnalysis?.label)}
Confidence: ${Math.round((profileAnalysis?.confidence || 0) * 100)}%
Profile ML Risk Score: ${Number(profileAnalysis?.risk_score || 0).toFixed(1)}

Profile ML Indicators:
${profileIndicatorsText}

Profile Probability Distribution:
${profileProbabilitiesText}

DETECTED RISK FACTORS
${riskFactorsText}

SCORE BREAKDOWN
${scoreBreakdownText}

URL ANALYSIS
URLs Found: ${urlAnalysis?.urls_found || 0}
Suspicious URLs: ${urlAnalysis?.suspicious_urls || 0}
Maximum URL Risk Score: ${urlAnalysis?.max_url_risk_score || 0}

${urlText}

AI REASONING
${analysis.explanation || 'No explanation available.'}

RECOMMENDATION
${analysis.recommendation || 'No recommendation available.'}

DISCLAIMER
This report is an advisory risk assessment generated by VERITAS. It does not prove that an account is fake or genuine. Users should verify through official and trusted channels before taking action.`
  }

  const handleCopyReport = async () => {
    const report = buildTrustReport()

    try {
      await navigator.clipboard.writeText(report)
      setCopied(true)

      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (err) {
      console.error('Copy failed:', err)
      setError('Unable to copy report. Please try again.')
    }
  }

  const handleDownloadReport = () => {
    const report = buildTrustReport()
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)

    const safeUsername = (formData.username || 'veritas-report')
      .replace('@', '')
      .replace(/[^a-zA-Z0-9-_]/g, '_')

    const link = document.createElement('a')
    link.href = url
    link.download = `VERITAS_Trust_Report_${safeUsername}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
  }

  const riskCategory = analysis?.category || getRiskCategory(analysis?.risk_score || 0)
  const urlAnalysis = analysis?.url_analysis
  const urlFindings = urlAnalysis?.findings || []
  const mlAnalysis = analysis?.ml_analysis
  const profileAnalysis = analysis?.profile_analysis

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
            Identity Risk Analyzer
          </h1>
          <p className="text-cyber-gray text-lg">
            Analyze social media profiles, messages, and suspicious links for scam indicators
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard glow className="p-8">
              <h2 className="text-2xl font-bold text-cyber-cyan mb-6">
                Enter Profile Details
              </h2>

              {/* Demo Examples */}
              <div className="mb-6">
                <p className="text-cyber-gray text-sm mb-3">
                  Quick test examples:
                </p>
                <div className="grid sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => loadExample('high')}
                    className="px-3 py-2 rounded-lg border border-red-500 border-opacity-40 text-red-300 text-xs hover:bg-red-500 hover:bg-opacity-10 transition-all"
                  >
                    High Risk
                  </button>

                  <button
                    type="button"
                    onClick={() => loadExample('medium')}
                    className="px-3 py-2 rounded-lg border border-yellow-500 border-opacity-40 text-yellow-300 text-xs hover:bg-yellow-500 hover:bg-opacity-10 transition-all"
                  >
                    Medium Risk
                  </button>

                  <button
                    type="button"
                    onClick={() => loadExample('low')}
                    className="px-3 py-2 rounded-lg border border-green-500 border-opacity-40 text-green-300 text-xs hover:bg-green-500 hover:bg-opacity-10 transition-all"
                  >
                    Low Risk
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Username */}
                <div>
                  <label className="block text-sm font-semibold text-cyber-gray mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="e.g., @official_account"
                    className="w-full px-4 py-3 bg-cyber-dark bg-opacity-50 border border-cyber-cyan border-opacity-20 rounded-lg text-white placeholder-cyber-gray focus:outline-none focus:border-cyber-cyan focus:border-opacity-50 transition-all"
                    required
                  />
                </div>

                {/* Followers and Following */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-cyber-gray mb-2">
                      Followers
                    </label>
                    <input
                      type="number"
                      name="followers"
                      min="0"
                      value={formData.followers}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full px-4 py-3 bg-cyber-dark bg-opacity-50 border border-cyber-cyan border-opacity-20 rounded-lg text-white placeholder-cyber-gray focus:outline-none focus:border-cyber-cyan focus:border-opacity-50 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-cyber-gray mb-2">
                      Following
                    </label>
                    <input
                      type="number"
                      name="following"
                      min="0"
                      value={formData.following}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full px-4 py-3 bg-cyber-dark bg-opacity-50 border border-cyber-cyan border-opacity-20 rounded-lg text-white placeholder-cyber-gray focus:outline-none focus:border-cyber-cyan focus:border-opacity-50 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-semibold text-cyber-gray mb-2">
                    Bio / Description
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Account bio or description"
                    className="w-full px-4 py-3 bg-cyber-dark bg-opacity-50 border border-cyber-cyan border-opacity-20 rounded-lg text-white placeholder-cyber-gray focus:outline-none focus:border-cyber-cyan focus:border-opacity-50 transition-all resize-none"
                    rows="3"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-cyber-gray mb-2">
                    Received Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Paste the suspicious message here. Links will also be scanned."
                    className="w-full px-4 py-3 bg-cyber-dark bg-opacity-50 border border-cyber-cyan border-opacity-20 rounded-lg text-white placeholder-cyber-gray focus:outline-none focus:border-cyber-cyan focus:border-opacity-50 transition-all resize-none"
                    rows="4"
                    required
                  />
                </div>

                {error && (
                  <motion.div
                    className="p-4 rounded-lg bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 flex items-start gap-3"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <AlertCircle
                      size={20}
                      className="text-red-400 flex-shrink-0 mt-0.5"
                    />
                    <p className="text-red-400 text-sm">{error}</p>
                  </motion.div>
                )}

                {/* Submit Button */}
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
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                        className="w-5 h-5 border-2 border-cyber-dark border-t-transparent rounded-full"
                      />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Analyze Profile
                    </>
                  )}
                </NeonButton>
              </form>
            </GlassCard>
          </motion.div>

          {/* Analysis Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {analysis ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {/* Risk Score */}
                <GlassCard glow className="p-8">
                  <h3 className="text-xl font-bold text-cyber-cyan mb-6 text-center">
                    Risk Assessment
                  </h3>

                  <div className="flex justify-center">
                    <RiskGauge
                      score={analysis.risk_score}
                      category={riskCategory}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="p-4 rounded-lg bg-cyber-dark bg-opacity-40 border border-cyber-cyan border-opacity-20">
                      <p className="text-cyber-gray text-xs mb-1">
                        Scam Type
                      </p>
                      <p className="text-cyber-cyan font-semibold text-sm">
                        {formatScamType(analysis.scam_type)}
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-cyber-dark bg-opacity-40 border border-cyber-cyan border-opacity-20">
                      <p className="text-cyber-gray text-xs mb-1">
                        Confidence
                      </p>
                      <p className="text-cyber-cyan font-semibold text-sm">
                        {analysis.confidence || 'Low'}
                      </p>
                    </div>
                  </div>
                </GlassCard>

                {/* Trust Report Export */}
                <GlassCard className="p-6 border-cyber-purple border-opacity-30">
                  <h3 className="text-lg font-bold text-cyber-cyan mb-4 flex items-center gap-2">
                    <FileText size={20} />
                    Trust Report Export
                  </h3>

                  <p className="text-cyber-gray text-sm leading-relaxed mb-4">
                    Generate a complete VERITAS trust report containing the risk score,
                    scam type, confidence level, risk factors, URL findings, ML results,
                    AI reasoning, and recommended action.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={handleCopyReport}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-cyber-cyan border-opacity-40 text-cyber-cyan hover:bg-cyber-cyan hover:bg-opacity-10 transition-all"
                    >
                      <Clipboard size={18} />
                      {copied ? 'Copied!' : 'Copy Report'}
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadReport}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-cyber-cyan border-opacity-40 text-cyber-cyan hover:bg-cyber-cyan hover:bg-opacity-10 transition-all"
                    >
                      <Download size={18} />
                      Download Report
                    </button>
                  </div>
                </GlassCard>

                {/* URL Scanner */}
                {urlAnalysis && (
                  <GlassCard className="p-6">
                    <h3 className="text-lg font-bold text-cyber-cyan mb-4 flex items-center gap-2">
                      <Link2 size={20} />
                      URL Scanner
                    </h3>

                    <div className="grid grid-cols-3 gap-3 mb-5">
                      <div className="p-3 rounded-lg bg-cyber-dark bg-opacity-40 border border-cyber-cyan border-opacity-20">
                        <p className="text-cyber-gray text-xs mb-1">URLs Found</p>
                        <p className="text-cyber-cyan font-bold text-xl">
                          {urlAnalysis.urls_found || 0}
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-cyber-dark bg-opacity-40 border border-cyber-cyan border-opacity-20">
                        <p className="text-cyber-gray text-xs mb-1">Suspicious</p>
                        <p className="text-cyber-cyan font-bold text-xl">
                          {urlAnalysis.suspicious_urls || 0}
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-cyber-dark bg-opacity-40 border border-cyber-cyan border-opacity-20">
                        <p className="text-cyber-gray text-xs mb-1">Max URL Risk</p>
                        <p className="text-cyber-cyan font-bold text-xl">
                          {Number(urlAnalysis.max_url_risk_score || 0).toFixed(0)}
                        </p>
                      </div>
                    </div>

                    {urlFindings.length > 0 ? (
                      <div className="space-y-4">
                        {urlFindings.map((finding, index) => (
                          <motion.div
                            key={`${finding.url}-${index}`}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.08 }}
                            className="p-4 rounded-lg bg-cyber-dark bg-opacity-40 border border-cyber-cyan border-opacity-20"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                              <div>
                                <p className="text-cyber-cyan font-semibold text-sm break-all">
                                  {finding.domain}
                                </p>
                                <p className="text-cyber-gray text-xs break-all mt-1">
                                  {finding.url}
                                </p>
                              </div>

                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${getSeverityClass(finding.severity)}`}
                              >
                                {finding.severity} URL Risk
                              </span>
                            </div>

                            <div className="space-y-2">
                              {finding.indicators?.map((indicator, indicatorIndex) => (
                                <div
                                  key={indicatorIndex}
                                  className="flex items-start gap-2"
                                >
                                  <AlertCircle
                                    size={14}
                                    className="text-cyber-cyan flex-shrink-0 mt-0.5"
                                  />
                                  <p className="text-cyber-gray text-xs">
                                    {indicator}
                                  </p>
                                </div>
                              ))}
                            </div>

                            <p className="text-cyber-gray text-xs mt-3 leading-relaxed">
                              Recommendation: {finding.recommendation}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-cyber-gray text-sm">
                        No URLs were found in the bio or message.
                      </p>
                    )}
                  </GlassCard>
                )}

                {/* ML Classifier */}
                {mlAnalysis && (
                  <GlassCard className="p-6">
                    <h3 className="text-lg font-bold text-cyber-cyan mb-4 flex items-center gap-2">
                      <Info size={20} />
                      NLP / ML Classifier
                    </h3>

                    <div className="grid grid-cols-3 gap-3 mb-5">
                      <div className="p-3 rounded-lg bg-cyber-dark bg-opacity-40 border border-cyber-cyan border-opacity-20">
                        <p className="text-cyber-gray text-xs mb-1">Prediction</p>
                        <p className="text-cyber-cyan font-bold text-lg">
                          {mlAnalysis.label}
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-cyber-dark bg-opacity-40 border border-cyber-cyan border-opacity-20">
                        <p className="text-cyber-gray text-xs mb-1">Confidence</p>
                        <p className="text-cyber-cyan font-bold text-lg">
                          {Math.round((mlAnalysis.confidence || 0) * 100)}%
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-cyber-dark bg-opacity-40 border border-cyber-cyan border-opacity-20">
                        <p className="text-cyber-gray text-xs mb-1">ML Risk</p>
                        <p className="text-cyber-cyan font-bold text-lg">
                          {Number(mlAnalysis.risk_score || 0).toFixed(0)}
                        </p>
                      </div>
                    </div>

                    <div className="mb-5">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getMLPredictionClass(mlAnalysis.label)}`}
                      >
                        {mlAnalysis.label} Prediction
                      </span>
                    </div>

                    <div className="space-y-2 mb-5">
                      {mlAnalysis.indicators?.map((indicator, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle
                            size={15}
                            className="text-cyber-cyan flex-shrink-0 mt-0.5"
                          />
                          <p className="text-cyber-gray text-sm">{indicator}</p>
                        </div>
                      ))}
                    </div>

                    {mlAnalysis.probabilities && (
                      <div className="space-y-3">
                        {Object.entries(mlAnalysis.probabilities).map(([label, probability]) => (
                          <div key={label}>
                            <div className="flex justify-between mb-1">
                              <span className="text-cyber-gray text-xs">{label}</span>
                              <span className="text-cyber-cyan text-xs font-semibold">
                                {Math.round(Number(probability || 0) * 100)}%
                              </span>
                            </div>

                            <div className="w-full h-2 rounded-full bg-cyber-dark overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-blue rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.round(Number(probability || 0) * 100)}%` }}
                                transition={{ duration: 0.8 }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </GlassCard>
                )}

                {/* Profile ML Classifier */}
                {profileAnalysis && (
                  <GlassCard className="p-6">
                    <h3 className="text-lg font-bold text-cyber-cyan mb-4 flex items-center gap-2">
                      <UserCheck size={20} />
                      Profile ML Classifier
                    </h3>

                    <div className="grid grid-cols-3 gap-3 mb-5">
                      <div className="p-3 rounded-lg bg-cyber-dark bg-opacity-40 border border-cyber-cyan border-opacity-20">
                        <p className="text-cyber-gray text-xs mb-1">Prediction</p>
                        <p className="text-cyber-cyan font-bold text-lg">
                          {formatProfileLabel(profileAnalysis.label)}
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-cyber-dark bg-opacity-40 border border-cyber-cyan border-opacity-20">
                        <p className="text-cyber-gray text-xs mb-1">Confidence</p>
                        <p className="text-cyber-cyan font-bold text-lg">
                          {Math.round((profileAnalysis.confidence || 0) * 100)}%
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-cyber-dark bg-opacity-40 border border-cyber-cyan border-opacity-20">
                        <p className="text-cyber-gray text-xs mb-1">Profile Risk</p>
                        <p className="text-cyber-cyan font-bold text-lg">
                          {Number(profileAnalysis.risk_score || 0).toFixed(0)}
                        </p>
                      </div>
                    </div>

                    <div className="mb-5">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getProfilePredictionClass(profileAnalysis.label)}`}
                      >
                        {formatProfileLabel(profileAnalysis.label)} Prediction
                      </span>
                    </div>

                    <div className="space-y-2 mb-5">
                      {profileAnalysis.indicators?.map((indicator, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle
                            size={15}
                            className="text-cyber-cyan flex-shrink-0 mt-0.5"
                          />
                          <p className="text-cyber-gray text-sm">{indicator}</p>
                        </div>
                      ))}
                    </div>

                    {profileAnalysis.probabilities && (
                      <div className="space-y-3">
                        {Object.entries(profileAnalysis.probabilities).map(([label, probability]) => (
                          <div key={label}>
                            <div className="flex justify-between mb-1">
                              <span className="text-cyber-gray text-xs">
                                {formatProfileLabel(label)}
                              </span>
                              <span className="text-cyber-cyan text-xs font-semibold">
                                {Math.round(Number(probability || 0) * 100)}%
                              </span>
                            </div>

                            <div className="w-full h-2 rounded-full bg-cyber-dark overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-blue rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.round(Number(probability || 0) * 100)}%` }}
                                transition={{ duration: 0.8 }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </GlassCard>
                )}

                {/* Risk Factors */}
                <GlassCard className="p-6">
                  <h3 className="text-lg font-bold text-cyber-cyan mb-4 flex items-center gap-2">
                    <AlertCircle size={20} />
                    Detected Risk Factors
                  </h3>

                  <div className="space-y-3">
                    {analysis.risk_factors && analysis.risk_factors.length > 0 ? (
                      analysis.risk_factors.map((factor, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-3 rounded-lg bg-cyber-cyan bg-opacity-5 border border-cyber-cyan border-opacity-20 flex items-start gap-3"
                        >
                          <CheckCircle
                            size={16}
                            className="text-cyber-cyan flex-shrink-0 mt-0.5"
                          />
                          <span className="text-cyber-gray text-sm">
                            {factor}
                          </span>
                        </motion.div>
                      ))
                    ) : (
                      <div className="p-3 rounded-lg bg-green-500 bg-opacity-5 border border-green-500 border-opacity-20 flex items-start gap-3">
                        <CheckCircle
                          size={16}
                          className="text-green-400 flex-shrink-0 mt-0.5"
                        />
                        <span className="text-cyber-gray text-sm">
                          No strong suspicious indicators detected.
                        </span>
                      </div>
                    )}
                  </div>
                </GlassCard>

                {/* Score Breakdown */}
                {analysis.score_breakdown &&
                  analysis.score_breakdown.length > 0 && (
                    <GlassCard className="p-6">
                      <h3 className="text-lg font-bold text-cyber-cyan mb-4 flex items-center gap-2">
                        <Info size={20} />
                        Score Breakdown
                      </h3>

                      <div className="space-y-3">
                        {analysis.score_breakdown.map((item, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.08 }}
                            className="p-3 rounded-lg bg-cyber-dark bg-opacity-40 border border-cyber-cyan border-opacity-20"
                          >
                            <div className="flex justify-between gap-4 mb-1">
                              <span className="text-cyber-gray text-sm">
                                {item.factor}
                              </span>

                              <span className="text-cyber-cyan font-bold text-sm whitespace-nowrap">
                                +{Number(item.weight || 0).toFixed(2)}
                              </span>
                            </div>

                            <p className="text-xs text-cyber-gray opacity-70">
                              Source: {item.source || 'Risk engine'}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </GlassCard>
                  )}

                {/* Explanation */}
                <GlassCard className="p-6">
                  <h3 className="text-lg font-bold text-cyber-cyan mb-4">
                    AI Reasoning
                  </h3>
                  <p className="text-cyber-gray leading-relaxed text-sm">
                    {analysis.explanation}
                  </p>
                </GlassCard>

                {/* Recommendation */}
                <GlassCard className="p-6" glow={analysis.risk_score > 60}>
                  <h3 className="text-lg font-bold text-cyber-cyan mb-3">
                    Recommendation
                  </h3>
                  <p className="text-cyber-gray text-sm">
                    {analysis.recommendation}
                  </p>
                </GlassCard>
              </motion.div>
            ) : (
              <GlassCard className="p-8 h-full flex items-center justify-center text-center">
                <div>
                  <p className="text-cyber-gray text-lg mb-2">
                    Enter profile details to see risk analysis
                  </p>
                  <p className="text-cyber-gray text-sm opacity-70">
                    Use the quick examples to test profile, message, URL risk detection,
                    NLP classification, profile ML classification, and trust report export.
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

export default RiskAnalyzer