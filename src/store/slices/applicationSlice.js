import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import applicationAPI from "../api/applicationAPI"

// Async thunks
export const applyForJob = createAsyncThunk(
  "applications/applyForJob",
  async (applicationData, { rejectWithValue }) => {
    try {
      const response = await applicationAPI.applyForJob(applicationData)
      return response.data.application
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to apply for job")
    }
  },
)

export const fetchUserApplications = createAsyncThunk(
  "applications/fetchUserApplications",
  async ({ userId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await applicationAPI.getUserApplications(userId, params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch applications")
    }
  },
)

export const fetchJobApplications = createAsyncThunk(
  "applications/fetchJobApplications",
  async ({ jobId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await applicationAPI.getJobApplications(jobId, params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch job applications")
    }
  },
)

export const updateApplicationStatus = createAsyncThunk(
  "applications/updateApplicationStatus",
  async ({ applicationId, status, notes }, { rejectWithValue }) => {
    try {
      const response = await applicationAPI.updateApplicationStatus(applicationId, { status, notes })
      return response.data.application
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update application status")
    }
  },
)

export const fetchApplicationById = createAsyncThunk(
  "applications/fetchApplicationById",
  async (applicationId, { rejectWithValue }) => {
    try {
      const response = await applicationAPI.getApplicationById(applicationId)
      return response.data.application
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch application")
    }
  },
)

const initialState = {
  userApplications: [],
  jobApplications: [],
  currentApplication: null,
  pagination: {
    current: 1,
    pages: 1,
    total: 0,
  },
  isLoading: false,
  error: null,
}

const applicationSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentApplication: (state) => {
      state.currentApplication = null
    },
    clearJobApplications: (state) => {
      state.jobApplications = []
    },
  },
  extraReducers: (builder) => {
    builder
      // Apply for Job
      .addCase(applyForJob.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(applyForJob.fulfilled, (state, action) => {
        state.isLoading = false
        state.userApplications.unshift(action.payload)
      })
      .addCase(applyForJob.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch User Applications
      .addCase(fetchUserApplications.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUserApplications.fulfilled, (state, action) => {
        state.isLoading = false
        state.userApplications = action.payload.applications
        state.pagination = action.payload.pagination
      })
      .addCase(fetchUserApplications.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch Job Applications
      .addCase(fetchJobApplications.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchJobApplications.fulfilled, (state, action) => {
        state.isLoading = false
        state.jobApplications = action.payload.applications
        state.pagination = action.payload.pagination
      })
      .addCase(fetchJobApplications.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Update Application Status
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        const index = state.jobApplications.findIndex((app) => app._id === action.payload._id)
        if (index !== -1) {
          state.jobApplications[index] = action.payload
        }
        if (state.currentApplication && state.currentApplication._id === action.payload._id) {
          state.currentApplication = action.payload
        }
      })
      // Fetch Application by ID
      .addCase(fetchApplicationById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchApplicationById.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentApplication = action.payload
      })
      .addCase(fetchApplicationById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { clearError, clearCurrentApplication, clearJobApplications } = applicationSlice.actions
export default applicationSlice.reducer
