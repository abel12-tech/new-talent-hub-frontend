"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { logout } from "../../store/slices/authSlice"
import ThemeToggle from "../common/ThemeToggle"
import { Home, Briefcase, FileText, Users, Settings, LogOut, Menu, X, BarChart, Building2, User } from "lucide-react"

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  const getNavigationItems = () => {
    const baseItems = [{ name: "Overview", href: "/dashboard", icon: Home, current: true }]

    if (user?.role === "admin") {
      return [
        ...baseItems,
        { name: "Users", href: "/dashboard/users", icon: Users, current: false },
        { name: "Jobs", href: "/dashboard/jobs", icon: Briefcase, current: false },
        { name: "Applications", href: "/dashboard/applications", icon: FileText, current: false },
        { name: "Analytics", href: "/dashboard/analytics", icon: BarChart, current: false },
      ]
    } else if (user?.role === "employer") {
      return [
        ...baseItems,
        { name: "My Jobs", href: "/dashboard/jobs", icon: Briefcase, current: false },
        { name: "Applications", href: "/dashboard/applications", icon: FileText, current: false },
        { name: "Company Profile", href: "/dashboard/profile", icon: Building2, current: false },
        { name: "Post Job", href: "/post-job", icon: Settings, current: false },
      ]
    } else {
      return [
        ...baseItems,
        { name: "My Applications", href: "/applications", icon: FileText, current: false },
        { name: "Browse Jobs", href: "/jobs", icon: Briefcase, current: false },
        { name: "Profile", href: "/dashboard/profile", icon: User, current: false },
      ]
    }
  }

  const navigation = getNavigationItems()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? "" : "pointer-events-none"}`}>
        <div
          className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ease-linear duration-300 ${sidebarOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setSidebarOpen(false)}
        />

        <div
          className={`relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800 shadow-xl transform ease-in-out duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">TalentHub</h1>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <item.icon className="mr-4 h-6 w-6" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">TalentHub</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Top navbar - Mobile */}
        <div className="sticky top-0 z-30 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Desktop top bar - Enhanced with gradient and better styling */}
        <div className="sticky top-0 z-30 bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {user?.role === "admin"
                      ? "Admin Dashboard"
                      : user?.role === "employer"
                        ? "Employer Dashboard"
                        : "Developer Dashboard"}
                  </h2>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <ThemeToggle />

                <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">{user?.name?.charAt(0)?.toUpperCase()}</span>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-900 dark:text-white font-medium">{user?.name}</p>
                    <p className="text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 bg-gray-50 dark:bg-gray-900">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
