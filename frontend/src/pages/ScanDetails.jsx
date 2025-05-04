import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getScanResults } from '../utils/api'
import RiskMeter from '../components/dashboard/RiskMeter'
import AnomalyAccordion from '../components/scan/AnomalyAccordion'
import ThreatIntelCard from '../components/dashboard/ThreatIntelCard'
import ScanComparison from '../components/scan/ScanComparison'
import { ChartBarIcon, ArrowLeftIcon, SparklesIcon } from '@heroicons/react/outline'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function ScanDetails() {
  const { scanId } = useParams()
  const navigate = useNavigate()
  const [scanData, setScanData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getScanResults(scanId)
        setScanData(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [scanId])

  const groupAnomalies = (anomalies = []) => {
    return anomalies.reduce((acc, anomaly) => {
      const key = `${anomaly.type}-${anomaly.message}`
      acc[key] = acc[key] ? { ...anomaly, count: acc[key].count + 1 } : { ...anomaly, count: 1 }
      return acc
    }, {})
  }

  const handleGoToDashboard = () => {
    if (!scanData) return
    
    navigate('/dashboard', {
      state: {
        scanData: scanData,
        groupedAnomalies: groupAnomalies(scanData.anomalies)
      }
    })
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center text-slate-600"
      >
        <SparklesIcon className="w-12 h-12 mx-auto mb-4 animate-pulse" />
        Analyzing scan results...
      </motion.div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center text-red-500 max-w-md"
      >
        <div className="text-2xl mb-4">⚠️ Scan Error</div>
        <p className="text-slate-600">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 mx-auto"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Return to Scans
        </button>
      </motion.div>
    </div>
  )

  if (!scanData) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center text-slate-600"
      >
        No scan data found for this analysis
      </motion.div>
    </div>
  )

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="p-6 max-w-7xl mx-auto min-h-screen"
    >
      {/* Header with Navigation */}
      <motion.div variants={itemVariants} className="flex justify-between items-center mb-8">
        <motion.button
          onClick={() => navigate(-1)}
          whileHover={{ x: -4 }}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 bg-white px-4 py-2 rounded-lg shadow-sm"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="hidden sm:inline">Back to Scans</span>
        </motion.button>

        <motion.button
          onClick={handleGoToDashboard}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-shadow"
        >
          <ChartBarIcon className="w-5 h-5" />
          <span>Interactive Dashboard</span>
        </motion.button>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Risk Meter Card */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg border border-slate-100"
        >
          <RiskMeter 
            score={scanData.risk_score || 0}
            level={scanData.risk_level || 'unknown'}
            change={scanData.previous_scan_diff?.risk_score_change}
          />
        </motion.div>

        {/* Threat Intel Card */}
        <motion.div variants={itemVariants} className="h-full">
          <ThreatIntelCard threatIntel={scanData.threat_intel || {}} />
        </motion.div>
      </div>

      {/* Findings & Recommendations */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Security Findings */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Security Findings</h2>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <AnomalyAccordion 
              anomalies={(scanData.anomalies || []).filter(a => a.type === 'security')} 
            />
          </div>
        </motion.div>

        {/* Recommendations */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Recommended Actions</h2>
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            <AnimatePresence>
              {(scanData.recommendations || []).map((rec, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 bg-slate-50 rounded-lg border-l-4 border-blue-500 hover:bg-slate-100 transition-colors"
                >
                  <p className="text-slate-700">{rec}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Scan Comparison */}
      {scanData.previous_scan_diff && (
        <motion.div variants={itemVariants} className="mb-8">
          <ScanComparison comparison={scanData.previous_scan_diff} />
        </motion.div>
      )}

      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-8 right-8"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <button
          onClick={handleGoToDashboard}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <ChartBarIcon className="w-6 h-6" />
        </button>
      </motion.div>
    </motion.div>
  )
}