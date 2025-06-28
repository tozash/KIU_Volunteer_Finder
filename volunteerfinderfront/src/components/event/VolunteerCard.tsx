import { useState } from 'react'
import type { Application } from '@/lib/api'

interface Props {
  application: Application
  onStatusChange?: (id: string, status: 'accepted' | 'denied' | 'canceled') => void
  questions?: string[]
}

const VolunteerCard = ({ application, onStatusChange, questions }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false)

  // Format the submitted_at timestamp
  const formatDate = (timestamp?: { _seconds: number; _nanoseconds: number }) => {
    if (!timestamp) return 'Unknown'
    const date = new Date(timestamp._seconds * 1000)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get all question-answer pairs from the answers object
  const getQuestionAnswerPairs = () => {
    if (!application.answers || typeof application.answers !== 'object') {
      return []
    }
    return Object.entries(application.answers)
  }

  const questionAnswerPairs = getQuestionAnswerPairs()

  return (
    <div className="border rounded p-4">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold">Application {application.application_id.slice(-8)}</h3>
          <p className="text-sm text-gray-500">Status: {application.status}</p>
          <p className="text-sm text-gray-500">Applicant: {application.applicant_user_id}</p>
          <p className="text-sm text-gray-500">Submitted: {formatDate(application.submitted_at)}</p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2 ml-4">
          {application.status === 'pending' && (
            <>
              <button
                onClick={() => onStatusChange?.(application.application_id, 'accepted')}
                className="px-2 py-1 bg-support text-white rounded"
              >
                Accept
              </button>
              <button
                onClick={() => onStatusChange?.(application.application_id, 'denied')}
                className="px-2 py-1 bg-accent text-white rounded"
              >
                Deny
              </button>
            </>
          )}
          {application.status !== 'canceled' && (
            <button
              onClick={() => onStatusChange?.(application.application_id, 'canceled')}
              className="px-2 py-1 bg-gray-300 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Questions and Answers Section */}
      {questionAnswerPairs.length > 0 && (
        <div className="mt-3 border-t pt-3">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold text-sm">Application Responses</h4>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              {isExpanded ? 'Hide' : 'Show'} Details
            </button>
          </div>
          
          {isExpanded ? (
            <div className="space-y-3">
              {questionAnswerPairs.map(([question, answer], idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded">
                  <p className="font-medium text-sm text-gray-700 mb-1">
                    {question}
                  </p>
                  <p className="text-sm text-gray-900">
                    {answer || <span className="text-gray-400 italic">(no answer)</span>}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              <p>{questionAnswerPairs.length} questions answered • Click "Show Details" to view responses</p>
            </div>
          )}
        </div>
      )}
      
      {/* No Questions Available */}
      {questionAnswerPairs.length === 0 && (
        <div className="mt-3 border-t pt-3">
          <p className="text-sm text-gray-500 italic">No application responses available</p>
        </div>
      )}
    </div>
  )
}

export default VolunteerCard