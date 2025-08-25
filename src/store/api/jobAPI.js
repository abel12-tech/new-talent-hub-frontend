import baseAPI from "./baseAPI"

const jobAPI = {
  getJobs: (params) => baseAPI.get("/jobs", { params }),
  getJobById: (jobId) => baseAPI.get(`/jobs/${jobId}`),
  createJob: (jobData) => baseAPI.post("/jobs", jobData),
  updateJob: (jobId, jobData) => baseAPI.put(`/jobs/${jobId}`, jobData),
  deleteJob: (jobId) => baseAPI.delete(`/jobs/${jobId}`),
  getEmployerJobs: (params) => baseAPI.get("/jobs/employer/my-jobs", { params }),
}

export default jobAPI
