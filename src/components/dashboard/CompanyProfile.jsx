"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Building2, MapPin, Globe, Users, Edit3, Save, X, Star, Award, Mail } from "lucide-react"
import { updateProfile } from "../../store/slices/authSlice"
import LoadingSpinner from "../common/LoadingSpinner"
import toast from "react-hot-toast"

const CompanyProfile = () => {
  const dispatch = useDispatch()
  const { user, isLoading } = useSelector((state) => state.auth)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.profile?.phone || "",
    companyName: user?.profile?.companyName || "",
    website: user?.profile?.website || "",
    location: user?.profile?.location || "",
    industry: user?.profile?.industry || "",
    companySize: user?.profile?.companySize || "",
    description: user?.profile?.description || "",
    foundedYear: user?.profile?.foundedYear || "",
    benefits: user?.profile?.benefits || [],
    culture: user?.profile?.culture || "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleBenefitsChange = (e) => {
    const benefits = e.target.value
      .split(",")
      .map((b) => b.trim())
      .filter((b) => b)
    setFormData((prev) => ({
      ...prev,
      benefits,
    }))
  }

  const handleSave = async () => {
    try {
      const profileData = {
        name: formData.name,
        profile: {
          phone: formData.phone,
          companyName: formData.companyName,
          website: formData.website,
          location: formData.location,
          industry: formData.industry,
          companySize: formData.companySize,
          description: formData.description,
          foundedYear: formData.foundedYear,
          benefits: formData.benefits,
          culture: formData.culture,
        },
      }

      await dispatch(updateProfile(profileData))
      setIsEditing(false)
      toast.success("Company profile updated successfully!")
    } catch (error) {
      toast.error("Failed to update profile")
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.profile?.phone || "",
      companyName: user?.profile?.companyName || "",
      website: user?.profile?.website || "",
      location: user?.profile?.location || "",
      industry: user?.profile?.industry || "",
      companySize: user?.profile?.companySize || "",
      description: user?.profile?.description || "",
      foundedYear: user?.profile?.foundedYear || "",
      benefits: user?.profile?.benefits || [],
      culture: user?.profile?.culture || "",
    })
    setIsEditing(false)
  }

  const companySizeOptions = [
    "1-10 employees",
    "11-50 employees",
    "51-200 employees",
    "201-500 employees",
    "501-1000 employees",
    "1000+ employees",
  ]

  const industryOptions = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Manufacturing",
    "Retail",
    "Consulting",
    "Media & Entertainment",
    "Real Estate",
    "Other",
  ]

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div className="flex items-start space-x-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Building2 className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{user?.profile?.companyName || "Your Company"}</h1>
                <div className="flex flex-wrap items-center gap-4 text-primary-foreground/80">
                  {user?.profile?.industry && (
                    <div className="flex items-center space-x-1">
                      <Award className="h-4 w-4" />
                      <span>{user.profile.industry}</span>
                    </div>
                  )}
                  {user?.profile?.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{user.profile.location}</span>
                    </div>
                  )}
                  {user?.profile?.companySize && (
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{user.profile.companySize}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 md:mt-0 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors flex items-center space-x-2"
              >
                <Edit3 className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex space-x-2 mt-4 md:mt-0">
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-white text-primary px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center space-x-2"
                >
                  {isLoading ? <LoadingSpinner size="sm" /> : <Save className="h-4 w-4" />}
                  <span>Save Changes</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors flex items-center space-x-2"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-primary" />
              <span>Company Information</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Company Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                    placeholder="Your company name"
                  />
                ) : (
                  <p className="text-foreground font-medium">{user?.profile?.companyName || "Not specified"}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Industry</label>
                {isEditing ? (
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                  >
                    <option value="">Select industry</option>
                    {industryOptions.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-foreground font-medium">{user?.profile?.industry || "Not specified"}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                    placeholder="City, Country"
                  />
                ) : (
                  <p className="text-foreground font-medium">{user?.profile?.location || "Not specified"}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Company Size</label>
                {isEditing ? (
                  <select
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                  >
                    <option value="">Select company size</option>
                    {companySizeOptions.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-foreground font-medium">{user?.profile?.companySize || "Not specified"}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Website</label>
                {isEditing ? (
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                    placeholder="https://yourcompany.com"
                  />
                ) : user?.profile?.website ? (
                  <a
                    href={user.profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 font-medium flex items-center space-x-1"
                  >
                    <Globe className="h-4 w-4" />
                    <span>{user.profile.website}</span>
                  </a>
                ) : (
                  <p className="text-muted-foreground">Not specified</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Founded Year</label>
                {isEditing ? (
                  <input
                    type="number"
                    name="foundedYear"
                    value={formData.foundedYear}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                    placeholder="2020"
                    min="1800"
                    max={new Date().getFullYear()}
                  />
                ) : (
                  <p className="text-foreground font-medium">{user?.profile?.foundedYear || "Not specified"}</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-foreground mb-2">Company Description</label>
              {isEditing ? (
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                  placeholder="Tell candidates about your company, culture, and what makes you unique..."
                />
              ) : (
                <p className="text-foreground whitespace-pre-wrap">
                  {user?.profile?.description || "No description provided"}
                </p>
              )}
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-foreground mb-2">Company Culture</label>
              {isEditing ? (
                <textarea
                  name="culture"
                  value={formData.culture}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                  placeholder="Describe your company culture, values, and work environment..."
                />
              ) : (
                <p className="text-foreground whitespace-pre-wrap">
                  {user?.profile?.culture || "No culture information provided"}
                </p>
              )}
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-foreground mb-2">Benefits & Perks</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.benefits.join(", ")}
                  onChange={handleBenefitsChange}
                  className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                  placeholder="Health insurance, Remote work, Flexible hours, etc. (comma separated)"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {user?.profile?.benefits?.length > 0 ? (
                    user.profile.benefits.map((benefit, index) => (
                      <span
                        key={index}
                        className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {benefit}
                      </span>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No benefits listed</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information Sidebar */}
        <div className="space-y-6">
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
              <Mail className="h-5 w-5 text-primary" />
              <span>Contact Information</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Contact Person</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                    placeholder="Your full name"
                  />
                ) : (
                  <p className="text-foreground font-medium">{user?.name || "Not specified"}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <p className="text-foreground font-medium">{user?.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                ) : (
                  <p className="text-foreground font-medium">{user?.profile?.phone || "Not specified"}</p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
              <Star className="h-5 w-5 text-primary" />
              <span>Profile Stats</span>
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Profile Completeness</span>
                <span className="text-foreground font-semibold">85%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "85%" }}></div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-muted-foreground">Active Jobs</span>
                <span className="text-foreground font-semibold">3</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Applications</span>
                <span className="text-foreground font-semibold">47</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanyProfile
