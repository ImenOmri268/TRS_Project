'use client'
import { useState, useEffect } from 'react'

export function usePermissions() {
  const [permissions, setPermissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [userType, setUserType] = useState(null)

  useEffect(() => {
    fetch('/api/user/profil')
      .then(res => res.json())
      .then(data => {
        setPermissions(data.permissions || [])
        setUserType(data.type)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const can = (permission) => {
    // ADMIN peut tout faire
    if (userType === 'ADMIN') return true
    return permissions.includes(permission)
  }

  return { permissions, loading, userType, can }
}