import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './services/supabaseClient'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import VillaList from './pages/VillaList'
import VillaForm from './pages/VillaForm'
import './index.css'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!session ? <Login /> : <Navigate to="/" />} />
        <Route path="/" element={session ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/villas" element={session ? <VillaList /> : <Navigate to="/login" />} />
        <Route path="/villas/new" element={session ? <VillaForm /> : <Navigate to="/login" />} />
        <Route path="/villas/edit/:id" element={session ? <VillaForm /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App
