"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { X, FileText, Send, Upload } from "lucide-react"
import { useSelector } from "react-redux"
import LoadingSpinner from "../common/LoadingSpinner"

const ApplicationModal = ({ job, onClose, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const { user } = useSelector((state) => state.auth)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm()

  const resumeField = watch("resume")

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("jobId", job._id)
      formData.append("coverLetter", data.coverLetter || "")
      formData.append("notes", data.notes || "")

      if (data.resume && data.resume[0]) {
        formData.append("resume", data.resume[0])
        console.log("[v0] File being uploaded:", {
          name: data.resume[0].name,
          size: data.resume[0].size,
          type: data.resume[0].type,
        })
      } else {
        console.log("[v0] No file selected for upload")
      }

      console.log("[v0] FormData contents:")
      for (const [key, value] of formData.entries()) {
        console.log(`[v0] ${key}:`, value)
      }

      const result = await onSubmit(formData)
      console.log("REEEEEE", result)
    } catch (error) {
      console.error("[v0] Form submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setSelectedFile(file)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-background dark:bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Apply for {job.title}</h2>
            <p className="text-muted-foreground">{job.company}</p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            disabled={isSubmitting}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
          {/* Applicant Info */}
          <div className="bg-muted/50 p-4 rounded-lg border border-border">
            <h3 className="font-medium text-foreground mb-2">Your Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Name:</span>
                <span className="ml-2 font-medium text-foreground">{user?.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span>
                <span className="ml-2 font-medium text-foreground">{user?.email}</span>
              </div>
            </div>
          </div>

          {/* Cover Letter */}
          <div>
            <label htmlFor="coverLetter" className="block text-sm font-medium text-foreground mb-2">
              Cover Letter
            </label>
            <textarea
              {...register("coverLetter", {
                maxLength: {
                  value: 1000,
                  message: "Cover letter cannot exceed 1000 characters",
                },
              })}
              rows={6}
              className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              placeholder="Tell the employer why you're interested in this position and what makes you a great fit..."
            />
            {errors.coverLetter && <p className="mt-1 text-sm text-destructive">{errors.coverLetter.message}</p>}
            <p className="mt-1 text-xs text-muted-foreground">Optional - Maximum 1000 characters</p>
          </div>

          {/* Resume Upload */}
          <div>
            <label htmlFor="resume" className="block text-sm font-medium text-foreground mb-2">
              Resume/CV
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
                {...register("resume", {
                  onChange: handleFileChange,
                })}
                type="file"
                accept=".pdf,.doc,.docx"
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

          {/* Additional Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-foreground mb-2">
              Additional Notes
            </label>
            <textarea
              {...register("notes")}
              rows={3}
              className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              placeholder="Any additional information you'd like to share..."
            />
            <p className="mt-1 text-xs text-muted-foreground">Optional</p>
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
                  <Send className="h-4 w-4" />
                  <span>Submit Application</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ApplicationModal
