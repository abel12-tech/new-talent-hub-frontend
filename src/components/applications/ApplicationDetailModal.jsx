"use client"

import { useState } from "react"
import { X, MapPin, DollarSign, FileText, Mail, User, Save } from "lucide-react"
import { useSelector } from "react-redux"
import ApplicationStatusBadge from "./ApplicationStatusBadge"
import LoadingSpinner from "../common/LoadingSpinner"

const ApplicationDetailModal = ({ application, onClose, onStatusUpdate, userRole = "applicant" }) => {
  const [isUpdating, setIsUpdating] = useState(false)
  const [notes, setNotes] = useState(application.notes || "")
  const [status, setStatus] = useState(application.status)

  const { user } = useSelector((state) => state.auth)

  const formatSalary = (salary) => {
    if (!salary || (!salary.min && !salary.max)) return "Not specified"
    if (salary.min && salary.max) {
      return `$${salary.min.toLocaleString()} - $${salary.max.toLocaleString()}`
    }
    if (salary.min) return `From $${salary.min.toLocaleString()}`
    if (salary.max) return `Up to $${salary.max.toLocaleString()}`
  }

  const formatJobType = (type) => {
    return type
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const handleStatusUpdate = async () => {
    if (!onStatusUpdate) return

    setIsUpdating(true)
    try {
      await onStatusUpdate(application._id, status, notes)
      onClose()
    } catch (error) {
      console.error("Failed to update application:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-background dark:bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-border shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {userRole === "applicant"
                  ? `Application for ${application.job.title}`
                  : `Application from ${application.applicant.name}`}
              </h2>
              <p className="text-muted-foreground">
                {userRole === "applicant" ? application.job.company : application.applicant.email}
              </p>
            </div>
            <ApplicationStatusBadge status={status} />
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            disabled={isUpdating}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Application Details */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Application Details</h3>
                <div className="bg-muted/50 p-4 rounded-lg space-y-3 border border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Applied Date</span>
                    <span className="font-medium text-foreground">
                      {new Date(application.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <ApplicationStatusBadge status={status} />
                  </div>
                  {application.updatedAt !== application.createdAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Last Updated</span>
                      <span className="font-medium text-foreground">
                        {new Date(application.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Cover Letter */}
              {application.coverLetter && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Cover Letter</h3>
                  <div className="bg-muted/50 p-4 rounded-lg border border-border">
                    <p className="text-foreground whitespace-pre-line">{application.coverLetter}</p>
                  </div>
                </div>
              )}

              {/* Resume */}
              {application.resume && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Resume</h3>
                  <div className="bg-muted/50 p-4 rounded-lg border border-border">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span className="text-foreground">Resume attached</span>
                      <button className="text-primary hover:text-primary/80 text-sm">Download</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Employer Notes */}
              {userRole === "employer" && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Internal Notes</h3>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                    placeholder="Add internal notes about this application..."
                  />
                </div>
              )}

              {/* Applicant Notes (read-only for applicant) */}
              {userRole === "applicant" && application.notes && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Employer Notes</h3>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
                    <p className="text-foreground">{application.notes}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Job Information (for applicant view) */}
              {userRole === "applicant" && (
                <div className="bg-muted/50 p-4 rounded-lg border border-border">
                  <h3 className="font-semibold text-foreground mb-3">Job Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-muted-foreground text-sm">Position</span>
                      <p className="font-medium text-foreground">{application.job.title}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-sm">Company</span>
                      <p className="font-medium text-foreground">{application.job.company}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{application.job.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{formatSalary(application.job.salary)}</span>
                    </div>
                    <div>
                      <span className="bg-muted text-foreground px-2 py-1 rounded text-xs border border-border">
                        {formatJobType(application.job.jobType)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Applicant Information (for employer view) */}
              {userRole === "employer" && (
                <div className="bg-muted/50 p-4 rounded-lg border border-border">
                  <h3 className="font-semibold text-foreground mb-3">Applicant Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{application.applicant.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{application.applicant.email}</span>
                    </div>
                    {application.applicant.profile?.skills && (
                      <div>
                        <span className="text-muted-foreground text-sm">Skills</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {application.applicant.profile.skills.slice(0, 5).map((skill, index) => (
                            <span
                              key={index}
                              className="bg-background text-foreground px-2 py-1 rounded text-xs border border-border"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Status Update (for employer) */}
              {userRole === "employer" && onStatusUpdate && (
                <div className="bg-muted/50 p-4 rounded-lg border border-border">
                  <h3 className="font-semibold text-foreground mb-3">Update Status</h3>
                  <div className="space-y-3">
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                    >
                      <option value="applied">Applied</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="rejected">Rejected</option>
                      <option value="hired">Hired</option>
                    </select>
                    <button
                      onClick={handleStatusUpdate}
                      disabled={isUpdating || (status === application.status && notes === application.notes)}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      {isUpdating ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          <span>Update Application</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApplicationDetailModal
