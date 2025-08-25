"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Search, MapPin, Filter, X, DollarSign, Calendar, Briefcase } from "lucide-react"
import { setFilters, clearFilters } from "../../store/slices/jobSlice"

const AdvancedJobFilters = ({ onClose }) => {
  const dispatch = useDispatch()
  const { filters } = useSelector((state) => state.jobs)

  const [localFilters, setLocalFilters] = useState({
    search: filters.search || "",
    location: filters.location || "",
    jobType: filters.jobType || "",
    skills: filters.skills?.join(", ") || "",
    salaryMin: filters.salaryMin || "",
    salaryMax: filters.salaryMax || "",
    datePosted: filters.datePosted || "",
    company: filters.company || "",
  })

  const jobTypes = [
    { value: "", label: "All Job Types" },
    { value: "full-time", label: "Full Time" },
    { value: "part-time", label: "Part Time" },
    { value: "contract", label: "Contract" },
    { value: "internship", label: "Internship" },
    { value: "freelance", label: "Freelance" },
  ]

  const datePostedOptions = [
    { value: "", label: "Any time" },
    { value: "1", label: "Last 24 hours" },
    { value: "7", label: "Last week" },
    { value: "30", label: "Last month" },
  ]

  const popularSkills = [
    "JavaScript",
    "React",
    "Node.js",
    "Python",
    "Java",
    "TypeScript",
    "Angular",
    "Vue.js",
    "PHP",
    "C#",
    "Go",
    "Ruby",
    "Swift",
    "Kotlin",
    "SQL",
    "MongoDB",
    "PostgreSQL",
    "AWS",
    "Docker",
    "Kubernetes",
  ]

  const handleInputChange = (field, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSkillClick = (skill) => {
    const currentSkills = localFilters.skills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0)

    if (currentSkills.includes(skill)) {
      const updatedSkills = currentSkills.filter((s) => s !== skill)
      setLocalFilters((prev) => ({
        ...prev,
        skills: updatedSkills.join(", "),
      }))
    } else {
      const updatedSkills = [...currentSkills, skill]
      setLocalFilters((prev) => ({
        ...prev,
        skills: updatedSkills.join(", "),
      }))
    }
  }

  const handleApplyFilters = () => {
    const processedFilters = {
      ...localFilters,
      skills: localFilters.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0),
      salaryMin: localFilters.salaryMin ? Number.parseInt(localFilters.salaryMin) : undefined,
      salaryMax: localFilters.salaryMax ? Number.parseInt(localFilters.salaryMax) : undefined,
    }

    // Remove empty values
    Object.keys(processedFilters).forEach((key) => {
      if (!processedFilters[key] || (Array.isArray(processedFilters[key]) && processedFilters[key].length === 0)) {
        delete processedFilters[key]
      }
    })

    dispatch(setFilters(processedFilters))
    if (onClose) onClose()
  }

  const handleClearFilters = () => {
    setLocalFilters({
      search: "",
      location: "",
      jobType: "",
      skills: "",
      salaryMin: "",
      salaryMax: "",
      datePosted: "",
      company: "",
    })
    dispatch(clearFilters())
  }

  const getActiveFiltersCount = () => {
    return Object.values(localFilters).filter((value) => value && value.toString().trim().length > 0).length
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-background dark:bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-border shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Advanced Filters</h2>
            {getActiveFiltersCount() > 0 && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                {getActiveFiltersCount()}
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Filters Content */}
        <div className="p-6 space-y-6">
          {/* Search and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Keywords</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <input
                  type="text"
                  value={localFilters.search}
                  onChange={(e) => handleInputChange("search", e.target.value)}
                  placeholder="Job title, keywords, company..."
                  className="w-full px-4 py-3 pl-10 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <input
                  type="text"
                  value={localFilters.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="City, state, or remote"
                  className="w-full px-4 py-3 pl-10 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Job Type and Company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Job Type</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <select
                  value={localFilters.jobType}
                  onChange={(e) => handleInputChange("jobType", e.target.value)}
                  className="w-full px-4 py-3 pl-10 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                >
                  {jobTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Company</label>
              <input
                type="text"
                value={localFilters.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
                placeholder="Company name"
                className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
          </div>

          {/* Salary Range */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Salary Range (USD)</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <input
                  type="number"
                  value={localFilters.salaryMin}
                  onChange={(e) => handleInputChange("salaryMin", e.target.value)}
                  placeholder="Minimum salary"
                  className="w-full px-4 py-3 pl-10 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <input
                  type="number"
                  value={localFilters.salaryMax}
                  onChange={(e) => handleInputChange("salaryMax", e.target.value)}
                  placeholder="Maximum salary"
                  className="w-full px-4 py-3 pl-10 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Date Posted */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Date Posted</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <select
                value={localFilters.datePosted}
                onChange={(e) => handleInputChange("datePosted", e.target.value)}
                className="w-full px-4 py-3 pl-10 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
              >
                {datePostedOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Skills</label>
            <input
              type="text"
              value={localFilters.skills}
              onChange={(e) => handleInputChange("skills", e.target.value)}
              placeholder="JavaScript, React, Node.js (comma-separated)"
              className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent mb-3"
            />
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Popular skills:</p>
              <div className="flex flex-wrap gap-2">
                {popularSkills.map((skill) => {
                  const isSelected = localFilters.skills
                    .split(",")
                    .map((s) => s.trim())
                    .includes(skill)

                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleSkillClick(skill)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors border ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted text-foreground hover:bg-muted/80 border-border"
                      }`}
                    >
                      {skill}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center p-6 border-t border-border">
          <button onClick={handleClearFilters} className="text-muted-foreground hover:text-foreground font-medium">
            Clear All Filters
          </button>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdvancedJobFilters
