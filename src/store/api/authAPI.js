import baseAPI from "./baseAPI"

const authAPI = {
  login: (credentials) => baseAPI.post("/auth/login", credentials),
  register: (userData) => baseAPI.post("/auth/register", userData),
  getProfile: () => baseAPI.get("/auth/profile"),
  updateProfile: (profileData) => baseAPI.put("/auth/profile", profileData),
}

export default authAPI
