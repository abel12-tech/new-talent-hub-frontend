"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import CompanyProfile from "./CompanyProfile"
import {
  Briefcase,
  Users,
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  DollarSign,
  BarChart3,
  Building2,
  Target,
  Award,
  Activity,
} from "lucide-react"
import { fetchEmployerJobs, deleteJob } from "../../store/slices/jobSlice"
import LoadingSpinner from "../common/LoadingSpinner"
import toast from "react-hot-toast"

const EmployerDashboard = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { employerJobs, isLoading } = useSelector((state) => state.jobs)

  const [showDeleteModal, setShowDeleteModal] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    dispatch(fetchEmployerJobs({ limit: 10 }))
  }, [dispatch])

  const handleDeleteJob = async (jobId) => {
    try {
      const result = await dispatch(deleteJob(jobId))
      if (deleteJob.fulfilled.match(result)) {
        toast.success("Job deleted successfully!")
        setShowDeleteModal(null)
      }
    } catch (error) {
      toast.error("Failed to delete job")
    }
  }

  // Calculate statistics
  const getJobStats = () => {
    const stats = {
      totalJobs: employerJobs.length,
      activeJobs: employerJobs.filter((job) => job.status === "active").length,
      totalApplications: employerJobs.reduce((sum, job) => sum + (job.applicationCount || 0), 0),
      avgApplicationsPerJob:
        employerJobs.length > 0
          ? Math.round(employerJobs.reduce((sum, job) => sum + (job.applicationCount || 0), 0) / employerJobs.length)
          : 0,
    }
    return stats
  }

  const stats = getJobStats()

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

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Building2 className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
                <p className="text-primary-foreground/80 text-lg">
                  {user?.profile?.companyName || "Your Company"} • Talent Acquisition
                </p>
                <p className="text-primary-foreground/70 mt-1">Manage your job postings and track applications</p>
              </div>
            </div>
            <div className="mt-6 lg:mt-0 flex flex-col sm:flex-row gap-3">
              <Link
                to="/post-job"
                className="bg-white text-primary px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Post New Job</span>
              </Link>
              <button
                onClick={() => setActiveTab("profile")}
                className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors flex items-center space-x-2"
              >
                <Building2 className="h-5 w-5" />
                <span>Company Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm">
        <div className="px-6 py-4 border-b border-border">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-3 px-1 border-b-2 font-semibold text-sm transition-colors ${
                activeTab === "overview"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Overview</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-3 px-1 border-b-2 font-semibold text-sm transition-colors ${
                activeTab === "profile"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Building2 className="h-4 w-4" />
                <span>Company Profile</span>
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-background rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Jobs</p>
                      <p className="text-2xl font-bold text-foreground">{stats.totalJobs}</p>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </div>

                <div className="bg-background rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Jobs</p>
                      <p className="text-2xl font-bold text-foreground">{stats.activeJobs}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                      <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-background rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Applications</p>
                      <p className="text-2xl font-bold text-foreground">{stats.totalApplications}</p>
                    </div>
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                      <Users className="h-6 w-6 text-accent" />
                    </div>
                  </div>
                </div>

                <div className="bg-background rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg per Job</p>
                      <p className="text-2xl font-bold text-foreground">{stats.avgApplicationsPerJob}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                      <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-background rounded-xl border border-border shadow-sm">
                <div className="px-6 py-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground flex items-center space-x-2">
                      <Award className="h-5 w-5 text-primary" />
                      <span>Your Job Postings</span>
                    </h2>
                    <Link to="/post-job" className="text-primary hover:text-primary/80 text-sm font-medium">
                      Post New Job →
                    </Link>
                  </div>
                </div>
                <div className="p-6">
                  {isLoading ? (
                    <div className="flex justify-center py-12">
                      <LoadingSpinner />
                    </div>
                  ) : employerJobs.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Briefcase className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">No job postings yet</h3>
                      <p className="text-muted-foreground mb-6">
                        Create your first job posting to start attracting top talent.
                      </p>
                      <Link
                        to="/post-job"
                        className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                      >
                        Post Your First Job
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {employerJobs.map((job) => (
                        <div
                          key={job._id}
                          className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all duration-200 hover:border-primary/20 group"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start space-x-4">
                                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Briefcase className="h-6 w-6 text-primary" />
                                  </div>
                                  <div>
                                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                                      {job.title}
                                    </h3>
                                    <p className="text-muted-foreground font-medium">{job.company}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                      job.status === "active"
                                        ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                                        : job.status === "closed"
                                          ? "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                                          : "bg-muted text-muted-foreground"
                                    }`}
                                  >
                                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                                  </span>
                                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                                    {formatJobType(job.jobType)}
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-4">
                                <div className="flex items-center space-x-2">
                                  <MapPin className="h-4 w-4" />
                                  <span>{job.location}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <DollarSign className="h-4 w-4" />
                                  <span>{formatSalary(job.salary)}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Users className="h-4 w-4" />
                                  <span className="font-medium text-primary">
                                    {job.applicationCount || 0} applications
                                  </span>
                                </div>
                              </div>

                              <p className="text-foreground line-clamp-2 mb-4">{job.description}</p>

                              {job.skills && job.skills.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {job.skills.slice(0, 5).map((skill, index) => (
                                    <span
                                      key={index}
                                      className="bg-muted text-foreground px-3 py-1 rounded-full text-sm"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                  {job.skills.length > 5 && (
                                    <span className="text-muted-foreground text-sm px-3 py-1">
                                      +{job.skills.length - 5} more
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="mt-6 lg:mt-0 lg:ml-8 flex flex-col space-y-3">
                              <Link
                                to={`/jobs/${job._id}`}
                                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2 justify-center text-sm font-medium"
                              >
                                <Eye className="h-4 w-4" />
                                <span>View Job</span>
                              </Link>
                              <Link
                                to={`/jobs/${job._id}/applications`}
                                className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors flex items-center space-x-2 justify-center text-sm font-medium"
                              >
                                <Users className="h-4 w-4" />
                                <span>Applications ({job.applicationCount || 0})</span>
                              </Link>
                              <button className="border border-border text-foreground px-4 py-2 rounded-lg hover:bg-muted transition-colors flex items-center space-x-2 justify-center text-sm font-medium">
                                <Edit className="h-4 w-4" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => setShowDeleteModal(job._id)}
                                className="border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center space-x-2 justify-center text-sm font-medium"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "profile" && <CompanyProfile />}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-xl max-w-md w-full p-6 border border-border shadow-lg">
            <h3 className="text-lg font-semibold text-foreground mb-4">Delete Job Posting</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete this job posting? This action cannot be undone and all associated
              applications will be removed.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteJob(showDeleteModal)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EmployerDashboard
