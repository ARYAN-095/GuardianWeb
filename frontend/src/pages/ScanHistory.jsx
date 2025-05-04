import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getScanHistory } from '../utils/api'

export default function ScanHistory() {
  const [scans, setScans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await getScanHistory()
        setScans(data)
      } finally {
        setLoading(false)
      }
    }
    loadHistory()
  }, [])

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Scan History</h1>
      
      {loading ? (
        <div className="text-center py-12">Loading scan history...</div>
      ) : (
        <div className="space-y-4">
          {scans.map(scan => (
            <Link 
              key={scan.scanId}
              to={`/scan/${scan.scanId}`}
              className="block bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{scan.url}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(scan.scan_metadata.scan_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full ${
                    scan.risk_level === 'critical' ? 'bg-red-100 text-red-800' :
                    scan.risk_level === 'high' ? 'bg-orange-100 text-orange-800' :
                    scan.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {scan.risk_score}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}