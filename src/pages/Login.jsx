// src/pages/Login.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Building, AlertCircle } from 'lucide-react'

const Login = () => {
  const [email, setEmail] = useState('agent@okcan.com')
  const [password, setPassword] = useState('password123')
  const [isLoading, setIsLoading] = useState(false)
  const [localError, setLocalError] = useState('')
  
  const { signIn, user, loading: authLoading, error: authError } = useAuth()
  const navigate = useNavigate()

  // Redirect jika sudah login
  useEffect(() => {
    console.log('Login page - Current user:', user)
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email || !password) {
      setLocalError('Email dan password harus diisi')
      return
    }

    setIsLoading(true)
    setLocalError('')

    try {
      console.log('Attempting login...')
      const { error } = await signIn(email, password)
      
      if (error) {
        console.error('Login failed:', error)
        setLocalError(error.message || 'Login gagal. Cek email dan password.')
      } else {
        console.log('Login successful, redirecting...')
        navigate('/')
      }
    } catch (err) {
      console.error('Login exception:', err)
      setLocalError('Terjadi kesalahan. Coba lagi nanti.')
    } finally {
      setIsLoading(false)
    }
  }

  // Tampilkan loading jika masih checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Building size={40} />
            <h1 className="text-3xl font-bold">Villa Management</h1>
          </div>
          <p className="text-blue-100">
            Sistem manajemen properti villa
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Error Display */}
          {(localError || authError) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle size={20} />
                <span className="font-medium">Error</span>
              </div>
              <p className="text-red-600 mt-1 text-sm">
                {localError || authError}
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="masukkan email"
              required
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="masukkan password"
              required
              disabled={isLoading}
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Memproses...
              </span>
            ) : (
              'Masuk'
            )}
          </button>
          
          <div className="pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600 mb-2">
              Demo Credentials:
            </p>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs font-mono text-gray-700 text-center">
                admin@example.com / password123
              </p>
            </div>
          </div>

          {/* Debug Info (Hanya di development) */}
          {import.meta.env.DEV && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-700">
                <strong>Debug Info:</strong> Check browser console (F12) for details
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default Login
