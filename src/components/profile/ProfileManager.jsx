"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useForm } from "react-hook-form"
import { User, Mail, FileText, Upload, Download, Trash2, Save, X } from "lucide-react"
import LoadingSpinner from "../common/LoadingSpinner"
import toast from "react-hot-toast"

const ProfileManager = ({ onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [currentResume, setCurrentResume] = useState(null)
  const { user } = useSelector((state) => state.auth)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      bio: user?.profile?.bio || "",
      skills: user?.profile?.skills?.join(", ") || "",
      experience: user?.profile?.experience || "",
    },
  })

  useEffect(() => {
    // Check if user has existing resume
    if (user?.profile?.resume) {
      setCurrentResume(user.profile.resume)
    }
  }, [user])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please select a PDF, DOC, or DOCX file")
        return
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB")
        return
      }

      setSelectedFile(file)
      console.log("[v0] File selected:", {
        name: file.name,
        size: file.size,
        type: file.type,
      })
    }
  }

  const handleDownloadResume = async () => {
    if (!currentResume) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/files/resume/${currentResume}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error("Failed to download resume")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = currentResume
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success("Resume downloaded successfully")
    } catch (error) {
      console.error("[v0] Resume download error:", error)
      toast.error("Failed to download resume")
    }
  }

  const handleDeleteResume = async () => {
    if (!window.confirm("Are you sure you want to delete your current resume?")) return

    try {
      // API call to delete resume would go here
      setCurrentResume(null)
      toast.success("Resume deleted successfully")
    } catch (error) {
      console.error("[v0] Resume delete error:", error)
      toast.error("Failed to delete resume")
    }
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const formData = new FormData()

      // Add profile data
      formData.append("name", data.name)
      formData.append("bio", data.bio)
      formData.append("experience", data.experience)

      // Process skills
      const skillsArray = data.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0)
      formData.append("skills", JSON.stringify(skillsArray))

      // Add resume file if selected
      if (selectedFile) {
        formData.append("resume", selectedFile)
        console.log("[v0] Uploading resume file:", selectedFile.name)
      }

      console.log("[v0] Profile update FormData:")
      for (const [key, value] of formData.entries()) {
        console.log(`[v0] ${key}:`, value)
      }

      // Mock API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast.success("Profile updated successfully!")
      if (onClose) onClose()
    } catch (error) {
      console.error("[v0] Profile update error:", error)
      toast.error("Failed to update profile")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-background dark:bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Update Profile</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            disabled={isSubmitting}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Basic Information</h3>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <input
                  {...register("name", {
                    required: "Name is required",
                    minLength: { value: 2, message: "Name must be at least 2 characters" },
                  })}
                  className="w-full px-4 py-3 pl-10 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <input
                  {...register("email")}
                  type="email"
                  className="w-full px-4 py-3 pl-10 border border-input rounded-lg bg-muted text-muted-foreground"
                  disabled
                  placeholder="Email cannot be changed"
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Email address cannot be changed</p>
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Professional Information</h3>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-foreground mb-2">
                Professional Bio
              </label>
              <textarea
                {...register("bio", {
                  maxLength: { value: 500, message: "Bio cannot exceed 500 characters" },
                })}
                rows={4}
                className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                placeholder="Tell employers about yourself, your experience, and career goals..."
              />
              {errors.bio && <p className="mt-1 text-sm text-destructive">{errors.bio.message}</p>}
              <p className="mt-1 text-xs text-muted-foreground">Maximum 500 characters</p>
            </div>

            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-foreground mb-2">
                Skills
              </label>
              <input
                {...register("skills")}
                className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                placeholder="JavaScript, React, Node.js, Python (comma-separated)"
              />
              <p className="mt-1 text-xs text-muted-foreground">Separate skills with commas</p>
            </div>

            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-foreground mb-2">
                Experience Level
              </label>
              <select
                {...register("experience")}
                className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
              >
                <option value="">Select experience level</option>
                <option value="entry">Entry Level (0-2 years)</option>
                <option value="mid">Mid Level (2-5 years)</option>
                <option value="senior">Senior Level (5-10 years)</option>
                <option value="lead">Lead/Principal (10+ years)</option>
              </select>
            </div>
          </div>

          {/* Resume Management */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Resume Management</h3>

            {/* Current Resume */}
            {currentResume && (
              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Current Resume</p>
                      <p className="text-xs text-muted-foreground">{currentResume}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={handleDownloadResume}
                      className="p-2 text-primary hover:text-primary/80 transition-colors"
                      title="Download Resume"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteResume}
                      className="p-2 text-destructive hover:text-destructive/80 transition-colors"
                      title="Delete Resume"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Upload New Resume */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {currentResume ? "Upload New Resume" : "Upload Resume"}
              </label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors bg-muted/20">
                {selectedFile ? (
                  <div className="flex items-center justify-center space-x-2">
                    <FileText className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-foreground mb-2">Upload your resume or CV</p>
                  </>
                )}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="resume-upload"
                />
                <label
                  htmlFor="resume-upload"
                  className="inline-flex items-center px-4 py-2 border border-border rounded-md shadow-sm text-sm font-medium text-foreground bg-background hover:bg-muted cursor-pointer transition-colors"
                >
                  {selectedFile ? "Change File" : "Choose File"}
                </label>
                <p className="text-xs text-muted-foreground mt-2">PDF, DOC, or DOCX (Max 5MB)</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProfileManager
