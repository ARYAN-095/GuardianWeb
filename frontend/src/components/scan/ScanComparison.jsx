export default function ScanComparison({ comparison }) {
    if (!comparison) return null
  
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-bold mb-4">Changes Since Last Scan</h2>
        
        <div className="grid md:grid-cols-3 gap-4">
          {/* Resolved Issues */}
          <div className="border rounded-lg p-4 bg-green-50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <h3 className="font-medium">Resolved Issues</h3>
              <span className="ml-auto bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                {comparison.resolved_issues.length}
              </span>
            </div>
            <ul className="space-y-2">
              {comparison.resolved_issues.slice(0, 3).map((issue, i) => (
                <li key={i} className="text-sm text-green-700 truncate">
                  {issue}
                </li>
              ))}
              {comparison.resolved_issues.length > 3 && (
                <li className="text-xs text-green-600">
                  +{comparison.resolved_issues.length - 3} more
                </li>
              )}
            </ul>
          </div>
  
          {/* Persistent Issues */}
          <div className="border rounded-lg p-4 bg-yellow-50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <h3 className="font-medium">Ongoing Issues</h3>
              <span className="ml-auto bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                {comparison.persistent_issues.length}
              </span>
            </div>
            <ul className="space-y-2">
              {comparison.persistent_issues.slice(0, 3).map((issue, i) => (
                <li key={i} className="text-sm text-yellow-700 truncate">
                  {issue}
                </li>
              ))}
              {comparison.persistent_issues.length > 3 && (
                <li className="text-xs text-yellow-600">
                  +{comparison.persistent_issues.length - 3} more
                </li>
              )}
            </ul>
          </div>
  
          {/* New Issues */}
          <div className="border rounded-lg p-4 bg-red-50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <h3 className="font-medium">New Issues</h3>
              <span className="ml-auto bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                {comparison.new_issues.length}
              </span>
            </div>
            <ul className="space-y-2">
              {comparison.new_issues.slice(0, 3).map((issue, i) => (
                <li key={i} className="text-sm text-red-700 truncate">
                  {issue}
                </li>
              ))}
              {comparison.new_issues.length > 3 && (
                <li className="text-xs text-red-600">
                  +{comparison.new_issues.length - 3} more
                </li>
              )}
            </ul>
          </div>
        </div>
  
        {comparison.risk_score_change && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm">
              Overall risk score changed by 
              <span className={`font-medium ${
                comparison.risk_score_change < 0 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {comparison.risk_score_change > 0 ? '+' : ''}
                {comparison.risk_score_change} points
              </span>
            </p>
          </div>
        )}
      </div>
    )
  }