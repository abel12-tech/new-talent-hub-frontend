import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

const baseAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

const fileUploadAPI = axios.create({
  baseURL: API_BASE_URL,
  // Don't set Content-Type header for file uploads - let browser set it with boundary
})

// Request interceptor to add auth token
const addAuthToken = (config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (config.data instanceof FormData) {
    console.log("[v0] FileUploadAPI request with FormData")
  }
  return config
}

baseAPI.interceptors.request.use(addAuthToken, (error) => Promise.reject(error))
fileUploadAPI.interceptors.request.use(addAuthToken, (error) => Promise.reject(error))

// Response interceptor for error handling
const handleResponse = (response) => {
  if (response.config.data instanceof FormData) {
    console.log("[v0] FileUploadAPI response:", response.data)
  }
  return response
}

const handleError = (error) => {
  if (error.config?.data instanceof FormData) {
    console.error("[v0] FileUploadAPI error:", error.response?.data || error.message)
  }
  if (error.response?.status === 401) {
    localStorage.removeItem("token")
    window.location.href = "/login"
  }
  return Promise.reject(error)
}

baseAPI.interceptors.response.use(handleResponse, handleError)
fileUploadAPI.interceptors.response.use(handleResponse, handleError)

export default baseAPI
export { fileUploadAPI }
