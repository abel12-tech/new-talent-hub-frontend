const ApplicationStatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case "applied":
        return {
          color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
          text: "Applied",
        }
      case "shortlisted":
        return {
          color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
          text: "Shortlisted",
        }
      case "rejected":
        return {
          color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
          text: "Rejected",
        }
      case "hired":
        return {
          color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
          text: "Hired",
        }
      default:
        return {
          color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
          text: "Unknown",
        }
    }
  }

  const config = getStatusConfig(status)

  return <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>{config.text}</span>
}

export default ApplicationStatusBadge
