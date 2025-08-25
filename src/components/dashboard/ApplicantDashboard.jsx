"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import {
  FileText,
  Clock,
  CheckCircle,
  Search,
  User,
  MapPin,
  Briefcase,
  TrendingUp,
  Star,
  Award,
  Target,
} from "lucide-react"
import { fetchUserApplications } from "../../store/slices/applicationSlice"
import { fetchJobs } from "../../store/slices/jobSlice"
import ApplicationCard from "../applications/ApplicationCard"
import ApplicationDetailModal from "../applications/ApplicationDetailModal"
import ProfileManager from "../profile/ProfileManager"
import LoadingSpinner from "../common/LoadingSpinner"

const ApplicantDashboard = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { userApplications, isLoading: applicationsLoading } = useSelector((state) => state.applications)
  const { jobs, isLoading: jobsLoading } = useSelector((state) => state.jobs)

  const [selectedApplication, setSelectedApplication] = useState(null)
  const [showProfileManager, setShowProfileManager] = useState(false)

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserApplications({ userId: user.id, params: { limit: 5 } }))
      dispatch(fetchJobs({ limit: 6 }))
    }
  }, [dispatch, user])

  const handleViewDetails = (application) => {
    setSelectedApplication(application)
  }

  const handleCloseModal = () => {
    setSelectedApplication(null)
  }

  const handleOpenProfileManager = () => {
    setShowProfileManager(true)
  }

  const handleCloseProfileManager = () => {
    setShowProfileManager(false)
  }

  const getApplicationStats = () => {
    const stats = {
      total: userApplications.length,
      applied: 0,
      shortlisted: 0,
      rejected: 0,
      hired: 0,
    }

    userApplications.forEach((app) => {
      stats[app.status] = (stats[app.status] || 0) + 1
    })

    return stats
  }

  const stats = getApplicationStats()

  return (
    <div className="space-y-8">
      {/* Hero Section with Profile Overview */}
      <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <User className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
                <p className="text-primary-foreground/80 text-lg">Ready to find your next opportunity?</p>
                {user?.profile?.title && <p className="text-primary-foreground/70 mt-1">{user.profile.title}</p>}
              </div>
            </div>
            <div className="mt-6 md:mt-0 flex flex-col sm:flex-row gap-3">
              <Link
                to="/jobs"
                className="bg-white text-primary px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <Search className="h-4 w-4" />
                <span>Browse Jobs</span>
              </Link>
              <button
                onClick={handleOpenProfileManager}
                className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors flex items-center space-x-2"
              >
                <User className="h-4 w-4" />
                <span>Update Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards with Modern Design */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Applications</p>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">In Progress</p>
              <p className="text-2xl font-bold text-foreground">{stats.applied + stats.shortlisted}</p>
            </div>
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
              <Clock className="h-6 w-6 text-accent" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Success</p>
              <p className="text-2xl font-bold text-foreground">{stats.hired}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Response Rate</p>
              <p className="text-2xl font-bold text-foreground">
                {stats.total > 0 ? Math.round(((stats.shortlisted + stats.hired) / stats.total) * 100) : 0}%
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Applications with Enhanced Design */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-xl border border-border shadow-sm">
            <div className="px-6 py-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>Recent Applications</span>
                </h2>
                <Link to="/applications" className="text-primary hover:text-primary/80 text-sm font-medium">
                  View All →
                </Link>
              </div>
            </div>
            <div className="p-6">
              {applicationsLoading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner />
                </div>
              ) : userApplications.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No applications yet</h3>
                  <p className="text-muted-foreground mb-6">Start applying for jobs to track your progress here.</p>
                  <Link
                    to="/jobs"
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Browse Jobs
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {userApplications.slice(0, 3).map((application) => (
                    <ApplicationCard
                      key={application._id}
                      application={application}
                      userRole="applicant"
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Sidebar */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                <Star className="h-5 w-5 text-primary" />
                <span>Profile</span>
              </h3>
              <button
                onClick={handleOpenProfileManager}
                className="text-primary hover:text-primary/80 text-sm font-medium"
              >
                Edit
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center">
                  <span className="text-white font-semibold">{user?.name?.charAt(0)?.toUpperCase()}</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{user?.name}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              {user?.profile?.title && (
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-sm font-medium text-foreground">{user.profile.title}</p>
                </div>
              )}

              {user?.profile?.skills && user.profile.skills.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Top Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {user.profile.skills.slice(0, 4).map((skill, index) => (
                      <span
                        key={index}
                        className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Profile Strength</span>
                  <span className="text-foreground font-semibold">75%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "75%" }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
              <Target className="h-5 w-5 text-primary" />
              <span>Quick Actions</span>
            </h3>
            <div className="space-y-3">
              <Link
                to="/jobs"
                className="w-full flex items-center space-x-3 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors group"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Search className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Browse Jobs</p>
                  <p className="text-xs text-muted-foreground">Find new opportunities</p>
                </div>
              </Link>

              <Link
                to="/applications"
                className="w-full flex items-center space-x-3 p-3 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors group"
              >
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <FileText className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-foreground">My Applications</p>
                  <p className="text-xs text-muted-foreground">Track your progress</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Application Insights */}
          {stats.total > 0 && (
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
                <Award className="h-5 w-5 text-primary" />
                <span>Application Insights</span>
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-foreground">Applied</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">{stats.applied}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-foreground">Shortlisted</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">{stats.shortlisted}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-foreground">Hired</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">{stats.hired}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-foreground">Rejected</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">{stats.rejected}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recommended Jobs with Card-Based Layout */}
      <div className="bg-card rounded-xl border border-border shadow-sm">
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground flex items-center space-x-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <span>Recommended for You</span>
            </h2>
            <Link to="/jobs" className="text-primary hover:text-primary/80 text-sm font-medium">
              View All Jobs →
            </Link>
          </div>
        </div>
        <div className="p-6">
          {jobsLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.slice(0, 6).map((job) => (
                <div
                  key={job._id}
                  className="bg-background border border-border rounded-xl p-6 hover:shadow-md transition-all duration-200 hover:border-primary/20 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                      {job.jobType?.replace("-", " ") || "Full-time"}
                    </span>
                  </div>

                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3">{job.company}</p>

                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>

                  <p className="text-foreground text-sm line-clamp-2 mb-4">{job.description}</p>

                  <Link
                    to={`/jobs/${job._id}`}
                    className="inline-flex items-center text-primary hover:text-primary/80 text-sm font-medium group-hover:underline"
                  >
                    View Details →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <ApplicationDetailModal application={selectedApplication} onClose={handleCloseModal} userRole="applicant" />
      )}

      {/* ProfileManager Modal */}
      {showProfileManager && <ProfileManager onClose={handleCloseProfileManager} />}
    </div>
  )
}

export default ApplicantDashboard
