import { useState } from 'react';
import { ChevronUpIcon, ClipboardIcon, DocumentDownloadIcon } from '@heroicons/react/outline';
import { jsPDF } from 'jspdf';

function SeverityBadge({ severity }) {
  const colors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800',
    critical: 'bg-purple-100 text-purple-800'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[severity] || 'bg-gray-100'}`}>
      {severity.toUpperCase()}
    </span>
  );
}

export default function AnomalyAccordion({ anomalies }) {
  const [expandedId, setExpandedId] = useState(null);

  // Group identical anomalies with counts
  const groupedAnomalies = anomalies.reduce((acc, anomaly) => {
    const key = `${anomaly.type}-${anomaly.message}`;
    if (!acc[key]) {
      acc[key] = { ...anomaly, count: 1 };
    } else {
      acc[key].count += 1;
    }
    return acc;
  }, {});

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const generateConfigSnippet = (anomaly) => {
    const snippets = {
      'Content-Security-Policy': `add_header Content-Security-Policy "default-src 'self'";`,
      'X-Frame-Options': `add_header X-Frame-Options "DENY";`,
      'Strict-Transport-Security': `add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload";`,
      'X-Content-Type-Options': `add_header X-Content-Type-Options "nosniff";`,
      'Referrer-Policy': `add_header Referrer-Policy "strict-origin-when-cross-origin";`
    };

    return snippets[anomaly.message.split(' ')[1]] || '# No automatic fix available\n# Please see recommendation above';
  };

  const downloadPdfReport = (anomaly) => {
    const doc = new jsPDF();
    
    // PDF Styling
    doc.setFont('helvetica');
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text('Security Scan Report', 105, 20, null, null, 'center');
    
    // Header Line
    doc.setDrawColor(29, 78, 216);
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);
    
    // Vulnerability Details
    doc.setFontSize(12);
    doc.text(`Vulnerability: ${anomaly.message}`, 20, 40);
    doc.text(`Severity: ${anomaly.severity.toUpperCase()}`, 20, 50);
    doc.text(`Occurrences: ${anomaly.count}`, 20, 60);
    
    // Recommendation Section
    doc.setFontSize(14);
    doc.text('Recommendation:', 20, 80);
    doc.setFontSize(12);
    const splitRec = doc.splitTextToSize(anomaly.recommendation, 170);
    doc.text(splitRec, 20, 90);
    
    // Quick Fix Section
    if (anomaly.type === 'security') {
      doc.setFontSize(14);
      doc.text('Quick Fix:', 20, 130);
      doc.setFontSize(10);
      doc.setFont('courier');
      const fixText = doc.splitTextToSize(generateConfigSnippet(anomaly), 170);
      doc.text(fixText, 20, 140);
    }
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 280, null, null, 'center');
    
    // Save PDF
    doc.save(`security-report-${anomaly.message.split(' ')[0]}.pdf`);
  };

  return (
    <div className="space-y-2">
      {Object.values(groupedAnomalies).map((anomaly) => {
        const id = `${anomaly.type}-${anomaly.message}`;
        const isExpanded = expandedId === id;
        
        return (
          <div key={id} className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
            <button
              onClick={() => toggleExpand(id)}
              className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
              aria-expanded={isExpanded}
            >
              <div className="flex items-start gap-3 text-left">
                <SeverityBadge severity={anomaly.severity} />
                <div>
                  <p className="font-medium text-gray-900">{anomaly.message}</p>
                  {anomaly.count > 1 && (
                    <span className="text-xs text-gray-500 mt-1">
                      {anomaly.count} occurrences
                    </span>
                  )}
                </div>
              </div>
              <ChevronUpIcon
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isExpanded && (
              <div className="p-4 border-t bg-gray-50">
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2 text-gray-900">Recommendation:</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{anomaly.recommendation}</p>
                </div>
                
                {anomaly.type === 'security' && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold mb-3 text-gray-900">Quick Fix:</h4>
                    <div className="relative group">
                      <pre className="p-3 bg-gray-800 text-gray-100 rounded-lg overflow-x-auto text-sm">
                        <code>{generateConfigSnippet(anomaly)}</code>
                      </pre>
                      <button
                        onClick={() => navigator.clipboard.writeText(generateConfigSnippet(anomaly))}
                        className="absolute top-2 right-2 p-1 bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-600"
                        aria-label="Copy to clipboard"
                      >
                        <ClipboardIcon className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => downloadPdfReport(anomaly)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                  >
                    <DocumentDownloadIcon className="-ml-1 mr-2 h-5 w-5" />
                    Download Full Report (PDF)
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}