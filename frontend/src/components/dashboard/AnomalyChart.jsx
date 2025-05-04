// components/dashboard/AnomalyChart.jsx
import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

export default function AnomalyChart({ anomalies }) {
  const chartData = {
    labels: ['Security', 'Performance', 'SEO', 'Accessibility'],
    datasets: [{
      label: 'Anomalies',
      data: [
        anomalies.filter(a => a.type === 'security').length,
        anomalies.filter(a => a.type === 'performance').length,
        anomalies.filter(a => a.type === 'seo').length,
        anomalies.filter(a => a.type === 'accessibility').length
      ],
      backgroundColor: [
        'rgba(239, 68, 68, 0.7)',
        'rgba(245, 158, 11, 0.7)',
        'rgba(16, 185, 129, 0.7)',
        'rgba(139, 92, 246, 0.7)'
      ],
      borderColor: [
        '#ef4444',
        '#f59e0b',
        '#10b981',
        '#8b5cf6'
      ],
      borderWidth: 1
    }]
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-xl"
    >
      <h3 className="text-xl font-semibold text-white mb-6">Anomaly Distribution</h3>
      <div className="h-64">
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
            },
            scales: {
              y: {
                ticks: { color: '#94a3b8' },
                grid: { color: '#334155' }
              },
              x: {
                ticks: { color: '#94a3b8' },
                grid: { color: '#334155' }
              }
            }
          }}
        />
      </div>
    </motion.div>
  );
}   