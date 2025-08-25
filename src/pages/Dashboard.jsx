"use client"
import { useSelector } from "react-redux"
import ApplicantDashboard from "../components/dashboard/ApplicantDashboard"
import EmployerDashboard from "../components/dashboard/EmployerDashboard"
import AdminDashboard from "../components/dashboard/AdminDashboard"
import LoadingSpinner from "../components/common/LoadingSpinner"
import DashboardLayout from "../components/dashboard/DashboardLayout"

const Dashboard = () => {
  const { user, isLoading } = useSelector((state) => state.auth)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Access Denied</h2>
          <p className="text-muted-foreground">Please log in to access your dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardLayout>
        {user.role === "admin" ? (
          <AdminDashboard />
        ) : user.role === "applicant" ? (
          <ApplicantDashboard />
        ) : (
          <EmployerDashboard />
        )}
      </DashboardLayout>
    </div>
  )
}

export default Dashboard
