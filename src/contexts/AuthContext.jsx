// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react'
import { supabase } from '../services/supabaseClient'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    console.log('AuthProvider: Checking session...')
    
    // Fungsi untuk mendapatkan session dengan error handling
    const getSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          setError(error.message)
        } else {
          console.log('Session data:', data)
          setUser(data?.session?.user ?? null)
        }
      } catch (err) {
        console.error('Exception in getSession:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    try {
      console.log('Signing in with:', email)
      setError(null)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        console.error('Sign in error:', error)
        setError(error.message)
        return { data: null, error }
      }
      
      console.log('Sign in successful:', data)
      return { data, error: null }
      
    } catch (err) {
      console.error('Sign in exception:', err)
      setError(err.message)
      return { data: null, error: err }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error('Sign out error:', error)
      setError(error.message)
    }
  }

  const value = {
    user,
    loading,
    error,
    signIn,
    signOut,
    setError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
