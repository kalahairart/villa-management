// src/App.jsx
import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'

// Lazy load untuk optimize
const Login = React.lazy(() => import('./pages/Login'))
const Dashboard = React.lazy(() => import('./pages/Dashboard'))
const VillaList = React.lazy(() => import('./pages/VillaList'))
const VillaForm = React.lazy(() => import('./pages/VillaForm'))

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Memuat aplikasi...</p>
    </div>
  </div>
)

// Private Route wrapper
const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      try {
        // Cek apakah ada token di localStorage
        const token = localStorage.getItem('sb-auth-token')
        setIsAuthenticated(!!token)
      } catch (error) {
        console.error('Auth check error:', error)
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) return <LoadingSpinner />
  
  return isAuthenticated ? children : <Navigate to="/login" />
}

function App() {
  console.log('App component rendering...')
  
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route 
                path="/" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/villas" 
                element={
                  <PrivateRoute>
                    <VillaList />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/villas/new" 
                element={
                  <PrivateRoute>
                    <VillaForm />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/villas/edit/:id" 
                element={
                  <PrivateRoute>
                    <VillaForm />
                  </PrivateRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  )
}

export default App
