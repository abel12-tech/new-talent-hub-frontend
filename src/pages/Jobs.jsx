"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import {
  Search,
  MapPin,
  Clock,
  DollarSign,
  SlidersHorizontal,
  X,
  Briefcase,
  Building2,
  Star,
  Filter,
} from "lucide-react"
import { fetchJobs, setFilters, clearFilters } from "../store/slices/jobSlice"
import LoadingSpinner from "../components/common/LoadingSpinner"
import ErrorMessage from "../components/common/ErrorMessage"
import AdvancedJobFilters from "../components/jobs/AdvancedJobFilters"

const Jobs = () => {
  const dispatch = useDispatch()
  const { jobs, pagination, filters, isLoading, error } = useSelector((state) => state.jobs)
  const [searchTerm, setSearchTerm] = useState(filters.search || "")
  const [location, setLocation] = useState(filters.location || "")
  const [jobType, setJobType] = useState(filters.jobType || "")
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  useEffect(() => {
    dispatch(fetchJobs(filters))
  }, [dispatch, filters])

  const handleSearch = (e) => {
    e.preventDefault()
    dispatch(setFilters({ search: searchTerm, location, jobType }))
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setLocation("")
    setJobType("")
    dispatch(clearFilters())
  }

  const handleRemoveFilter = (filterKey) => {
    const newFilters = { ...filters }
    delete newFilters[filterKey]
    dispatch(setFilters(newFilters))

    // Update local state
    if (filterKey === "search") setSearchTerm("")
    if (filterKey === "location") setLocation("")
    if (filterKey === "jobType") setJobType("")
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

  const getActiveFiltersCount = () => {
    return Object.keys(filters).filter(
      (key) =>
        filters[key] &&
        (Array.isArray(filters[key]) ? filters[key].length > 0 : filters[key].toString().trim().length > 0),
    ).length
  }

  const renderActiveFilters = () => {
    const activeFilters = []

    if (filters.search) {
      activeFilters.push({ key: "search", label: `Keywords: ${filters.search}` })
    }
    if (filters.location) {
      activeFilters.push({ key: "location", label: `Location: ${filters.location}` })
    }
    if (filters.jobType) {
      activeFilters.push({ key: "jobType", label: `Type: ${formatJobType(filters.jobType)}` })
    }
    if (filters.skills && filters.skills.length > 0) {
      activeFilters.push({ key: "skills", label: `Skills: ${filters.skills.join(", ")}` })
    }
    if (filters.salaryMin || filters.salaryMax) {
      const salaryLabel =
        filters.salaryMin && filters.salaryMax
          ? `Salary: $${filters.salaryMin.toLocaleString()} - $${filters.salaryMax.toLocaleString()}`
          : filters.salaryMin
            ? `Salary: From $${filters.salaryMin.toLocaleString()}`
            : `Salary: Up to $${filters.salaryMax.toLocaleString()}`
      activeFilters.push({ key: "salary", label: salaryLabel })
    }
    if (filters.company) {
      activeFilters.push({ key: "company", label: `Company: ${filters.company}` })
    }

    return activeFilters
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-primary to-accent text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Dream Job</h1>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Discover thousands of opportunities from top companies worldwide
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto">
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Job title, keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border-0 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-white/50 focus:outline-none"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border-0 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-white/50 focus:outline-none"
                  />
                </div>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="w-full px-4 py-4 bg-white rounded-xl border-0 text-gray-900 focus:ring-2 focus:ring-white/50 focus:outline-none"
                >
                  <option value="">All Job Types</option>
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                  <option value="freelance">Freelance</option>
                </select>
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="flex-1 bg-white text-primary px-6 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Search Jobs
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAdvancedFilters(true)}
                    className="px-4 py-4 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors relative"
                  >
                    <Filter className="h-5 w-5 text-white" />
                    {getActiveFiltersCount() > 0 && (
                      <span className="absolute -top-2 -right-2 bg-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {getActiveFiltersCount()}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderActiveFilters().length > 0 && (
          <div className="bg-card rounded-xl p-6 mb-6 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                <SlidersHorizontal className="h-5 w-5 text-primary" />
                <span>Active Filters</span>
              </h3>
              <button onClick={handleClearFilters} className="text-sm text-primary hover:text-primary/80 font-medium">
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {renderActiveFilters().map((filter, index) => (
                <span
                  key={index}
                  className="inline-flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium"
                >
                  {filter.label}
                  <button
                    onClick={() => handleRemoveFilter(filter.key)}
                    className="ml-2 hover:bg-primary/20 rounded-full p-1 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && <ErrorMessage message={error} className="mb-6" />}

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-16">
            <LoadingSpinner size="lg" />
            <p className="text-muted-foreground mt-4">Finding the perfect jobs for you...</p>
          </div>
        )}

        {/* Jobs List */}
        {!isLoading && (
          <>
            <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {pagination.total} Job{pagination.total !== 1 ? "s" : ""} Available
                </h2>
                <p className="text-muted-foreground">
                  {getActiveFiltersCount() > 0 && (
                    <span className="text-primary font-medium">
                      {getActiveFiltersCount()} filter{getActiveFiltersCount() !== 1 ? "s" : ""} applied
                    </span>
                  )}
                </p>
              </div>
            </div>

            {jobs.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No jobs found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your search criteria or filters</p>
                <button
                  onClick={handleClearFilters}
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {jobs.map((job) => (
                  <div
                    key={job._id}
                    className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-all duration-200 hover:border-primary/20 group"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                              <Building2 className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                                <Link to={`/jobs/${job._id}`}>{job.title}</Link>
                              </h3>
                              <p className="text-muted-foreground font-medium">{job.company}</p>
                            </div>
                          </div>
                          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                            {formatJobType(job.jobType)}
                          </span>
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
                            <Clock className="h-4 w-4" />
                            <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <p className="text-foreground line-clamp-2 mb-4">{job.description}</p>

                        {job.skills && job.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {job.skills.slice(0, 5).map((skill, index) => (
                              <span key={index} className="bg-muted text-foreground px-3 py-1 rounded-full text-sm">
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
                          className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors text-center"
                        >
                          View Details
                        </Link>
                        <button className="border border-border text-foreground px-6 py-3 rounded-xl font-semibold hover:bg-muted transition-colors flex items-center justify-center space-x-2">
                          <Star className="h-4 w-4" />
                          <span>Save Job</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {pagination.pages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center space-x-2">
                  {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => {
                    let page
                    if (pagination.pages <= 7) {
                      page = i + 1
                    } else if (pagination.current <= 4) {
                      page = i + 1
                    } else if (pagination.current >= pagination.pages - 3) {
                      page = pagination.pages - 6 + i
                    } else {
                      page = pagination.current - 3 + i
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => dispatch(setFilters({ ...filters, page }))}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          page === pagination.current
                            ? "bg-primary text-primary-foreground"
                            : "bg-card text-foreground hover:bg-muted border border-border"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Advanced Filters Modal */}
      {showAdvancedFilters && <AdvancedJobFilters onClose={() => setShowAdvancedFilters(false)} />}
    </div>
  )
}

export default Jobs
