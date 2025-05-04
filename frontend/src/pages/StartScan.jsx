import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { analyzeWebsite } from '../utils/api'
import { 
    GlobeAltIcon,
    ShieldCheckIcon as ShieldExclamationIcon,
    RefreshIcon as ArrowPathIcon,
    ChartBarIcon  // Add this import
  } from '@heroicons/react/outline'
import { Link } from 'react-router-dom';

export default function StartScan() {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!url) return
    setIsLoading(true)
    
    try {
      const result = await analyzeWebsite(url)
      navigate(`/scan/${result.scanId}`, {
        state: {
          scanData: result // Passing full scan result data to the results page
        }
      })
    } catch (error) {
      console.error('Scan failed:', error)
      // Optionally show error to user
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-64 h-64 bg-white/5 rounded-full blur-xl animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${15 + i * 5}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-2xl w-full space-y-8 backdrop-blur-lg bg-white/5 rounded-2xl p-8 border border-white/10 shadow-2xl">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 animate-pulse">
            <ShieldExclamationIcon className="w-12 h-12 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              WebGuard Scan
            </h1>
          </div>
          <p className="text-gray-300 text-lg">
            Protect your website with advanced security analysis
          </p>
        </div>

        <div className="absolute top-4 right-4">
  <Link 
    to="/dashboard"
    className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors"
  >
    <ChartBarIcon className="w-6 h-6" />
    <span className="font-medium">View Dashboard</span>
  </Link>
</div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-500/10 rounded-xl blur-lg group-hover:bg-blue-500/20 transition-all" />
            <div className="relative">
              <div className="flex items-center gap-3 bg-gray-900/50 backdrop-blur-sm rounded-xl p-1 border border-white/10 hover:border-blue-400/30 transition-colors">
                <GlobeAltIcon className="w-6 h-6 ml-4 text-blue-400" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full bg-transparent py-4 pr-4 text-gray-100 placeholder-gray-400 focus:outline-none text-lg"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-semibold text-white hover:from-blue-400 hover:to-purple-400 transition-all hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-opacity" />
            <div className="relative flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <ArrowPathIcon className="w-6 h-6 animate-spin" />
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <ShieldExclamationIcon className="w-6 h-6 animate-bounce" />
                  <span>Start Security Scan</span>
                </>
              )}
            </div>
          </button>
        </form>

        <div className="text-center text-gray-400 text-sm">
          <p>Powered by AI-driven threat detection</p>
        </div>
      </div>
    </div>
  )
}