"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { loadUser } from "../store/slices/authSlice"

const useAuth = () => {
  const dispatch = useDispatch()
  const { user, isAuthenticated, isLoading, token } = useSelector((state) => state.auth)

  useEffect(() => {
    if (token && !user && !isLoading) {
      dispatch(loadUser())
    }
  }, [dispatch, token, user, isLoading])

  return {
    user,
    isAuthenticated,
    isLoading,
    token,
  }
}

export default useAuth
