import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { Search, Users, Briefcase, TrendingUp } from "lucide-react"

const Home = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  return (
    <div className="min-h-screen animate-fade-in">
      {/* Hero Section */}
      <section className="gradient-bg-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-slide-up">
              Find Your Dream Job with <span className="text-yellow-300">TalentHub</span>
            </h1>
            <p
              className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              Connect with top employers and discover opportunities that match your skills and ambitions.
            </p>
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/register"
                    className="bg-secondary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/jobs"
                    className="bg-white text-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Browse Jobs
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/jobs"
                    className="bg-secondary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Browse Jobs
                  </Link>
                  <Link
                    to="/dashboard"
                    className="bg-white text-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Go to Dashboard
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose TalentHub?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We make job searching and hiring simple, efficient, and effective for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 group hover:scale-105 transition-transform duration-300">
              <div className="bg-primary text-white p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:shadow-lg transition-shadow">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Smart Job Search</h3>
              <p className="text-muted-foreground">
                Find jobs that match your skills, experience, and career goals with our intelligent search system.
              </p>
            </div>

            <div className="text-center p-6 group hover:scale-105 transition-transform duration-300">
              <div className="bg-secondary text-white p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:shadow-lg transition-shadow">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Top Employers</h3>
              <p className="text-muted-foreground">
                Connect with leading companies and startups looking for talented professionals like you.
              </p>
            </div>

            <div className="text-center p-6 group hover:scale-105 transition-transform duration-300">
              <div className="bg-accent text-white p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:shadow-lg transition-shadow">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Career Growth</h3>
              <p className="text-muted-foreground">
                Take the next step in your career with opportunities for growth and professional development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have found their perfect job through TalentHub.
          </p>

          {user?.role === "employer" ? (
            <Link
              to="/post-job"
              className="bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-300 inline-flex items-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Briefcase className="h-5 w-5" />
              <span>Post Your First Job</span>
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/jobs"
                className="bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Find Jobs
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="bg-muted text-foreground px-8 py-4 rounded-lg text-lg font-semibold hover:bg-muted/80 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Create Account
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home
