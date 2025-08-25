import { Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"
import Home from "./pages/Home"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import Jobs from "./pages/Jobs"
import JobDetail from "./pages/JobDetail"
import Applications from "./pages/Applications"
import ManageApplications from "./pages/ManageApplications"
import Dashboard from "./pages/Dashboard"
import PostJob from "./pages/PostJob"
import ProtectedRoute from "./components/auth/ProtectedRoute"

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col transition-colors duration-300">
      <Routes>
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/jobs" element={<Jobs />} />
                  <Route path="/jobs/:id" element={<JobDetail />} />
                  <Route
                    path="/applications"
                    element={
                      <ProtectedRoute requiredRole="applicant">
                        <Applications />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/jobs/:jobId/applications"
                    element={
                      <ProtectedRoute requiredRole="employer">
                        <ManageApplications />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/post-job"
                    element={
                      <ProtectedRoute requiredRole="employer">
                        <PostJob />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>
              <Footer />
            </>
          }
        />
      </Routes>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "rgb(255 255 255 / 1)",
            color: "rgb(17 24 39 / 1)",
            border: "1px solid rgb(229 231 235 / 1)",
          },
          className: "dark:!bg-gray-800 dark:!text-gray-100 dark:!border-gray-600",
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10B981",
              secondary: "rgb(255 255 255 / 1)",
            },
            className: "dark:!bg-gray-800 dark:!text-gray-100",
          },
          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "rgb(255 255 255 / 1)",
            },
            className: "dark:!bg-gray-800 dark:!text-gray-100",
          },
        }}
      />
    </div>
  )
}

export default App
