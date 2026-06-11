import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import {
  TrendingUp,
  AlertTriangle,
  Shield,
  Users,
  RefreshCw,
  Activity,
} from 'lucide-react'
import GlassCard from '../components/GlassCard'
import AnimatedCounter from '../components/AnimatedCounter'
import { getDashboardStats } from '../utils/api'

/**
 * Analytics Dashboard - Comprehensive statistics and trends
 */
const Dashboard = () => {
  const emptyStats = {
    total_analyses: 0,
    high_risk_detected: 0,
    scam_keywords_tracked: 0,
    active_users: 0,
    risk_distribution: [
      { name: 'Low', value: 0, fill: '#10b981' },
      { name: 'Medium', value: 0, fill: '#f59e0b' },
      { name: 'High', value: 0, fill: '#ef4444' },
    ],
    scam_trends: [],
    top_scam_types: [],
    recent_analyses: [],
    simulation_accuracy: {
      attempts: 0,
      correct: 0,
      accuracy: 0,
    },
  }

  const [stats, setStats] = useState(emptyStats)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)

  const loadStats = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      setError(null)

      const response = await getDashboardStats()
      setStats({
        ...emptyStats,
        ...response.data,
        simulation_accuracy: {
          ...emptyStats.simulation_accuracy,
          ...(response.data?.simulation_accuracy || {}),
        },
      })
    } catch (err) {
      console.error('Failed to load stats:', err)
      setError('Unable to load live dashboard data. Check whether the backend is running.')
      setStats(emptyStats)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const riskDistribution = stats?.risk_distribution || emptyStats.risk_distribution
  const scamTrends = stats?.scam_trends || []
  const topScamTypes = stats?.top_scam_types || []
  const recentAnalyses = stats?.recent_analyses || []
  const simulation = stats?.simulation_accuracy || emptyStats.simulation_accuracy

  const hasRiskData = riskDistribution.some((item) => Number(item.value) > 0)
  const hasTrendData = scamTrends.length > 0
  const hasScamTypeData = topScamTypes.length > 0
  const maxScamCount = Math.max(
    1,
    ...topScamTypes.map((item) => Number(item.count) || 0)
  )

  const statCards = [
    {
      icon: Shield,
      label: 'Total Analyses',
      value: stats?.total_analyses || 0,
      color: 'from-cyber-cyan to-cyber-blue',
      delay: 0,
    },
    {
      icon: AlertTriangle,
      label: 'High Risk Detected',
      value: stats?.high_risk_detected || 0,
      color: 'from-red-500 to-rose-500',
      delay: 0.1,
    },
    {
      icon: TrendingUp,
      label: 'Scam Keywords Tracked',
      value: stats?.scam_keywords_tracked || 0,
      color: 'from-orange-500 to-yellow-500',
      delay: 0.2,
    },
    {
      icon: Users,
      label: 'Active Users',
      value: stats?.active_users || 0,
      color: 'from-purple-500 to-pink-500',
      delay: 0.3,
    },
  ]

  const formatScamType = (value) => {
    if (!value) return 'Unknown'
    return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
  }

  const formatDate = (value) => {
    if (!value) return '-'

    try {
      return new Date(value).toLocaleString()
    } catch {
      return value
    }
  }

  if (loading) {
    return (
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-12 h-12 border-3 border-cyber-cyan border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-cyber-gray">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-20 px-4">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-5xl font-bold text-gradient mb-4">
              Intelligence Dashboard
            </h1>
            <p className="text-cyber-gray text-lg">
              Live analytics generated from actual VERITAS analysis logs
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadStats(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-cyber-cyan border-opacity-40 text-cyber-cyan hover:bg-cyber-cyan hover:bg-opacity-10 transition-all disabled:opacity-60"
          >
            <RefreshCw
              size={18}
              className={refreshing ? 'animate-spin' : ''}
            />
            Refresh
          </button>
        </div>

        {error && (
          <motion.div
            className="mb-8 p-4 rounded-lg bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 flex items-start gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertTriangle
              size={20}
              className="text-red-400 flex-shrink-0 mt-0.5"
            />
            <p className="text-red-400 text-sm">{error}</p>
          </motion.div>
        )}

        {/* KPI Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card) => {
            const Icon = card.icon

            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: card.delay }}
              >
                <GlassCard glow className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${card.color}`}>
                      <Icon size={24} className="text-cyber-dark" />
                    </div>
                  </div>

                  <h3 className="text-cyber-gray text-sm font-semibold mb-2">
                    {card.label}
                  </h3>

                  <p className="text-3xl font-bold text-cyber-cyan">
                    <AnimatedCounter to={card.value} />
                  </p>
                </GlassCard>
              </motion.div>
            )
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Risk Distribution */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard glow className="p-6">
              <h2 className="text-xl font-bold text-cyber-cyan mb-6">
                Risk Distribution
              </h2>

              {hasRiskData ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={riskDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {riskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>

                    <Tooltip
                      contentStyle={{
                        background: 'rgba(10, 25, 47, 0.8)',
                        border: '1px solid rgba(34, 211, 238, 0.2)',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-center">
                  <p className="text-cyber-gray text-sm">
                    No analysis data yet. Run a few profile analyses to populate this chart.
                  </p>
                </div>
              )}
            </GlassCard>
          </motion.div>

          {/* Scam Trends */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <GlassCard glow className="p-6">
              <h2 className="text-xl font-bold text-cyber-cyan mb-6">
                Detection Trends
              </h2>

              {hasTrendData ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={scamTrends}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(34, 211, 238, 0.1)"
                    />
                    <XAxis
                      dataKey="month"
                      stroke="rgba(176, 190, 197, 0.5)"
                    />
                    <YAxis stroke="rgba(176, 190, 197, 0.5)" />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(10, 25, 47, 0.8)',
                        border: '1px solid rgba(34, 211, 238, 0.2)',
                        borderRadius: '8px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="detections"
                      stroke="#22d3ee"
                      strokeWidth={3}
                      dot={{ fill: '#22d3ee', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-center">
                  <p className="text-cyber-gray text-sm">
                    No trend data yet. Trends will appear after analyses are saved.
                  </p>
                </div>
              )}
            </GlassCard>
          </motion.div>
        </div>

        {/* Bottom Charts */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Top Scam Types */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <GlassCard glow className="p-6">
              <h2 className="text-xl font-bold text-cyber-cyan mb-6">
                Top Scam Types
              </h2>

              {hasScamTypeData ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topScamTypes}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(34, 211, 238, 0.1)"
                    />
                    <XAxis
                      dataKey="name"
                      stroke="rgba(176, 190, 197, 0.5)"
                    />
                    <YAxis stroke="rgba(176, 190, 197, 0.5)" />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(10, 25, 47, 0.8)',
                        border: '1px solid rgba(34, 211, 238, 0.2)',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar
                      dataKey="count"
                      fill="#3b82f6"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-center">
                  <p className="text-cyber-gray text-sm">
                    No scam categories detected yet.
                  </p>
                </div>
              )}
            </GlassCard>
          </motion.div>

          {/* Quick Stats and Simulation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="space-y-4"
          >
            <GlassCard glow className="p-6">
              <h2 className="text-xl font-bold text-cyber-cyan mb-6">
                Quick Stats
              </h2>

              {hasScamTypeData ? (
                <div className="space-y-4">
                  {topScamTypes.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-cyber-gray font-semibold">
                          {item.name}
                        </span>
                        <span className="text-cyber-cyan font-bold">
                          {item.count}
                        </span>
                      </div>

                      <div className="w-full h-2 rounded-full bg-cyber-dark relative overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-blue rounded-full"
                          initial={{ width: 0 }}
                          animate={{
                            width: `${((Number(item.count) || 0) / maxScamCount) * 100}%`,
                          }}
                          transition={{
                            delay: 0.8 + index * 0.1 + 0.3,
                            duration: 1,
                          }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-cyber-gray text-sm">
                  Quick stats will appear after real analyses are stored.
                </p>
              )}
            </GlassCard>

            {/* Simulation Performance */}
            <GlassCard className="p-6 border-cyber-purple border-opacity-30">
              <h3 className="text-lg font-bold text-cyber-cyan mb-4">
                Simulation Performance
              </h3>

              <div className="space-y-3">
                <div>
                  <p className="text-cyber-gray text-sm mb-1">
                    User Awareness Score
                  </p>
                  <p className="text-3xl font-bold text-gradient">
                    {simulation.accuracy || 0}%
                  </p>
                </div>

                <p className="text-cyber-gray text-xs leading-relaxed">
                  {simulation.attempts || 0} simulation attempts completed.{' '}
                  {simulation.correct || 0} correct responses recorded.
                </p>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Recent Analyses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8"
        >
          <GlassCard glow className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Activity size={22} className="text-cyber-cyan" />
              <h2 className="text-xl font-bold text-cyber-cyan">
                Recent Analyses
              </h2>
            </div>

            {recentAnalyses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-cyber-cyan border-opacity-20">
                      <th className="text-left py-3 px-2 text-cyber-gray">
                        Username
                      </th>
                      <th className="text-left py-3 px-2 text-cyber-gray">
                        Risk
                      </th>
                      <th className="text-left py-3 px-2 text-cyber-gray">
                        Score
                      </th>
                      <th className="text-left py-3 px-2 text-cyber-gray">
                        Scam Type
                      </th>
                      <th className="text-left py-3 px-2 text-cyber-gray">
                        Confidence
                      </th>
                      <th className="text-left py-3 px-2 text-cyber-gray">
                        Time
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentAnalyses.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-cyber-cyan border-opacity-10"
                      >
                        <td className="py-3 px-2 text-cyber-cyan font-semibold">
                          {item.username}
                        </td>

                        <td className="py-3 px-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              item.category === 'High'
                                ? 'bg-red-500 bg-opacity-20 text-red-300'
                                : item.category === 'Medium'
                                  ? 'bg-yellow-500 bg-opacity-20 text-yellow-300'
                                  : 'bg-green-500 bg-opacity-20 text-green-300'
                            }`}
                          >
                            {item.category}
                          </span>
                        </td>

                        <td className="py-3 px-2 text-cyber-gray">
                          {Number(item.risk_score || 0).toFixed(1)}
                        </td>

                        <td className="py-3 px-2 text-cyber-gray">
                          {formatScamType(item.scam_type)}
                        </td>

                        <td className="py-3 px-2 text-cyber-gray">
                          {item.confidence || 'Low'}
                        </td>

                        <td className="py-3 px-2 text-cyber-gray">
                          {formatDate(item.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-cyber-gray text-sm">
                No recent analyses yet. Run the Risk Analyzer to populate this section.
              </p>
            )}
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Dashboard