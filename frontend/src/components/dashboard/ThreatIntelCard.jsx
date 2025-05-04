import { motion } from 'framer-motion';
import { 
  ShieldExclamationIcon,
  GlobeAltIcon,
  FlagIcon,
  ServerIcon,
  LinkIcon,
  UserGroupIcon,
  ClockIcon,
  ClipboardIcon
} from '@heroicons/react/outline';

const AnimatedItem = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

export default function ThreatIntelCard({ threatIntel }) {
  const abuseData = threatIntel.abuse_ip_db;
  const vtData = threatIntel.virustotal;

  const threatColor = abuseData.confidenceScore > 50 ? 'red' : 
                     abuseData.confidenceScore > 20 ? 'orange' : 'green';

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-xl space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <motion.div whileHover={{ scale: 1.1 }}>
          <ShieldExclamationIcon className="w-8 h-8 text-red-400" />
        </motion.div>
        <h3 className="text-xl font-semibold text-white">Threat Intelligence</h3>
      </div>

      {/* IP/Domain Section */}
      <div className="grid md:grid-cols-2 gap-4">
        <AnimatedItem>
          <div className="p-4 bg-slate-700/30 rounded-xl flex items-center gap-4">
            <GlobeAltIcon className="w-6 h-6 text-blue-400" />
            <div>
              <p className="text-sm text-slate-400">Analyzed Domain</p>
              <p className="text-white font-mono">{abuseData.domain}</p>
            </div>
          </div>
        </AnimatedItem>

        <AnimatedItem>
          <div className="p-4 bg-slate-700/30 rounded-xl flex items-center gap-4">
            <ServerIcon className="w-6 h-6 text-purple-400" />
            <div>
              <p className="text-sm text-slate-400">Network IP</p>
              <div className="flex items-center gap-2">
                <p className="text-white font-mono">{abuseData.ip}</p>
                <button 
                  className="text-slate-400 hover:text-white"
                  onClick={() => navigator.clipboard.writeText(abuseData.ip)}
                >
                  <ClipboardIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </AnimatedItem>
      </div>

      {/* Scores Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* VirusTotal Card */}
        <AnimatedItem>
          <div className="p-4 bg-slate-700/30 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-blue-400">
              <GlobeAltIcon className="w-5 h-5" />
              <h4 className="font-medium">VirusTotal Analysis</h4>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-3xl font-bold text-white">
                  {vtData.malicious_count}<span className="text-slate-400 text-lg">/{vtData.total_engines}</span>
                </p>
                <p className="text-sm text-slate-400">Malicious Engines</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${vtData.category === 'malicious' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                {vtData.category}
              </span>
            </div>
          </div>
        </AnimatedItem>

        {/* AbuseIPDB Card */}
        <AnimatedItem>
          <div className="p-4 bg-slate-700/30 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-purple-400">
              <ShieldExclamationIcon className="w-5 h-5" />
              <h4 className="font-medium">AbuseIPDB Report</h4>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-3xl font-bold text-white">
                  {abuseData.confidenceScore}<span className="text-slate-400 text-lg">/100</span>
                </p>
                <p className="text-sm text-slate-400">Confidence Score</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${threatColor === 'red' ? 'bg-red-500/20 text-red-400' : threatColor === 'orange' ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'}`}>
                {abuseData.category}
              </span>
            </div>
          </div>
        </AnimatedItem>
      </div>

      {/* Network Details */}
      <motion.div 
        className="grid md:grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Location */}
        <div className="p-4 bg-slate-700/30 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-emerald-400">
            <FlagIcon className="w-5 h-5" />
            <span className="text-sm">Location</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-white">{abuseData.country}</span>
          </div>
        </div>

        {/* Network Provider */}
        <div className="p-4 bg-slate-700/30 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-blue-400">
            <UserGroupIcon className="w-5 h-5" />
            <span className="text-sm">Network Provider</span>
          </div>
          <p className="text-white truncate">{abuseData.isp}</p>
        </div>

        {/* Last Reported */}
        <div className="p-4 bg-slate-700/30 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-amber-400">
            <ClockIcon className="w-5 h-5" />
            <span className="text-sm">Last Reported</span>
          </div>
          <p className="text-white">{new Date(abuseData.last_reported).toLocaleDateString()}</p>
        </div>
      </motion.div>

      {/* Threat Meter */}
      <motion.div 
        className="p-4 bg-slate-700/30 rounded-xl space-y-3"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
      >
        <div className="flex justify-between text-sm text-slate-400">
          <span>Combined Threat Level</span>
          <span>{threatIntel.combined_score}%</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-red-500 via-orange-500 to-green-500"
            style={{ width: `${threatIntel.combined_score}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${threatIntel.combined_score}%` }}
            transition={{ duration: 1.5, type: 'spring' }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400">
          <span>Low Risk</span>
          <span>High Risk</span>
        </div>
      </motion.div>

      {/* Additional Details */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-slate-700/30 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-purple-400">
            <LinkIcon className="w-5 h-5" />
            <span className="text-sm">Associated Hostnames</span>
          </div>
          <div className="space-y-1">
            {abuseData.hostnames?.map((hostname, i) => (
              <motion.div 
                key={i}
                className="text-sm text-white font-mono truncate"
                whileHover={{ x: 5 }}
              >
                {hostname}
              </motion.div>
            ))}
            {!abuseData.hostnames?.length && (
              <span className="text-sm text-slate-400">None detected</span>
            )}
          </div>
        </div>

        <div className="p-4 bg-slate-700/30 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-amber-400">
            <ShieldExclamationIcon className="w-5 h-5" />
            <span className="text-sm">Security Flags</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className={`px-2 py-1 rounded-full text-xs ${abuseData.is_tor ? 'bg-red-500/20 text-red-400' : 'bg-slate-700/50 text-slate-300'}`}>
              TOR Network
            </span>
            <span className={`px-2 py-1 rounded-full text-xs ${abuseData.is_whitelisted ? 'bg-green-500/20 text-green-400' : 'bg-slate-700/50 text-slate-300'}`}>
              Whitelisted
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}