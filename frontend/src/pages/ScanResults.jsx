import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowRightIcon } from '@heroicons/react/outline'

export default function ScanResults() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const scanData = state?.scanData

  useEffect(() => {
    if (!scanData) {
      navigate('/', { replace: true })
    }
  }, [scanData, navigate])

  const handleDashboardNavigate = () => {
    navigate('/dashboard', {
      state: {
        scanData: scanData
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center p-4">
      <div className="relative z-10 max-w-2xl w-full space-y-8 backdrop-blur-lg bg-white/5 rounded-2xl p-8 border border-white/10 shadow-2xl">
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
            <svg 
              className="w-12 h-12 text-green-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Scan Complete!
          </h1>
          <p className="text-gray-300 text-lg">
            Your website security analysis is ready
          </p>
        </div>

        {/* Stats Preview */}
        <div className="grid grid-cols-2 gap-4 text-center mb-8">
          <div className="p-4 bg-white/5 rounded-xl">
            <p className="text-sm text-gray-400">Risk Level</p>
            <p className="text-xl font-bold text-white">
              {scanData?.risk_level?.toUpperCase() || '--'}
            </p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl">
            <p className="text-sm text-gray-400">Total Findings</p>
            <p className="text-xl font-bold text-white">
              {scanData?.anomalies?.length || 0}
            </p>
          </div>
        </div>

        {/* Dashboard Button */}
        <button
          onClick={handleDashboardNavigate}
          className="w-full py-4 px-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl font-semibold text-white hover:from-green-400 hover:to-blue-400 transition-all hover:shadow-lg hover:scale-[1.02] group"
        >
          <div className="flex items-center justify-center gap-2">
            <span>View Full Dashboard</span>
            <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </div>
        </button>

        {/* Additional Options */}
        <div className="text-center text-sm text-gray-400">
          <p>or <a href="/" className="text-blue-400 hover:text-blue-300">start a new scan</a></p>
        </div>
      </div>
    </div>
  )
}