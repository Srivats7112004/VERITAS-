import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Network,
  Zap,
  RefreshCw,
  AlertTriangle,
  Link2,
  Target,
  User,
  ShieldAlert,
} from 'lucide-react'
import GlassCard from '../components/GlassCard'
import { getDeceptionGraph } from '../utils/api'

/**
 * Dynamic Deception Graph
 * Maps real saved analysis logs into a relationship network.
 */
const DeceptionGraph = () => {
  const [graphData, setGraphData] = useState({
    nodes: [],
    edges: [],
  })

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)

  const loadGraph = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      setError(null)

      const response = await getDeceptionGraph()
      setGraphData({
        nodes: response.data?.nodes || [],
        edges: response.data?.edges || [],
      })
    } catch (err) {
      console.error('Failed to load graph:', err)
      setError('Unable to load live deception graph. Check whether the backend is running.')
      setGraphData({
        nodes: [],
        edges: [],
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadGraph()
  }, [])

  const nodeTypes = {
    identity: {
      icon: '👤',
      label: 'Account / Identity',
      x: 120,
      color: '#22d3ee',
    },
    scheme: {
      icon: '🎯',
      label: 'Scam Type',
      x: 340,
      color: '#a855f7',
    },
    tactic: {
      icon: '⚠️',
      label: 'Manipulation Tactic',
      x: 560,
      color: '#f59e0b',
    },
    url: {
      icon: '🔗',
      label: 'Suspicious URL / Domain',
      x: 560,
      color: '#ef4444',
    },
    payload: {
      icon: '⚡',
      label: 'Payload',
      x: 560,
      color: '#fb923c',
    },
    malware: {
      icon: '🦠',
      label: 'Malware',
      x: 560,
      color: '#ef4444',
    },
    status: {
      icon: 'ℹ️',
      label: 'Status',
      x: 340,
      color: '#22d3ee',
    },
  }

  const getSeverityColor = (severity) => {
    switch ((severity || '').toLowerCase()) {
      case 'high':
        return {
          fill: 'rgba(239, 68, 68, 0.12)',
          stroke: '#ef4444',
          text: 'text-red-400',
          label: 'High',
        }

      case 'medium':
        return {
          fill: 'rgba(251, 146, 60, 0.12)',
          stroke: '#fb923c',
          text: 'text-orange-400',
          label: 'Medium',
        }

      default:
        return {
          fill: 'rgba(34, 211, 238, 0.12)',
          stroke: '#22d3ee',
          text: 'text-cyber-cyan',
          label: 'Low',
        }
    }
  }

  const getTypeIcon = (type) => {
    return nodeTypes[type]?.icon || '🔗'
  }

  const getTypeLabel = (type) => {
    return nodeTypes[type]?.label || 'Entity'
  }

  const truncateLabel = (label, maxLength = 22) => {
    if (!label) return 'Unknown'
    return label.length > maxLength ? `${label.slice(0, maxLength)}...` : label
  }

  const normalizedNodes = useMemo(() => {
    return graphData?.nodes || []
  }, [graphData])

  const normalizedEdges = useMemo(() => {
    const nodeIds = new Set(normalizedNodes.map((node) => node.id))

    return (graphData?.edges || []).filter(
      (edge) => nodeIds.has(edge.from) && nodeIds.has(edge.to)
    )
  }, [graphData, normalizedNodes])

  const nodePositions = useMemo(() => {
    const positions = {}
    const groups = {}

    normalizedNodes.forEach((node) => {
      const type = node.type || 'status'

      if (!groups[type]) {
        groups[type] = []
      }

      groups[type].push(node)
    })

    Object.entries(groups).forEach(([type, nodes]) => {
      const typeConfig = nodeTypes[type] || nodeTypes.status
      const total = nodes.length
      const startY = Math.max(80, 260 - ((total - 1) * 55) / 2)

      nodes.forEach((node, index) => {
        positions[node.id] = {
          x: typeConfig.x,
          y: startY + index * 55,
        }
      })
    })

    return positions
  }, [normalizedNodes])

  const selectedConnections = useMemo(() => {
    if (!selectedNode) return []

    return normalizedEdges
      .filter((edge) => edge.from === selectedNode.id || edge.to === selectedNode.id)
      .map((edge) => {
        const connectedId = edge.from === selectedNode.id ? edge.to : edge.from
        return normalizedNodes.find((node) => node.id === connectedId)
      })
      .filter(Boolean)
  }, [selectedNode, normalizedEdges, normalizedNodes])

  const graphStats = useMemo(() => {
    const bySeverity = {
      high: 0,
      medium: 0,
      low: 0,
    }

    const byType = {}

    normalizedNodes.forEach((node) => {
      const severity = (node.severity || 'low').toLowerCase()
      bySeverity[severity] = (bySeverity[severity] || 0) + 1

      const type = node.type || 'unknown'
      byType[type] = (byType[type] || 0) + 1
    })

    return {
      entities: normalizedNodes.length,
      connections: normalizedEdges.length,
      high: bySeverity.high || 0,
      medium: bySeverity.medium || 0,
      low: bySeverity.low || 0,
      byType,
    }
  }, [normalizedNodes, normalizedEdges])

  if (loading) {
    return (
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-12 h-12 border-3 border-cyber-cyan border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-cyber-gray">Loading deception network...</p>
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
              Deception Graph
            </h1>
            <p className="text-cyber-gray text-lg">
              Live network mapping analyzed accounts, scam types, tactics, and suspicious domains
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadGraph(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-cyber-cyan border-opacity-40 text-cyber-cyan hover:bg-cyber-cyan hover:bg-opacity-10 transition-all disabled:opacity-60"
          >
            <RefreshCw
              size={18}
              className={refreshing ? 'animate-spin' : ''}
            />
            Refresh Graph
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Graph Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <GlassCard glow className="p-6 min-h-[620px] flex items-center justify-center">
              {normalizedNodes.length > 0 ? (
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 700 560"
                  className="max-w-full min-h-[560px]"
                >
                  {/* Grid background */}
                  <defs>
                    <pattern
                      id="grid"
                      width="40"
                      height="40"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 40 0 L 0 0 0 40"
                        fill="none"
                        stroke="rgba(34, 211, 238, 0.05)"
                        strokeWidth="0.5"
                      />
                    </pattern>

                    <marker
                      id="arrow"
                      markerWidth="10"
                      markerHeight="10"
                      refX="8"
                      refY="3"
                      orient="auto"
                      markerUnits="strokeWidth"
                    >
                      <path
                        d="M0,0 L0,6 L9,3 z"
                        fill="rgba(34, 211, 238, 0.45)"
                      />
                    </marker>
                  </defs>

                  <rect width="700" height="560" fill="url(#grid)" />

                  {/* Column Labels */}
                  <text
                    x="120"
                    y="35"
                    textAnchor="middle"
                    fontSize="13"
                    fill="rgba(34, 211, 238, 0.8)"
                    fontWeight="600"
                  >
                    Identities
                  </text>

                  <text
                    x="340"
                    y="35"
                    textAnchor="middle"
                    fontSize="13"
                    fill="rgba(168, 85, 247, 0.85)"
                    fontWeight="600"
                  >
                    Scam Schemes
                  </text>

                  <text
                    x="560"
                    y="35"
                    textAnchor="middle"
                    fontSize="13"
                    fill="rgba(251, 146, 60, 0.85)"
                    fontWeight="600"
                  >
                    Tactics / URLs
                  </text>

                  {/* Edges */}
                  {normalizedEdges.map((edge, index) => {
                    const fromPos = nodePositions[edge.from]
                    const toPos = nodePositions[edge.to]

                    if (!fromPos || !toPos) return null

                    const midX = (fromPos.x + toPos.x) / 2

                    const path = `M ${fromPos.x} ${fromPos.y} C ${midX} ${fromPos.y}, ${midX} ${toPos.y}, ${toPos.x} ${toPos.y}`

                    return (
                      <motion.path
                        key={`${edge.from}-${edge.to}-${index}`}
                        d={path}
                        fill="none"
                        stroke="rgba(34, 211, 238, 0.35)"
                        strokeWidth="2"
                        markerEnd="url(#arrow)"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ delay: index * 0.05, duration: 0.7 }}
                        strokeDasharray="5,5"
                      />
                    )
                  })}

                  {/* Nodes */}
                  {normalizedNodes.map((node, index) => {
                    const pos = nodePositions[node.id]
                    const colors = getSeverityColor(node.severity)
                    const isSelected = selectedNode?.id === node.id

                    if (!pos) return null

                    return (
                      <g key={node.id}>
                        {/* Pulse effect for high severity */}
                        {node.severity === 'high' && (
                          <motion.circle
                            cx={pos.x}
                            cy={pos.y}
                            r={30}
                            fill="none"
                            stroke={colors.stroke}
                            strokeWidth="2"
                            opacity={0.45}
                            animate={{ r: 48, opacity: 0 }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        )}

                        {/* Node Circle */}
                        <motion.circle
                          cx={pos.x}
                          cy={pos.y}
                          r={isSelected ? 34 : 28}
                          fill={colors.fill}
                          stroke={colors.stroke}
                          strokeWidth={isSelected ? 3 : 2}
                          onClick={() => setSelectedNode(isSelected ? null : node)}
                          style={{ cursor: 'pointer' }}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{
                            scale: 1,
                            opacity: 1,
                            filter: isSelected
                              ? `drop-shadow(0 0 16px ${colors.stroke})`
                              : 'drop-shadow(0 0 5px rgba(0,0,0,0.35))',
                          }}
                          transition={{ delay: 0.2 + index * 0.04, duration: 0.3 }}
                        />

                        {/* Node Icon */}
                        <text
                          x={pos.x}
                          y={pos.y}
                          textAnchor="middle"
                          dy="0.32em"
                          fontSize="22"
                          style={{ pointerEvents: 'none' }}
                        >
                          {getTypeIcon(node.type)}
                        </text>

                        {/* Node Label */}
                        <text
                          x={pos.x}
                          y={pos.y + 44}
                          textAnchor="middle"
                          fontSize="11"
                          fill={isSelected ? colors.stroke : 'rgba(176, 190, 197, 0.78)'}
                          fontWeight={isSelected ? '700' : '500'}
                          style={{ pointerEvents: 'none' }}
                        >
                          {truncateLabel(node.label)}
                        </text>
                      </g>
                    )
                  })}
                </svg>
              ) : (
                <div className="text-center px-6">
                  <Network size={48} className="text-cyber-cyan mx-auto mb-4 opacity-80" />
                  <h3 className="text-xl font-bold text-cyber-cyan mb-3">
                    No graph data yet
                  </h3>
                  <p className="text-cyber-gray text-sm leading-relaxed">
                    Run a few analyses from the Risk Analyzer page. Accounts, scam types,
                    tactics, and suspicious URLs will automatically appear here.
                  </p>
                </div>
              )}
            </GlassCard>
          </motion.div>

          {/* Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Legend */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-bold text-cyber-cyan mb-4 flex items-center gap-2">
                <Network size={20} />
                Network Legend
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-cyber-gray text-xs uppercase tracking-wider mb-3">
                    Severity
                  </p>

                  <div className="space-y-3">
                    {[
                      { type: 'high', label: 'High Risk', color: '#ef4444' },
                      { type: 'medium', label: 'Medium Risk', color: '#fb923c' },
                      { type: 'low', label: 'Low Risk', color: '#22d3ee' },
                    ].map((item) => (
                      <div key={item.type} className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full border-2"
                          style={{ borderColor: item.color }}
                        />
                        <span className="text-cyber-gray text-sm">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-cyber-cyan border-opacity-20 pt-4">
                  <p className="text-cyber-gray text-xs uppercase tracking-wider mb-3">
                    Node Types
                  </p>

                  <div className="space-y-2">
                    {[
                      { icon: User, label: 'Account identity', color: 'text-cyber-cyan' },
                      { icon: Target, label: 'Scam scheme', color: 'text-purple-400' },
                      { icon: ShieldAlert, label: 'Risk tactic', color: 'text-orange-400' },
                      { icon: Link2, label: 'Suspicious URL/domain', color: 'text-red-400' },
                    ].map((item) => {
                      const Icon = item.icon

                      return (
                        <div key={item.label} className="flex items-center gap-3">
                          <Icon size={15} className={item.color} />
                          <span className="text-cyber-gray text-sm">
                            {item.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Node Details */}
            {selectedNode && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard glow className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="text-2xl">
                      {getTypeIcon(selectedNode.type)}
                    </span>

                    <div>
                      <h4 className="font-bold text-cyber-cyan break-words">
                        {selectedNode.label}
                      </h4>
                      <p className="text-xs text-cyber-gray">
                        {getTypeLabel(selectedNode.type)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 border-t border-cyber-cyan border-opacity-20 pt-4">
                    <div>
                      <p className="text-xs text-cyber-gray mb-1">
                        Severity Level
                      </p>
                      <p className={`font-semibold ${getSeverityColor(selectedNode.severity).text}`}>
                        {getSeverityColor(selectedNode.severity).label.toUpperCase()}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-cyber-gray mb-1">
                        Connections
                      </p>
                      <p className="font-semibold text-cyber-cyan">
                        {selectedConnections.length} link(s)
                      </p>
                    </div>

                    {selectedConnections.length > 0 && (
                      <div>
                        <p className="text-xs text-cyber-gray mb-2">
                          Connected To
                        </p>

                        <div className="space-y-2">
                          {selectedConnections.slice(0, 6).map((node) => (
                            <div
                              key={node.id}
                              className="p-2 rounded-lg bg-cyber-dark bg-opacity-40 border border-cyber-cyan border-opacity-10"
                            >
                              <p className="text-cyber-gray text-xs break-words">
                                {getTypeIcon(node.type)} {node.label}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* Stats */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-bold text-cyber-cyan mb-4 flex items-center gap-2">
                <Zap size={20} />
                Network Stats
              </h3>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-lg bg-cyber-dark bg-opacity-40 border border-cyber-cyan border-opacity-20">
                  <p className="text-cyber-gray text-xs mb-1">Entities</p>
                  <p className="text-cyber-cyan font-bold text-xl">
                    {graphStats.entities}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-cyber-dark bg-opacity-40 border border-cyber-cyan border-opacity-20">
                  <p className="text-cyber-gray text-xs mb-1">Connections</p>
                  <p className="text-cyber-cyan font-bold text-xl">
                    {graphStats.connections}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-cyber-dark bg-opacity-40 border border-red-500 border-opacity-20">
                  <p className="text-cyber-gray text-xs mb-1">High Risk</p>
                  <p className="text-red-400 font-bold text-xl">
                    {graphStats.high}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-cyber-dark bg-opacity-40 border border-orange-500 border-opacity-20">
                  <p className="text-cyber-gray text-xs mb-1">Medium Risk</p>
                  <p className="text-orange-400 font-bold text-xl">
                    {graphStats.medium}
                  </p>
                </div>
              </div>

              <div className="border-t border-cyber-cyan border-opacity-20 pt-4">
                <p className="text-cyber-gray text-xs uppercase tracking-wider mb-3">
                  Entity Breakdown
                </p>

                <div className="space-y-2">
                  {Object.entries(graphStats.byType).map(([type, count]) => (
                    <div
                      key={type}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-cyber-gray capitalize">
                        {getTypeIcon(type)} {type}
                      </span>
                      <span className="text-cyber-cyan font-semibold">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default DeceptionGraph