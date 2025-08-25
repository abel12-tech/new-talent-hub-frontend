"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Search, Users, ArrowLeft } from "lucide-react"
import { fetchJobApplications, updateApplicationStatus, clearError } from "../store/slices/applicationSlice"
import { fetchJobById } from "../store/slices/jobSlice"
import ApplicationCard from "../components/applications/ApplicationCard"
import ApplicationDetailModal from "../components/applications/ApplicationDetailModal"
import LoadingSpinner from "../components/common/LoadingSpinner"
import ErrorMessage from "../components/common/ErrorMessage"
import toast from "react-hot-toast"

const ManageApplications = () => {
  const { jobId } = useParams()
  const dispatch = useDispatch()
  const { jobApplications, isLoading, error } = useSelector((state) => state.applications)
  const { currentJob } = useSelector((state) => state.jobs)

  const [selectedApplication, setSelectedApplication] = useState(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    if (jobId) {
      dispatch(fetchJobApplications({ jobId }))
      dispatch(fetchJobById(jobId))
    }
  }, [dispatch, jobId])

  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  const handleViewDetails = (application) => {
    setSelectedApplication(application)
  }

  const handleCloseModal = () => {
    setSelectedApplication(null)
  }

  const handleStatusUpdate = async (applicationId, status, notes) => {
    try {
      const result = await dispatch(updateApplicationStatus({ applicationId, status, notes }))
      if (updateApplicationStatus.fulfilled.match(result)) {
        toast.success("Application status updated successfully!")
        // Refresh the applications list
        dispatch(fetchJobApplications({ jobId }))
      }
    } catch (error) {
      toast.error("Failed to update application status")
    }
  }

  // Filter and sort applications
  const filteredApplications = jobApplications
    .filter((app) => {
      if (statusFilter !== "all" && app.status !== statusFilter) return false
      if (
        searchTerm &&
        !app.applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !app.applicant.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
        return false
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt)
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt)
        case "name":
          return a.applicant.name.localeCompare(b.applicant.name)
        case "status":
          return a.status.localeCompare(b.status)
        default:
          return 0
      }
    })

  const getStatusCounts = () => {
    const counts = {
      all: jobApplications.length,
      applied: 0,
      shortlisted: 0,
      rejected: 0,
      hired: 0,
    }

    jobApplications.forEach((app) => {
      counts[app.status] = (counts[app.status] || 0) + 1
    })

    return counts
  }

  const statusCounts = getStatusCounts()

  if (isLoading && jobApplications.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center space-x-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Applications for {currentJob?.title || "Job"}</h1>
          <p className="text-muted-foreground">
            {currentJob?.company} • {jobApplications.length} application{jobApplications.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Error Message */}
        {error && <ErrorMessage message={error} className="mb-6" />}

        {/* Status Tabs */}
        <div className="bg-card rounded-lg shadow-sm border border-border mb-6">
          <div className="flex flex-wrap">
            {[
              { key: "all", label: "All Applications", count: statusCounts.all },
              { key: "applied", label: "Applied", count: statusCounts.applied },
              { key: "shortlisted", label: "Shortlisted", count: statusCounts.shortlisted },
              { key: "rejected", label: "Rejected", count: statusCounts.rejected },
              { key: "hired", label: "Hired", count: statusCounts.hired },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  statusFilter === tab.key
                    ? "border-primary text-primary bg-primary/10"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-card rounded-lg shadow-sm border border-border p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by applicant name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10 w-full md:w-64"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input-field">
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Name A-Z</option>
                  <option value="status">Status</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-card rounded-lg shadow-sm border border-border p-8">
              {jobApplications.length === 0 ? (
                <>
                  <h3 className="text-lg font-medium text-foreground mb-2">No applications yet</h3>
                  <p className="text-muted-foreground">Applications will appear here once candidates start applying.</p>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-medium text-foreground mb-2">No applications match your filters</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria.</p>
                  <button
                    onClick={() => {
                      setStatusFilter("all")
                      setSearchTerm("")
                    }}
                    className="btn-primary"
                  >
                    Clear Filters
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <ApplicationCard
                key={application._id}
                application={application}
                userRole="employer"
                onViewDetails={handleViewDetails}
                onStatusUpdate={handleStatusUpdate}
              />
            ))}
          </div>
        )}
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <ApplicationDetailModal
          application={selectedApplication}
          onClose={handleCloseModal}
          onStatusUpdate={handleStatusUpdate}
          userRole="employer"
        />
      )}
    </div>
  )
}

export default ManageApplications
