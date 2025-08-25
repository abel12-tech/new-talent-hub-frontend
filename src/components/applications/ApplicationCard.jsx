"use client"

import { useState } from "react"
import { Calendar, MapPin, DollarSign, Eye, MessageSquare } from "lucide-react"
import ApplicationStatusBadge from "./ApplicationStatusBadge"

const ApplicationCard = ({ application, userRole = "applicant", onStatusUpdate, onViewDetails }) => {
  const [showNotes, setShowNotes] = useState(false)

  const formatSalary = (salary) => {
    if (!salary || (!salary.min && !salary.max)) return "Not specified"
    if (salary.min && salary.max) {
      return `$${salary.min.toLocaleString()} - $${salary.max.toLocaleString()}`
    }
    if (salary.min) return `From $${salary.min.toLocaleString()}`
    if (salary.max) return `Up to $${salary.max.toLocaleString()}`
  }

  const formatJobType = (type) => {
    if (!type) return "Not specified"
    return type
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                {userRole === "applicant" ? application.job.title : application.applicant.name}
              </h3>
              <p className="text-muted-foreground font-medium">
                {userRole === "applicant" ? application.job.company : application.applicant.email}
              </p>
            </div>
            <ApplicationStatusBadge status={application.status} />
          </div>

          {userRole === "applicant" && (
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{application.job.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <DollarSign className="h-4 w-4" />
                <span>{formatSalary(application.job.salary)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs">
                  {formatJobType(application.job.jobType)}
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>Applied {new Date(application.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {application.coverLetter && (
            <div className="mb-3">
              <p className="text-foreground line-clamp-2">{application.coverLetter}</p>
            </div>
          )}

          {application.notes && userRole === "employer" && (
            <div className="mb-3">
              <button
                onClick={() => setShowNotes(!showNotes)}
                className="flex items-center space-x-1 text-primary hover:text-primary/80 text-sm"
              >
                <MessageSquare className="h-4 w-4" />
                <span>{showNotes ? "Hide" : "Show"} Notes</span>
              </button>
              {showNotes && (
                <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-foreground">{application.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-4 md:mt-0 md:ml-6 flex flex-col space-y-2">
          <button
            onClick={() => onViewDetails(application)}
            className="btn-primary flex items-center space-x-2 justify-center"
          >
            <Eye className="h-4 w-4" />
            <span>View Details</span>
          </button>

          {userRole === "employer" && onStatusUpdate && (
            <select
              value={application.status}
              onChange={(e) => onStatusUpdate(application._id, e.target.value)}
              className="input-field text-sm"
            >
              <option value="applied">Applied</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
              <option value="hired">Hired</option>
            </select>
          )}
        </div>
      </div>
    </div>
  )
}

export default ApplicationCard
