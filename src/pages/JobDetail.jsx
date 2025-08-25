"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { MapPin, DollarSign, Calendar, Users, Briefcase, ArrowLeft, ExternalLink, CheckCircle } from "lucide-react"
import { fetchJobById, clearCurrentJob } from "../store/slices/jobSlice"
import { applyForJob } from "../store/slices/applicationSlice"
import LoadingSpinner from "../components/common/LoadingSpinner"
import ErrorMessage from "../components/common/ErrorMessage"
import ApplicationModal from "../components/jobs/ApplicationModal"
import toast from "react-hot-toast"

const JobDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [showApplicationModal, setShowApplicationModal] = useState(false)

  const { currentJob: job, isLoading, error } = useSelector((state) => state.jobs)
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const { userApplications } = useSelector((state) => state.applications)

  // Check if user has already applied
  const hasApplied = userApplications.some((app) => app.job._id === id)

  useEffect(() => {
    if (id) {
      dispatch(fetchJobById(id))
    }

    return () => {
      dispatch(clearCurrentJob())
    }
  }, [dispatch, id])

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: `/jobs/${id}` } } })
      return
    }

    if (user?.role !== "applicant") {
      toast.error("Only job seekers can apply for jobs")
      return
    }

    setShowApplicationModal(true)
  }

  const handleApplicationSubmit = async (applicationData) => {
    try {
      const result = await dispatch(
        applyForJob({
          jobId: id,
          ...applicationData,
        }),
      )

      if (applyForJob.fulfilled.match(result)) {
        toast.success("Application submitted successfully!")
        setShowApplicationModal(false)
      }
    } catch (error) {
      toast.error("Failed to submit application")
    }
  }

  const formatSalary = (salary) => {
    if (!salary || (!salary.min && !salary.max)) return "Salary not specified"
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorMessage message={error} />
          <div className="text-center mt-6">
            <button onClick={() => navigate("/jobs")} className="btn-primary">
              Back to Jobs
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-muted-foreground text-lg">Job not found</p>
            <button onClick={() => navigate("/jobs")} className="btn-primary mt-4">
              Back to Jobs
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/jobs")}
          className="flex items-center space-x-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Jobs</span>
        </button>

        <div className="bg-card rounded-lg shadow-md overflow-hidden border border-border">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">{job.title}</h1>
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    {formatJobType(job.jobType)}
                  </span>
                </div>
                <p className="text-xl text-foreground font-medium mb-4">{job.company}</p>

                <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5" />
                    <span>{formatSalary(job.salary)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>{job.applicationCount || 0} applicants</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 md:mt-0 md:ml-6">
                {hasApplied ? (
                  <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg">
                    <CheckCircle className="h-5 w-5" />
                    <span>Applied</span>
                  </div>
                ) : (
                  <button onClick={handleApply} className="btn-primary flex items-center space-x-2">
                    <Briefcase className="h-5 w-5" />
                    <span>Apply Now</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Job Description */}
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-3">Job Description</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-foreground whitespace-pre-line">{job.description}</p>
                  </div>
                </div>

                {/* Requirements */}
                {job.requirements && job.requirements.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-3">Requirements</h2>
                    <ul className="space-y-2">
                      {job.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-foreground">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Benefits */}
                {job.benefits && job.benefits.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-3">Benefits</h2>
                    <ul className="space-y-2">
                      {job.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-foreground">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Skills */}
                {job.skills && job.skills.length > 0 && (
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-3">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-background text-foreground px-3 py-1 rounded-full text-sm border border-border"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Job Details */}
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-3">Job Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Job Type</span>
                      <span className="font-medium text-foreground">{formatJobType(job.jobType)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Location</span>
                      <span className="font-medium text-foreground">{job.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Posted</span>
                      <span className="font-medium text-foreground">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Applications</span>
                      <span className="font-medium text-foreground">{job.applicationCount || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Company Info */}
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-3">About {job.company}</h3>
                  <p className="text-muted-foreground text-sm">
                    Learn more about this company and their other job openings.
                  </p>
                  <button className="mt-3 text-primary hover:text-primary/80 text-sm flex items-center space-x-1">
                    <span>View Company Profile</span>
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <ApplicationModal job={job} onClose={() => setShowApplicationModal(false)} onSubmit={handleApplicationSubmit} />
      )}
    </div>
  )
}

export default JobDetail
