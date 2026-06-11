import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ShieldCheck,
  BrainCircuit,
  Link2,
  Network,
  BarChart3,
  FileText,
  ArrowRight,
  Sparkles,
  Radar,
  LockKeyhole,
  Database,
  Activity,
  Eye,
  Cpu,
  CheckCircle,
  Zap,
  ScanLine,
  Fingerprint,
  AlertTriangle,
  Globe2,
  Bot,
  Layers,
} from 'lucide-react'
import GlassCard from '../components/GlassCard'

const Home = () => {
  const capabilities = [
    {
      icon: BrainCircuit,
      title: 'Message Intelligence',
      description:
        'Uses NLP and ML to detect scam-like language, urgency, impersonation, and persuasion patterns.',
    },
    {
      icon: Fingerprint,
      title: 'Profile Risk Detection',
      description:
        'Analyzes follower ratio, username structure, bio length, and account metadata to detect fake profiles.',
    },
    {
      icon: Link2,
      title: 'Phishing URL Scanner',
      description:
        'Flags suspicious links, risky domains, fake login pages, shortened URLs, and brand impersonation.',
    },
    {
      icon: Network,
      title: 'Deception Graph',
      description:
        'Visualizes accounts, scam types, domains, and tactics as a connected intelligence network.',
    },
  ]

  const workflow = [
    {
      step: '01',
      title: 'Profile Input',
      text: 'Enter username, followers, following count, bio, and received message.',
    },
    {
      step: '02',
      title: 'Signal Extraction',
      text: 'VERITAS scans message language, URL risk, account metadata, and behavior patterns.',
    },
    {
      step: '03',
      title: 'AI Risk Scoring',
      text: 'The system combines rules, URL scanning, profile ML, and message ML into a final trust score.',
    },
    {
      step: '04',
      title: 'Explainable Report',
      text: 'Get scam type, confidence, score breakdown, AI reasoning, and safety recommendation.',
    },
  ]

  const stackItems = [
    'Rule-based risk engine',
    'NLP message classifier',
    'Profile metadata classifier',
    'Suspicious URL scanner',
    'Similarity-based threat matching',
    'Downloadable trust report',
  ]

  const floatingCards = [
    {
      icon: AlertTriangle,
      title: 'Scam Signal',
      value: 'OTP request detected',
      delay: 0.1,
    },
    {
      icon: Link2,
      title: 'URL Risk',
      value: 'Fake login domain',
      delay: 0.25,
    },
    {
      icon: Bot,
      title: 'Profile ML',
      value: 'Fake-like metadata',
      delay: 0.4,
    },
  ]

  const stats = [
    {
      value: '93.4%',
      label: 'Profile Model Accuracy',
      icon: BarChart3,
    },
    {
      value: '4',
      label: 'Detection Layers',
      icon: Layers,
    },
    {
      value: '0–100',
      label: 'Trust Score',
      icon: Activity,
    },
  ]

  return (
    <div className="pt-24 pb-20 px-4 overflow-hidden relative">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-24 left-10 w-80 h-80 rounded-full bg-cyber-cyan opacity-10 blur-3xl"
          animate={{
            x: [0, 35, 0],
            y: [0, -25, 0],
            scale: [1, 1.18, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          className="absolute bottom-24 right-10 w-[32rem] h-[32rem] rounded-full bg-cyber-purple opacity-10 blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 30, 0],
            scale: [1.1, 1, 1.1],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full bg-cyber-blue opacity-5 blur-3xl"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.25, 1],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* HERO */}
        <section className="min-h-[82vh] flex items-center">
          <div className="grid lg:grid-cols-2 gap-14 items-center w-full">
            {/* Left Hero */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75 }}
            >
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyber-cyan border-opacity-30 bg-cyber-cyan bg-opacity-5 text-cyber-cyan text-sm mb-6"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles size={16} />
                AI-powered digital trust intelligence
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                <motion.span
                  className="text-gradient block"
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  VERITAS
                </motion.span>

                <motion.span
                  className="text-white block"
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  Identity Truth Engine
                </motion.span>
              </h1>

              <motion.p
                className="text-cyber-gray text-lg md:text-xl leading-relaxed max-w-2xl mb-8"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                Detect fake profiles, scam messages, phishing links, impersonation
                attempts, and social engineering risks using a multi-layer AI trust
                scoring system.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 mb-10"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
              >
                <Link
                  to="/analyze"
                  className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-cyber-cyan text-cyber-dark font-bold hover:shadow-[0_0_35px_rgba(34,211,238,0.45)] transition-all"
                >
                  Start Risk Analysis
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>

                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl border border-cyber-cyan border-opacity-40 text-cyber-cyan hover:bg-cyber-cyan hover:bg-opacity-10 transition-all"
                >
                  View Intelligence Dashboard
                  <BarChart3 size={20} />
                </Link>
              </motion.div>

              <motion.div
                className="grid sm:grid-cols-3 gap-4"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
              >
                {stats.map((item, index) => {
                  const Icon = item.icon

                  return (
                    <motion.div
                      key={item.label}
                      whileHover={{ y: -6, scale: 1.02 }}
                      transition={{ type: 'spring', stiffness: 220, damping: 15 }}
                      className="p-4 rounded-xl bg-cyber-dark bg-opacity-50 border border-cyber-cyan border-opacity-20"
                    >
                      <Icon size={20} className="text-cyber-cyan mb-3" />
                      <p className="text-2xl font-bold text-cyber-cyan">
                        {item.value}
                      </p>
                      <p className="text-cyber-gray text-sm mt-1">{item.label}</p>
                    </motion.div>
                  )
                })}
              </motion.div>
            </motion.div>

            {/* Right Hero Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="relative"
            >
              <motion.div
                className="absolute -top-8 -right-4 w-28 h-28 rounded-full border border-cyber-cyan border-opacity-30"
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              />

              <motion.div
                className="absolute -bottom-8 -left-4 w-36 h-36 rounded-full border border-cyber-purple border-opacity-30"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              />

              <GlassCard glow className="p-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="w-full h-full bg-gradient-to-br from-cyber-cyan via-transparent to-cyber-purple" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-cyber-gray text-sm">Live Intelligence Scan</p>
                      <h3 className="text-2xl font-bold text-cyber-cyan">
                        Threat Assessment
                      </h3>
                    </div>

                    <motion.div
                      className="w-16 h-16 rounded-full border border-cyber-cyan border-opacity-40 flex items-center justify-center bg-cyber-dark bg-opacity-40"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    >
                      <Radar className="text-cyber-cyan" size={30} />
                    </motion.div>
                  </div>

                  <div className="relative h-80 rounded-2xl bg-cyber-dark bg-opacity-50 border border-cyber-cyan border-opacity-20 overflow-hidden mb-5">
                    <motion.div
                      className="absolute left-0 right-0 h-1 bg-cyber-cyan shadow-[0_0_25px_rgba(34,211,238,0.8)]"
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        className="w-52 h-52 rounded-full border border-cyber-cyan border-opacity-20 flex items-center justify-center"
                        animate={{ scale: [1, 1.08, 1] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                      >
                        <motion.div
                          className="w-36 h-36 rounded-full border border-cyber-purple border-opacity-30 flex items-center justify-center"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                        >
                          <ShieldCheck size={56} className="text-cyber-cyan" />
                        </motion.div>
                      </motion.div>
                    </div>

                    {floatingCards.map((item, index) => {
                      const Icon = item.icon

                      const positions = [
                        'top-6 left-6',
                        'top-28 right-6',
                        'bottom-8 left-10',
                      ]

                      return (
                        <motion.div
                          key={item.title}
                          className={`absolute ${positions[index]} p-3 rounded-xl bg-cyber-dark bg-opacity-80 border border-cyber-cyan border-opacity-25 backdrop-blur-md w-48`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{
                            opacity: 1,
                            y: [0, -8, 0],
                          }}
                          transition={{
                            opacity: { delay: item.delay, duration: 0.5 },
                            y: {
                              delay: item.delay,
                              duration: 3,
                              repeat: Infinity,
                              ease: 'easeInOut',
                            },
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <Icon size={18} className="text-cyber-cyan mt-0.5" />
                            <div>
                              <p className="text-white text-xs font-bold">
                                {item.title}
                              </p>
                              <p className="text-cyber-gray text-xs mt-1">
                                {item.value}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>

                  <div className="p-5 rounded-xl bg-cyber-dark bg-opacity-50 border border-red-500 border-opacity-30">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-cyber-gray text-xs">Final Risk Verdict</p>
                        <p className="text-white font-bold">High Risk Identity</p>
                      </div>

                      <p className="text-red-400 text-3xl font-bold">96</p>
                    </div>

                    <div className="w-full h-3 rounded-full bg-cyber-dark overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-red-500"
                        initial={{ width: 0 }}
                        animate={{ width: '96%' }}
                        transition={{ duration: 1.3, delay: 0.6 }}
                      />
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        {/* CAPABILITIES */}
        <section className="py-20">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-cyber-cyan font-semibold mb-3">
              TRUST INTELLIGENCE LAYERS
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-5">
              Not Just Detection. Evidence.
            </h2>
            <p className="text-cyber-gray text-lg max-w-3xl mx-auto">
              VERITAS explains why something is risky instead of only giving a
              black-box prediction.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {capabilities.map((item, index) => {
              const Icon = item.icon

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ y: -10 }}
                >
                  <GlassCard className="p-6 h-full group hover:border-cyber-cyan hover:border-opacity-50 transition-all">
                    <motion.div
                      className="w-14 h-14 rounded-2xl bg-cyber-cyan bg-opacity-10 border border-cyber-cyan border-opacity-30 flex items-center justify-center mb-5"
                      whileHover={{ rotate: 8, scale: 1.08 }}
                    >
                      <Icon size={26} className="text-cyber-cyan" />
                    </motion.div>

                    <h3 className="text-white text-lg font-bold mb-3">
                      {item.title}
                    </h3>
                    <p className="text-cyber-gray text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </GlassCard>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* WORKFLOW */}
        <section className="py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-cyber-cyan font-semibold mb-3">
                HOW VERITAS WORKS
              </p>

              <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-5">
                From Suspicious DM to Trust Report
              </h2>

              <p className="text-cyber-gray text-lg leading-relaxed mb-8">
                The system checks every major digital risk layer: who the account
                claims to be, how the profile behaves, what the message asks for,
                and whether the links are dangerous.
              </p>

              <Link
                to="/analyze"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cyber-cyan text-cyber-dark font-bold hover:shadow-[0_0_30px_rgba(34,211,238,0.45)] transition-all"
              >
                Run a Live Scan
                <ScanLine size={18} />
              </Link>
            </motion.div>

            <div className="space-y-4">
              {workflow.map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: 28 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 8 }}
                >
                  <GlassCard className="p-5">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-cyber-cyan bg-opacity-10 border border-cyber-cyan border-opacity-30 flex items-center justify-center text-cyber-cyan font-bold">
                        {item.step}
                      </div>

                      <div>
                        <h3 className="text-white font-bold mb-1">
                          {item.title}
                        </h3>
                        <p className="text-cyber-gray text-sm leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* AI STACK */}
        <section className="py-20">
          <GlassCard glow className="p-8 md:p-10 overflow-hidden relative">
            <motion.div
              className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-cyber-cyan opacity-10 blur-3xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 5, repeat: Infinity }}
            />

            <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
              <div>
                <div className="inline-flex items-center gap-2 text-cyber-cyan text-sm mb-4">
                  <Cpu size={18} />
                  AI + Dataset Architecture
                </div>

                <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-5">
                  Built Like a Real Detection Pipeline
                </h2>

                <p className="text-cyber-gray text-lg leading-relaxed mb-6">
                  VERITAS uses a practical ensemble-style architecture. It combines
                  trained ML models with deterministic security logic and explainable
                  score breakdowns.
                </p>

                <div className="grid sm:grid-cols-2 gap-3">
                  {stackItems.map((item, index) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.06 }}
                      className="flex items-start gap-2 p-3 rounded-lg bg-cyber-dark bg-opacity-40 border border-cyber-cyan border-opacity-10"
                    >
                      <CheckCircle size={16} className="text-cyber-cyan mt-0.5" />
                      <span className="text-cyber-gray text-sm">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    icon: Database,
                    title: 'Dataset Processing',
                    text: 'Raw datasets are converted into clean CSV files for model training.',
                  },
                  {
                    icon: BrainCircuit,
                    title: 'Model Inference',
                    text: 'Saved models are loaded by FastAPI and used during live analysis.',
                  },
                  {
                    icon: FileText,
                    title: 'Trust Report',
                    text: 'Each scan generates evidence, score breakdown, reasoning, and recommendation.',
                  },
                  {
                    icon: Globe2,
                    title: 'Threat Mapping',
                    text: 'Scam types, accounts, tactics, and suspicious domains are mapped into a deception graph.',
                  },
                ].map((item, index) => {
                  const Icon = item.icon

                  return (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.08 }}
                      whileHover={{ scale: 1.02 }}
                      className="p-5 rounded-xl bg-cyber-dark bg-opacity-50 border border-cyber-cyan border-opacity-20"
                    >
                      <div className="flex items-start gap-4">
                        <Icon size={24} className="text-cyber-cyan mt-1" />
                        <div>
                          <h3 className="text-white font-bold mb-1">
                            {item.title}
                          </h3>
                          <p className="text-cyber-gray text-sm leading-relaxed">
                            {item.text}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </GlassCard>
        </section>

        {/* CTA */}
        <section className="py-20">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard glow className="p-10 md:p-14 text-center relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyber-cyan to-cyber-purple opacity-5"
                animate={{ opacity: [0.04, 0.1, 0.04] }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-cyber-cyan bg-opacity-10 border border-cyber-cyan border-opacity-30 flex items-center justify-center mx-auto mb-6">
                  <Zap size={30} className="text-cyber-cyan" />
                </div>

                <h2 className="text-4xl md:text-6xl font-bold text-gradient mb-5">
                  Detect Before You Trust
                </h2>

                <p className="text-cyber-gray text-lg max-w-3xl mx-auto mb-8">
                  Run a VERITAS scan on suspicious profiles, scam messages,
                  phishing links, fake support accounts, and impersonation attempts.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/analyze"
                    className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-cyber-cyan text-cyber-dark font-bold hover:shadow-[0_0_35px_rgba(34,211,238,0.45)] transition-all"
                  >
                    Start Analysis
                    <ArrowRight
                      size={20}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>

                  <Link
                    to="/deception-graph"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-cyber-cyan border-opacity-40 text-cyber-cyan hover:bg-cyber-cyan hover:bg-opacity-10 transition-all"
                  >
                    View Deception Graph
                    <Network size={20} />
                  </Link>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </section>
      </div>
    </div>
  )
}

export default Home