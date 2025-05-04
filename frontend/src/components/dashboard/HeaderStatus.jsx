// components/dashboard/HeaderStatus.jsx
import { motion } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/solid';

export default function HeaderStatus({ scanData = {} }) {
  // Safe data extraction with defaults
  const safeScanData = {
    risk_level: 'unknown',
    anomalies: [],
    scan_metadata: {},
    ...scanData
  };

  // Safe date formatting
  const lastScanDate = safeScanData.scan_metadata?.scan_date 
    ? new Date(safeScanData.scan_metadata.scan_date).toLocaleDateString()
    : 'N/A';

  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded-2xl shadow-xl"
    >
      <div className="flex flex-wrap gap-6">
        {/* Risk Status */}
        <div className="flex items-center gap-3">
          {safeScanData.risk_level === 'low' ? (
            <CheckCircleIcon className="w-6 h-6 text-green-400" />
          ) : (
            <XCircleIcon className="w-6 h-6 text-red-400" />
          )}
          <div>
            <div className="text-sm text-gray-300">Overall Status</div>
            <div className="text-lg font-semibold text-white">
              {safeScanData.risk_level.charAt(0).toUpperCase() + safeScanData.risk_level.slice(1)} Risk
            </div>
          </div>
        </div>

        {/* Total Issues */}
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
            <span className="text-sm text-white">{safeScanData.anomalies.length}</span>
          </div>
          <div>
            <div className="text-sm text-gray-300">Total Issues</div>
            <div className="text-lg font-semibold text-white">
              {safeScanData.anomalies.length} Anomaly{safeScanData.anomalies.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Last Scan */}
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center">
            <span className="text-sm text-white">⏱️</span>
          </div>
          <div>
            <div className="text-sm text-gray-300">Last Scan</div>
            <div className="text-lg font-semibold text-white">
              {lastScanDate}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}