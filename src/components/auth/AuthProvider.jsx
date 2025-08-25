"use client"

import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { loadUser } from "../../store/slices/authSlice"
import { isTokenExpired } from "../../utils/auth"

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (token && !isTokenExpired(token)) {
      dispatch(loadUser())
    } else if (token) {
      // Token is expired, remove it
      localStorage.removeItem("token")
    }
  }, [dispatch])

  return children
}

export default AuthProvider
