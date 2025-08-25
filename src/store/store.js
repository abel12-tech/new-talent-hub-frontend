import { configureStore } from "@reduxjs/toolkit"
import authSlice from "./slices/authSlice"
import jobSlice from "./slices/jobSlice"
import applicationSlice from "./slices/applicationSlice"

export const store = configureStore({
  reducer: {
    auth: authSlice,
    jobs: jobSlice,
    applications: applicationSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
})

export default store
