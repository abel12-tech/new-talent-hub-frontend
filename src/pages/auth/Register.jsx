"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { useForm } from "react-hook-form"
import { Eye, EyeOff, Mail, Lock, User, Briefcase, UserCheck } from "lucide-react"
import { registerUser, clearError } from "../../store/slices/authSlice"
import LoadingSpinner from "../../components/common/LoadingSpinner"
import ErrorMessage from "../../components/common/ErrorMessage"
import toast from "react-hot-toast"

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState("applicant")
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: "applicant",
    },
  })

  const watchPassword = watch("password")

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true })
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  const onSubmit = async (data) => {
    try {
      const result = await dispatch(registerUser(data))
      if (registerUser.fulfilled.match(result)) {
        toast.success("Registration successful! Welcome to TalentHub!")
        navigate("/dashboard", { replace: true })
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-primary text-white p-3 rounded-lg">
            <Briefcase className="h-8 w-8" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-foreground">Create your account</h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Or{" "}
          <Link to="/login" className="font-medium text-primary hover:text-primary/80">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-border">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <ErrorMessage message={error} />

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">I am a:</label>
              <div className="grid grid-cols-2 gap-3">
                <label className="relative">
                  <input
                    {...register("role")}
                    type="radio"
                    value="applicant"
                    className="sr-only"
                    onChange={(e) => setSelectedRole(e.target.value)}
                  />
                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedRole === "applicant"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-border/80 text-foreground"
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <UserCheck className="h-6 w-6 mb-2" />
                      <span className="font-medium">Developer</span>
                      <span className="text-xs text-muted-foreground mt-1">Looking for job opportunities</span>
                    </div>
                  </div>
                </label>
                <label className="relative">
                  <input
                    {...register("role")}
                    type="radio"
                    value="employer"
                    className="sr-only"
                    onChange={(e) => setSelectedRole(e.target.value)}
                  />
                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedRole === "employer"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-border/80 text-foreground"
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <Briefcase className="h-6 w-6 mb-2" />
                      <span className="font-medium">Company</span>
                      <span className="text-xs text-muted-foreground mt-1">Hiring talented developers</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground">
                {selectedRole === "employer" ? "Contact Person Name" : "Full Name"}
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  {...register("name", {
                    required: selectedRole === "employer" ? "Contact person name is required" : "Full name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                    maxLength: {
                      value: 50,
                      message: "Name cannot exceed 50 characters",
                    },
                  })}
                  type="text"
                  autoComplete="name"
                  className="input-field pl-10"
                  placeholder={selectedRole === "employer" ? "Enter contact person name" : "Enter your full name"}
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Please enter a valid email address",
                    },
                  })}
                  type="email"
                  autoComplete="email"
                  className="input-field pl-10"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className="input-field pl-10 pr-10"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground hover:text-muted-foreground/80" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground hover:text-muted-foreground/80" />
                  )}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) => value === watchPassword || "Passwords do not match",
                  })}
                  type="password"
                  autoComplete="new-password"
                  className="input-field pl-10"
                  placeholder="Confirm your password"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            {selectedRole === "employer" && (
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-foreground">
                  Company Name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    {...register("companyName", {
                      required: "Company name is required",
                      minLength: {
                        value: 2,
                        message: "Company name must be at least 2 characters",
                      },
                      maxLength: {
                        value: 50,
                        message: "Company name cannot exceed 50 characters",
                      },
                    })}
                    type="text"
                    autoComplete="company-name"
                    className="input-field pl-10"
                    placeholder="Enter your company name"
                  />
                </div>
                {errors.companyName && <p className="mt-1 text-sm text-destructive">{errors.companyName.message}</p>}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <LoadingSpinner size="sm" /> : "Create Account"}
              </button>
            </div>

            <div className="text-xs text-muted-foreground text-center">
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
