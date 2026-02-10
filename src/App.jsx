// src/App.jsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import PrivateRoute from './components/Auth/PrivateRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import VillaList from './pages/VillaList'
import VillaForm from './pages/VillaForm'
import VillaDetail from './pages/VillaDetail'
import Statistics from './pages/Statistics'
import Layout from './components/Layout/Layout'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/villas" element={
            <PrivateRoute>
              <Layout>
                <VillaList />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/villas/new" element={
            <PrivateRoute>
              <Layout>
                <VillaForm />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/villas/edit/:id" element={
            <PrivateRoute>
              <Layout>
                <VillaForm />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/villas/:id" element={
            <PrivateRoute>
              <Layout>
                <VillaDetail />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/statistics" element={
            <PrivateRoute>
              <Layout>
                <Statistics />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
