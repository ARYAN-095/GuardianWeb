// ScanReportPage.jsx
import { ChartBarIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline'
import RiskMeter from '../components/RiskMeter'

export default function ScanReport() {
  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold">WebScan Report</h1>
        <div className="flex gap-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Export PDF
          </button>
          <button className="bg-gray-200 px-4 py-2 rounded-lg">
            New Scan
          </button>
        </div>
      </div>

      {/* Risk Overview Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-6">Risk Assessment</h2>
        <RiskMeter 
          virusTotalScore={0} 
          abuseIPDBScore={0} 
          combinedThreat="High Risk"
        />
        <div className="grid grid-cols-2 gap-6 mt-6">
          <div className="p-4 bg-red-50 rounded-lg">
            <h3 className="text-sm font-medium text-red-600 mb-2">VirusTotal Score</h3>
            <p className="text-3xl font-bold">0/94</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-600 mb-2">AbuseIPDB Score</h3>
            <p className="text-3xl font-bold">0/100</p>
          </div>
        </div>
      </div>

      {/* Security Findings */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-6">Security Findings</h2>
        <SecurityFinding
          title="Missing Content-Security-Policy header"
          severity="HIGH"
          description="Allows potential XSS attacks due to unrestricted script sources"
          configSnippet="Content-Security-Policy: default-src 'self'"
        />
        <SecurityFinding
          title="Missing X-Frame-Options header"
          severity="MEDIUM"
          description="Exposes to clickjacking attacks"
          configSnippet="X-Frame-Options: DENY"
        />
      </div>

      {/* Timeline & History */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Scan History</h2>
        {/* Timeline component here */}
      </div>
    </div>
  )
}