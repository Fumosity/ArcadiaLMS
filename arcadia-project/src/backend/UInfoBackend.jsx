"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../supabaseClient"

export const useUserInformations = (propUser, userId, source) => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isSuperadminModalOpen, setIsSuperadminModalOpen] = useState(false)

  useEffect(() => {
    const fetchUserData = async (id) => {
      try {
        const { data, error } = await supabase.from("user_accounts").select("*").eq("userID", id).single()

        if (error) throw error
        return data
      } catch (error) {
        console.error("Error fetching user data:", error)
        return null
      }
    }

    const initializeUser = async () => {
      setLoading(true)
      let userData

      if (propUser && (propUser.userID || propUser.userId)) {
        userData = await fetchUserData(propUser.userID || propUser.userId)
      } else if (userId) {
        userData = await fetchUserData(userId)
      }

      if (userData) {
        setUser(normalizeUserObject(userData))
      } else {
        console.error("No user data available")
        navigate(source === "settings" ? "/admin/settings" : "/admin/useraccounts")
      }

      setLoading(false)
    }

    initializeUser()
  }, [propUser, userId, navigate, source])

  const normalizeUserObject = (userObj) => {
    return {
      userID: userObj.userID,
      userFName: userObj.userFName,
      userLName: userObj.userLName,
      userEmail: userObj.userEmail,
      userAccountType: userObj.userAccountType,
      userLPUID: userObj.userLPUID,
      userCollege: userObj.userCollege,
      userDepartment: userObj.userDepartment,
      userVerifyStatus: userObj.userVerifyStatus,
      userPicture: userObj.userPicture,
    }
  }

  const handleModify = () => setIsModalOpen(true)

  const handleDelete = async () => {
    try {
      const { error } = await supabase.from("user_accounts").delete().eq("userID", user.userID)
      if (error) throw error
      alert("User account successfully deleted.")
      navigate(source === "settings" ? "/admin/settings" : "/admin/useraccounts")
    } catch (error) {
      console.error("Unexpected error:", error)
      alert("An unexpected error occurred.")
    }
  }

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser)
    setIsModalOpen(false)
    console.log("User updated:", updatedUser)
  }

  const formatSchoolNo = (value) => {
    if (!value) return ""
    let numericValue = value.replace(/\D/g, "")
    if (numericValue.length > 4) {
      numericValue = `${numericValue.slice(0, 4)}-${numericValue.slice(4)}`
    }
    if (numericValue.length > 6) {
      numericValue = `${numericValue.slice(0, 6)}-${numericValue.slice(6, 11)}`
    }
    return numericValue
  }

  return {
    user,
    loading,
    isModalOpen,
    setIsModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isSuperadminModalOpen,
    setIsSuperadminModalOpen,
    handleModify,
    handleDelete,
    handleUserUpdate,
    formatSchoolNo,
  }
}

