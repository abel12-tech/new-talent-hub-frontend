"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Search, Calendar } from "lucide-react"
import { fetchUserApplications, clearError } from "../store/slices/applicationSlice"
import ApplicationCard from "../components/applications/ApplicationCard"
import ApplicationDetailModal from "../components/applications/ApplicationDetailModal"
import LoadingSpinner from "../components/common/LoadingSpinner"
import ErrorMessage from "../components/common/ErrorMessage"

const Applications = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { userApplications, isLoading, error, pagination } = useSelector((state) => state.applications)

  const [selectedApplication, setSelectedApplication] = useState(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserApplications({ userId: user.id }))
    }
  }, [dispatch, user])

  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  const handleViewDetails = (application) => {
    setSelectedApplication(application)
  }

  const handleCloseModal = () => {
    setSelectedApplication(null)
  }

  // Filter and sort applications
  const filteredApplications = userApplications
    .filter((app) => {
      if (statusFilter !== "all" && app.status !== statusFilter) return false
      if (
        searchTerm &&
        !app.job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !app.job.company.toLowerCase().includes(searchTerm.toLowerCase())
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
        case "company":
          return a.job.company.localeCompare(b.job.company)
        case "position":
          return a.job.title.localeCompare(b.job.title)
        default:
          return 0
      }
    })

  const getStatusCounts = () => {
    const counts = {
      all: userApplications.length,
      applied: 0,
      shortlisted: 0,
      rejected: 0,
      hired: 0,
    }

    userApplications.forEach((app) => {
      counts[app.status] = (counts[app.status] || 0) + 1
    })

    return counts
  }

  const statusCounts = getStatusCounts()

  if (isLoading && userApplications.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Applications</h1>
          <p className="text-muted-foreground">Track the status of your job applications</p>
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
                  placeholder="Search by job title or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10 w-full md:w-64"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input-field">
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="company">Company A-Z</option>
                  <option value="position">Position A-Z</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-card rounded-lg shadow-sm border border-border p-8">
              {userApplications.length === 0 ? (
                <>
                  <h3 className="text-lg font-medium text-foreground mb-2">No applications yet</h3>
                  <p className="text-muted-foreground mb-4">Start applying for jobs to see your applications here.</p>
                  <button onClick={() => (window.location.href = "/jobs")} className="btn-primary">
                    Browse Jobs
                  </button>
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
                userRole="applicant"
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => dispatch(fetchUserApplications({ userId: user.id, params: { page } }))}
                  className={`px-4 py-2 rounded-lg ${
                    page === pagination.current
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-foreground hover:bg-muted border border-border"
                  } transition-colors`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <ApplicationDetailModal application={selectedApplication} onClose={handleCloseModal} userRole="applicant" />
      )}
    </div>
  )
}

export default Applications
