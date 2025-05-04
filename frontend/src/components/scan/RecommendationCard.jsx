import { ClipboardDocumentIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

export default function RecommendationCard({ recommendation }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(recommendation)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-start gap-3">
        <p className="text-gray-800 flex-1">{recommendation}</p>
        <button
          onClick={handleCopy}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
          aria-label="Copy recommendation"
        >
          {copied ? (
            <span className="text-sm text-green-600">Copied!</span>
          ) : (
            <ClipboardDocumentIcon className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  )
}