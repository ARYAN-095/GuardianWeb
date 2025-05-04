import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldCheckIcon, SparklesIcon, ChartBarIcon } from '@heroicons/react/outline'


// Animation configurations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      when: "beforeChildren"
    }
  }
}

const itemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 20
    }
  }
}

const featureCards = [
  {
    icon: ShieldCheckIcon,
    title: "Security Audit",
    description: "Comprehensive security analysis with real-time threat detection"
  },
  {
    icon: ChartBarIcon,
    title: "Performance Metrics",
    description: "Detailed performance insights with actionable recommendations"
  },
  {
    icon: SparklesIcon,
    title: "SEO Optimization",
    description: "Improve search ranking with expert SEO suggestions"
  }
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 overflow-hidden">
      {/* Background elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 overflow-hidden"
      >
        <motion.div
          className="absolute -top-20 -left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [180, 0, 180]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center"
        >
          {/* Trust badge */}
          <motion.div variants={itemVariants}>
            <motion.div 
              className="inline-flex items-center bg-white/10 rounded-full px-4 py-2 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-sm font-semibold text-purple-300">
                Trusted by security teams worldwide
              </span>
            </motion.div>
          </motion.div>

          {/* Main heading */}
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text text-transparent mb-6"
          >
            Website Health Analyzer
          </motion.h1>

          {/* Subheading */}
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-12"
          >
            Protect your web presence with comprehensive security scans, 
            performance audits, and SEO optimization in one powerful platform
          </motion.p>

          {/* CTA Button */}
          <motion.div variants={itemVariants}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/scan" 
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-2xl shadow-blue-500/30"
              >
                <ShieldCheckIcon className="w-6 h-6 mr-3" />
                Start Free Scan
              </Link>
            </motion.div>
          </motion.div>

          {/* Feature cards */}
          <motion.div 
            variants={containerVariants}
            className="grid md:grid-cols-3 gap-8 mt-20"
          >
            {featureCards.map((card, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
                whileHover={{ y: -10 }}
              >
                <card.icon className="w-12 h-12 text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {card.title}
                </h3>
                <p className="text-gray-400">{card.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Terminal demo */}
          <motion.div 
            variants={itemVariants}
            className="mt-20"
          >
            <motion.div 
              className="relative max-w-4xl mx-auto bg-white/5 rounded-2xl p-1 shadow-2xl border border-white/10 backdrop-blur-xl"
              animate={{ y: [0, -20, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl" />
              <div className="relative p-8">
                <div className="flex space-x-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="bg-slate-900 rounded-lg p-6 text-left">
                  <div className="text-purple-400 font-mono">
                    $ webscan analyze --url yourwebsite.com
                  </div>
                  <div className="mt-4 text-green-400 font-mono">
                    ✔️  Found 42 performance optimizations
                  </div>
                  <div className="text-blue-400 font-mono">
                    ✔️  Detected 18 security improvements
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}