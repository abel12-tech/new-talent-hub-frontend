import { AlertCircle } from "lucide-react"

const ErrorMessage = ({ message, className = "" }) => {
  if (!message) return null

  return (
    <div
      className={`bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center space-x-2 transition-colors ${className}`}
    >
      <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 flex-shrink-0" />
      <p className="text-red-700 dark:text-red-300">{message}</p>
    </div>
  )
}

export default ErrorMessage
