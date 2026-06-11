import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from './components/Header'
import CyberGrid from './components/CyberGrid'
import Landing from './pages/Landing'
import RiskAnalyzer from './pages/RiskAnalyzer'
import TwinDetection from './pages/TwinDetection'
import SimulationLab from './pages/SimulationLab'
import DeceptionGraph from './pages/DeceptionGraph'
import Dashboard from './pages/Dashboard'
import Architecture from './pages/Architecture'

function App() {
  const [isDarkMode] = useState(true)

  return (
    <Router>
      <div className="bg-gradient-cyber min-h-screen relative overflow-x-hidden">
        <CyberGrid />
        <Header />
        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/analyze" element={<RiskAnalyzer />} />
            <Route path="/twin-detection" element={<TwinDetection />} />
            <Route path="/simulation" element={<SimulationLab />} />
            <Route path="/deception-graph" element={<DeceptionGraph />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/architecture" element={<Architecture />} />
          </Routes>
        </motion.main>
      </div>
    </Router>
  )
}

export default App
