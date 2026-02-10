// src/components/Layout/Sidebar.jsx
import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  Home, 
  Building, 
  PlusCircle, 
  BarChart3,
  LogOut 
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const Sidebar = () => {
  const { signOut } = useAuth()

  const navItems = [
    { to: '/', icon: <Home size={20} />, label: 'Dashboard' },
    { to: '/villas', icon: <Building size={20} />, label: 'Daftar Villa' },
    { to: '/villas/new', icon: <PlusCircle size={20} />, label: 'Tambah Villa' },
    { to: '/statistics', icon: <BarChart3 size={20} />, label: 'Statistik' },
  ]

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-4 hidden md:block">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-800">Villa Management</h1>
        <p className="text-sm text-gray-500">Kelola properti Anda</p>
      </div>
      
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
        
        <button
          onClick={signOut}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 w-full text-left"
        >
          <LogOut size={20} />
          <span>Keluar</span>
        </button>
      </nav>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-sm text-blue-800">Tips</h3>
        <p className="text-xs text-blue-600 mt-1">
          Upload foto berkualitas tinggi untuk menarik perhatian calon penyewa.
        </p>
      </div>
    </aside>
  )
}

export default Sidebar
