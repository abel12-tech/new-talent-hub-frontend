import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import jobAPI from "../api/jobAPI"

// Async thunks
export const fetchJobs = createAsyncThunk("jobs/fetchJobs", async (params = {}, { rejectWithValue }) => {
  try {
    const response = await jobAPI.getJobs(params)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch jobs")
  }
})

export const fetchJobById = createAsyncThunk("jobs/fetchJobById", async (jobId, { rejectWithValue }) => {
  try {
    const response = await jobAPI.getJobById(jobId)
    return response.data.job
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch job")
  }
})

export const createJob = createAsyncThunk("jobs/createJob", async (jobData, { rejectWithValue }) => {
  try {
    const response = await jobAPI.createJob(jobData)
    return response.data.job
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to create job")
  }
})

export const updateJob = createAsyncThunk("jobs/updateJob", async ({ jobId, jobData }, { rejectWithValue }) => {
  try {
    const response = await jobAPI.updateJob(jobId, jobData)
    return response.data.job
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to update job")
  }
})

export const deleteJob = createAsyncThunk("jobs/deleteJob", async (jobId, { rejectWithValue }) => {
  try {
    await jobAPI.deleteJob(jobId)
    return jobId
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete job")
  }
})

export const fetchEmployerJobs = createAsyncThunk(
  "jobs/fetchEmployerJobs",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await jobAPI.getEmployerJobs(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch your jobs")
    }
  },
)

const initialState = {
  jobs: [],
  currentJob: null,
  employerJobs: [],
  pagination: {
    current: 1,
    pages: 1,
    total: 0,
  },
  filters: {
    search: "",
    location: "",
    jobType: "",
    skills: [],
  },
  isLoading: false,
  error: null,
}

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = initialState.filters
    },
    clearCurrentJob: (state) => {
      state.currentJob = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Jobs
      .addCase(fetchJobs.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.isLoading = false
        state.jobs = action.payload.jobs
        state.pagination = action.payload.pagination
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch Job by ID
      .addCase(fetchJobById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentJob = action.payload
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Create Job
      .addCase(createJob.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.isLoading = false
        state.employerJobs.unshift(action.payload)
      })
      .addCase(createJob.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Update Job
      .addCase(updateJob.fulfilled, (state, action) => {
        const index = state.employerJobs.findIndex((job) => job._id === action.payload._id)
        if (index !== -1) {
          state.employerJobs[index] = action.payload
        }
        if (state.currentJob && state.currentJob._id === action.payload._id) {
          state.currentJob = action.payload
        }
      })
      // Delete Job
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.employerJobs = state.employerJobs.filter((job) => job._id !== action.payload)
        state.jobs = state.jobs.filter((job) => job._id !== action.payload)
      })
      // Fetch Employer Jobs
      .addCase(fetchEmployerJobs.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchEmployerJobs.fulfilled, (state, action) => {
        state.isLoading = false
        state.employerJobs = action.payload.jobs
        state.pagination = action.payload.pagination
      })
      .addCase(fetchEmployerJobs.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { clearError, setFilters, clearFilters, clearCurrentJob } = jobSlice.actions
export default jobSlice.reducer
