// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheckIcon, SparklesIcon, ChartBarIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import Home from './pages/Home';
import DashboardLayout from './components/DashboardLayout';
import screenshot from './assets/screenshot.png';
import client1 from './assets/clients/google.svg';
import client2 from './assets/clients/microsoft.svg';
import client3 from './assets/clients/amazon.svg';
import client4 from './assets/clients/ibm.svg';
import ScanResults from './pages/ScanResults'

// Sample scan data (replace with actual data from your API)
const scanData = {
  risk_score: 82,
  risk_level: 'high',
  anomalies: [],
  threat_intel: {
    virustotal: { malicious_count: 3, total_engines: 94 },
    abuse_ip_db: { confidenceScore: 15 },
    combined_score: { score: 45 }
  },
  scan_metadata: {
    scan_date: new Date().toISOString()
  }
};

const CLIENTS = [client1, client2, client3, client4];
const GRADIENT = 'bg-gradient-to-br from-indigo-900 via-blue-900 to-emerald-900';
const ANIMATION_DURATION = 0.6;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
      duration: ANIMATION_DURATION
    }
  }
};

const itemVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      duration: ANIMATION_DURATION
    }
  }
};

const featureCards = [
  { icon: ShieldCheckIcon, title: "Security Audit", description: "Real-time vulnerability detection" },
  { icon: ChartBarIcon, title: "Performance Insights", description: "Core Web Vital metrics analysis" },
  { icon: SparklesIcon, title: "SEO Optimization", description: "Search ranking improvements" }
];

function App() {
  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <div className={`min-h-screen ${GRADIENT} overflow-hidden relative`}>
              {/* Animated background elements */}
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.1 }}
                transition={{ duration: 4, repeat: Infinity, repeatType: 'mirror' }}
                className="absolute inset-0 bg-gradient-radial from-white/20 to-transparent"
              />

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                  className="text-center"
                >
                  {/* Trusted by section */}
                  <motion.div variants={itemVariants} className="mb-16">
                    <div className="inline-flex flex-col items-center space-y-4">
                      <span className="text-sm text-emerald-200 font-medium">
                        Trusted by industry leaders
                      </span>
                      <div className="flex flex-wrap justify-center gap-8">
                        {CLIENTS.map((logo, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.1 }}
                            className="h-12 w-32 grayscale hover:grayscale-0 transition-all"
                          >
                            <img src={logo} alt="Client logo" className="h-full w-full object-contain" />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Main content */}
                  <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-300 to-emerald-400 bg-clip-text text-transparent mb-6 leading-tight">
                    Next-Gen Website<br />Health Analytics
                  </motion.h1>

                  <motion.p variants={itemVariants} className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
                    Comprehensive website analysis powered by AI-driven insights and real-time monitoring
                  </motion.p>

                  {/* CTA Section */}
                  <motion.div variants={itemVariants} className="mb-20">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-block"
                    >
                      <Link
                        to="/dashboard"
                        className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 text-white shadow-2xl shadow-blue-500/30 hover:shadow-emerald-500/40 transition-all"
                      >
                        <ArrowPathIcon className="w-6 h-6 mr-3 animate-spin-once" />
                        Start Free Analysis
                      </Link>
                    </motion.div>
                  </motion.div>

                  {/* Feature cards */}
                  <motion.div variants={containerVariants} className="grid md:grid-cols-3 gap-8 mb-24">
                    {featureCards.map((card, index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        whileHover={{ y: -10, rotate: -1 }}
                        className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-emerald-400/30 transition-all cursor-pointer"
                      >
                        <card.icon className="w-12 h-12 text-emerald-400 mb-6" />
                        <h3 className="text-2xl font-semibold text-white mb-3">{card.title}</h3>
                        <p className="text-gray-400 leading-relaxed">{card.description}</p>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Screenshot section */}
                  <motion.div
                    variants={itemVariants}
                    initial={{ scale: 0.95, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 hover:border-emerald-400/20 transition-all"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-emerald-500/10" />
                    <img
                      src={screenshot}
                      alt="Dashboard preview"
                      className="w-full h-auto object-contain"
                    />
                  </motion.div>
                </motion.div>
              </div>
            </div>
          } 
        />
        
      <Route 
  path="/dashboard" 
  element={<DashboardLayout />} 
/>
    </Router>
  );
}

export default App;