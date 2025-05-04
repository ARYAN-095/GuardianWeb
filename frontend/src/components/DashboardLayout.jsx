import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChartBarIcon, ArrowLeftIcon } from '@heroicons/react/outline';
import HeaderStatus from './dashboard/HeaderStatus';
import RiskMeter from './dashboard/RiskMeter';
import ThreatIntelCard from './dashboard/ThreatIntelCard';
import AnomalyChart from './dashboard/AnomalyChart';

export default function DashboardLayout() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Handle missing state or invalid navigation
  if (!state?.scanData) {
    return (
      <div className="min-h-screen bg-slate-900 p-8 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md space-y-4"
        >
          <h2 className="text-2xl font-bold text-white">No Scan Data Available</h2>
          <p className="text-slate-300 mb-6">
            Please perform a scan first from the home page
          </p>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mx-auto"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Go to Home Page
          </button>
        </motion.div>
      </div>
    );
  }

  // Safe data extraction with validation
  const { scanData = {}, groupedAnomalies = {} } = state;

  // Data normalization with TypeScript-like interfaces
  const safeScanData = {
    risk_score: typeof scanData.risk_score === 'number' ? scanData.risk_score : 0,
    risk_level: ['low', 'medium', 'high', 'critical'].includes(scanData.risk_level) 
      ? scanData.risk_level 
      : 'unknown',
    anomalies: Array.isArray(scanData.anomalies) ? scanData.anomalies : [],
    threat_intel: typeof scanData.threat_intel === 'object' ? scanData.threat_intel : {},
    scan_history: Array.isArray(scanData.scan_history) ? scanData.scan_history : [],
    protected_urls: Array.isArray(scanData.protected_urls) ? scanData.protected_urls : [],
  };

  // Memoized stats calculation
  const stats = {
    totalScans: safeScanData.scan_history.length,
    highRiskItems: safeScanData.anomalies.reduce(
      (count, anomaly) => count + (anomaly.severity === 'high' ? 1 : 0), 
      0
    ),
    protectedSites: safeScanData.protected_urls.length
  };

  return (
    <div className="min-h-screen bg-slate-900 p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto space-y-6 sm:space-y-8"
      >
        {/* Header with back button */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <HeaderStatus 
            scanData={safeScanData} 
            lastScanDate={safeScanData.scan_history[0]?.date}
          />
          <div className="w-5"></div> {/* Spacer for alignment */}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {[
                { 
                  label: 'Total Scans', 
                  value: stats.totalScans,
                  color: 'text-white'
                },
                { 
                  label: 'High Risk Items', 
                  value: stats.highRiskItems,
                  color: 'text-red-400'
                },
                { 
                  label: 'Protected Sites', 
                  value: stats.protectedSites,
                  color: 'text-emerald-400'
                }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ scale: 0.95, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg"
                >
                  <h3 className="text-sm font-medium text-slate-400">{stat.label}</h3>
                  <p className={`text-2xl sm:text-3xl font-bold mt-1 ${stat.color}`}>
                    {stat.value}
                  </p>
                </motion.div>
              ))}
            </div>

            <AnomalyChart anomalies={safeScanData.anomalies} />
            <ThreatIntelCard threatIntel={safeScanData.threat_intel} />
          </div>
          
          <div className="space-y-6 sm:space-y-8">
            <RiskMeter 
              score={safeScanData.risk_score} 
              level={safeScanData.risk_level}
            />

            {/* Recent Findings */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg"
            >
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <ChartBarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                <h2 className="text-lg sm:text-xl font-semibold text-white">
                  Recent Findings
                </h2>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                {Object.values(groupedAnomalies).length > 0 ? (
                  Object.values(groupedAnomalies).map((anomaly, index) => (
                    <motion.div 
                      key={anomaly.id || `${anomaly.message}-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className="p-3 sm:p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-slate-100 line-clamp-2">
                            {anomaly.message || 'Unknown Issue'}
                          </p>
                          <span className={`text-xs sm:text-sm ${
                            anomaly.severity === 'high' ? 'text-red-400' :
                            anomaly.severity === 'medium' ? 'text-yellow-400' :
                            'text-slate-400'
                          }`}>
                            {anomaly.severity || 'unclassified'}
                          </span>
                        </div>
                        <span className="text-xs sm:text-sm text-slate-400 whitespace-nowrap">
                          {anomaly.count || 0} {anomaly.count === 1 ? 'occurrence' : 'occurrences'}
                        </span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-slate-400 py-4"
                  >
                    No security findings detected
                  </motion.p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}