import baseAPI, { fileUploadAPI } from "./baseAPI"

const applicationAPI = {
  applyForJob: (applicationData) => {
    // Check if applicationData contains a file
    if (applicationData instanceof FormData) {
      return fileUploadAPI.post("/applications", applicationData)
    }
    return baseAPI.post("/applications", applicationData)
  },
  getUserApplications: (userId, params) => baseAPI.get(`/applications/user/${userId}`, { params }),
  getJobApplications: (jobId, params) => baseAPI.get(`/applications/job/${jobId}`, { params }),
  updateApplicationStatus: (applicationId, statusData) =>
    baseAPI.put(`/applications/${applicationId}/status`, statusData),
  getApplicationById: (applicationId) => baseAPI.get(`/applications/${applicationId}`),
}

export default applicationAPI
