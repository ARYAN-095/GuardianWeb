// components/dashboard/RiskMeter.jsx
import { motion } from 'framer-motion';
import { LightningBoltIcon} from '@heroicons/react/outline';

export default function RiskMeter({ score, level }) {
  const levels = {
    critical: { color: 'bg-red-500', label: 'Critical Risk' },
    high: { color: 'bg-orange-500', label: 'High Risk' },
    medium: { color: 'bg-yellow-500', label: 'Medium Risk' },
    low: { color: 'bg-green-500', label: 'Low Risk' }
  };

  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-xl"
    >
      <div className="flex items-center gap-4 mb-4">
        <LightningBoltIcon className="w-8 h-8 text-purple-400" />
        <h3 className="text-xl font-semibold text-white">Risk Assessment</h3>
      </div>
      
      <div className="relative w-full h-48 flex items-center justify-center">
        <div className="absolute w-40 h-40 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-xl" />
        
        <motion.div 
          className="relative w-32 h-32 rounded-full"
          style={{
            background: `conic-gradient(
              ${levels[level].color} ${3.6 * score}deg,
              #334155 0
            )`
          }}
          initial={{ rotate: -90 }}
          animate={{ rotate: -90 + (3.6 * score) }}
          transition={{ duration: 1.5, type: 'spring' }}
        >
          <div className="absolute inset-2 bg-slate-900 rounded-full flex items-center justify-center">
            <span className="text-3xl font-bold text-white">{score}</span>
          </div>
        </motion.div>
      </div>
      
      <div className="text-center mt-4">
        <span className={`px-3 py-1 rounded-full ${levels[level].color} text-white text-sm`}>
          {levels[level].label}
        </span>
      </div>
    </motion.div>
  );
}