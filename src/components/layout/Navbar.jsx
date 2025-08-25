"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { Menu, X, User, LogOut, Briefcase, Plus } from "lucide-react"
import { logout } from "../../store/slices/authSlice"
import ThemeToggle from "../common/ThemeToggle"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate("/")
    setIsOpen(false)
  }

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <nav className="bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-50 transition-colors duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-primary text-white p-2 rounded-lg group-hover:scale-105 transition-transform shadow-sm">
              <Briefcase className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
              TalentHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/jobs" className="text-foreground hover:text-primary transition-colors font-medium">
              Browse Jobs
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-foreground hover:text-primary transition-colors font-medium">
                  Dashboard
                </Link>
                {user?.role === "applicant" && (
                  <Link to="/applications" className="text-foreground hover:text-primary transition-colors font-medium">
                    My Applications
                  </Link>
                )}
                {user?.role === "employer" && (
                  <Link
                    to="/post-job"
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2 shadow-sm hover:shadow-md"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Post Job</span>
                  </Link>
                )}
                {user?.role === "admin" && (
                  <Link
                    to="/dashboard"
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors font-medium"
                  >
                    Admin Panel
                  </Link>
                )}

                {/* Theme Toggle */}
                <ThemeToggle />

                <div className="relative group">
                  <button className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors">
                    <User className="h-5 w-5" />
                    <span>{user?.name}</span>
                    {user?.role === "admin" && (
                      <span className="bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200 text-xs px-2 py-1 rounded-full border dark:border-red-800">
                        Admin
                      </span>
                    )}
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-background/95 backdrop-blur-md rounded-md shadow-lg border border-border py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    >
                      Dashboard
                    </Link>
                    {user?.role === "applicant" && (
                      <Link
                        to="/applications"
                        className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        My Applications
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <Link to="/login" className="text-foreground hover:text-primary transition-colors font-medium">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="text-foreground hover:text-primary focus:outline-none focus:text-primary transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden animate-slide-up">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-muted/80 backdrop-blur-sm rounded-lg mt-2 border border-border/50">
              <Link
                to="/jobs"
                className="block px-3 py-2 text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Browse Jobs
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {user?.role === "applicant" && (
                    <Link
                      to="/applications"
                      className="block px-3 py-2 text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      My Applications
                    </Link>
                  )}
                  {user?.role === "employer" && (
                    <Link
                      to="/post-job"
                      className="block px-3 py-2 text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Post Job
                    </Link>
                  )}
                  {user?.role === "admin" && (
                    <Link
                      to="/dashboard"
                      className="block px-3 py-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
