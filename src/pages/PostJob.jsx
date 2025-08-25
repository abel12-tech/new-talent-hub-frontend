"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { useForm, useFieldArray } from "react-hook-form"
import { Plus, X, DollarSign, MapPin, Clock, Briefcase } from "lucide-react"
import { createJob, clearError } from "../store/slices/jobSlice"
import LoadingSpinner from "../components/common/LoadingSpinner"
import ErrorMessage from "../components/common/ErrorMessage"
import toast from "react-hot-toast"

const PostJob = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading, error } = useSelector((state) => state.jobs)
  const { user } = useSelector((state) => state.auth)

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      company: "",
      location: "",
      jobType: "full-time",
      salary: {
        min: "",
        max: "",
        currency: "USD",
      },
      skills: [""],
      requirements: [""],
      benefits: [""],
    },
  })

  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    control,
    name: "skills",
  })

  const {
    fields: requirementFields,
    append: appendRequirement,
    remove: removeRequirement,
  } = useFieldArray({
    control,
    name: "requirements",
  })

  const {
    fields: benefitFields,
    append: appendBenefit,
    remove: removeBenefit,
  } = useFieldArray({
    control,
    name: "benefits",
  })

  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  const onSubmit = async (data) => {
    try {
      // Clean up empty fields
      const cleanedData = {
        ...data,
        skills: data.skills.filter((skill) => skill.trim() !== ""),
        requirements: data.requirements.filter((req) => req.trim() !== ""),
        benefits: data.benefits.filter((benefit) => benefit.trim() !== ""),
        salary: {
          min: data.salary.min ? Number(data.salary.min) : undefined,
          max: data.salary.max ? Number(data.salary.max) : undefined,
          currency: data.salary.currency,
        },
      }

      const result = await dispatch(createJob(cleanedData))
      if (createJob.fulfilled.match(result)) {
        toast.success("Job posted successfully!")
        navigate("/dashboard")
      }
    } catch (error) {
      toast.error("Failed to post job. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-700/20">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <Briefcase className="h-6 w-6 text-primary" />
              <span>Post a New Job</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Fill out the details below to post your job opening</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <ErrorMessage message={error} />

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Job Title *
                </label>
                <input
                  {...register("title", {
                    required: "Job title is required",
                    minLength: { value: 3, message: "Title must be at least 3 characters" },
                    maxLength: { value: 100, message: "Title cannot exceed 100 characters" },
                  })}
                  type="text"
                  className="input-field"
                  placeholder="e.g. Senior React Developer"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company Name *
                </label>
                <input
                  {...register("company", {
                    required: "Company name is required",
                    minLength: { value: 2, message: "Company name must be at least 2 characters" },
                  })}
                  type="text"
                  className="input-field"
                  placeholder="e.g. TechCorp Inc."
                />
                {errors.company && <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
                  <input
                    {...register("location", {
                      required: "Location is required",
                    })}
                    type="text"
                    className="input-field pl-10"
                    placeholder="e.g. San Francisco, CA or Remote"
                  />
                </div>
                {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>}
              </div>

              <div>
                <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Job Type *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
                  <select {...register("jobType")} className="input-field pl-10">
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Salary Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Salary Range (Optional)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Minimum</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
                    <input
                      {...register("salary.min", {
                        min: { value: 0, message: "Salary must be positive" },
                      })}
                      type="number"
                      className="input-field pl-8"
                      placeholder="50000"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Maximum</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
                    <input
                      {...register("salary.max", {
                        min: { value: 0, message: "Salary must be positive" },
                      })}
                      type="number"
                      className="input-field pl-8"
                      placeholder="80000"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Currency</label>
                  <select {...register("salary.currency")} className="input-field">
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Job Description *
              </label>
              <textarea
                {...register("description", {
                  required: "Job description is required",
                  minLength: { value: 10, message: "Description must be at least 10 characters" },
                  maxLength: { value: 2000, message: "Description cannot exceed 2000 characters" },
                })}
                rows={6}
                className="input-field resize-none"
                placeholder="Describe the role, responsibilities, and what you're looking for in a candidate..."
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Required Skills</label>
              <div className="space-y-2">
                {skillFields.map((field, index) => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <input
                      {...register(`skills.${index}`)}
                      type="text"
                      className="input-field flex-1"
                      placeholder="e.g. JavaScript, React, Node.js"
                    />
                    {skillFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => appendSkill("")}
                  className="flex items-center space-x-2 text-primary hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Skill</span>
                </button>
              </div>
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Requirements</label>
              <div className="space-y-2">
                {requirementFields.map((field, index) => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <input
                      {...register(`requirements.${index}`)}
                      type="text"
                      className="input-field flex-1"
                      placeholder="e.g. 3+ years of experience, Bachelor's degree"
                    />
                    {requirementFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRequirement(index)}
                        className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => appendRequirement("")}
                  className="flex items-center space-x-2 text-primary hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Requirement</span>
                </button>
              </div>
            </div>

            {/* Benefits */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Benefits</label>
              <div className="space-y-2">
                {benefitFields.map((field, index) => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <input
                      {...register(`benefits.${index}`)}
                      type="text"
                      className="input-field flex-1"
                      placeholder="e.g. Health insurance, Remote work, 401k"
                    />
                    {benefitFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBenefit(index)}
                        className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => appendBenefit("")}
                  className="flex items-center space-x-2 text-primary hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Benefit</span>
                </button>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isLoading ? <LoadingSpinner size="sm" /> : <span>Post Job</span>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PostJob
