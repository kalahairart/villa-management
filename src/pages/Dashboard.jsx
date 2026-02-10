// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { villaService } from '../services/villaService'
import {
  Building,
  DollarSign,
  TrendingUp,
  MapPin,
  Calendar
} from 'lucide-react'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalVillas: 0,
    totalRevenue: 0,
    averagePrice: 0,
    byLocation: {},
    byStatus: {}
  })
  const [recentVillas, setRecentVillas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [villas, statistics] = await Promise.all([
        villaService.getVillas(),
        villaService.getStatistics()
      ])
      
      setStats(statistics)
      setRecentVillas(villas.slice(0, 5))
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Villa',
      value: stats.totalVillas,
      icon: <Building className="text-blue-600" size={24} />,
      color: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Pendapatan Fee',
      value: `Rp ${stats.totalRevenue.toLocaleString('id-ID')}`,
      icon: <DollarSign className="text-green-600" size={24} />,
      color: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Rata-rata Harga',
      value: `Rp ${Math.round(stats.averagePrice).toLocaleString('id-ID')}`,
      icon: <TrendingUp className="text-purple-600" size={24} />,
      color: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Lokasi Terbanyak',
      value: Object.keys(stats.byLocation)[0] || '-',
      icon: <MapPin className="text-orange-600" size={24} />,
      color: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h1>
      <p className="text-gray-600 mb-6">Overview manajemen villa Anda</p>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`${card.color} rounded-xl p-6 shadow-sm`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600">{card.title}</p>
                <p className={`text-2xl font-bold mt-2 ${card.textColor}`}>
                  {card.value}
                </p>
              </div>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Villas */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Villa Terbaru</h2>
            <Link
              to="/villas"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Lihat Semua →
            </Link>
          </div>

          <div className="space-y-4">
            {recentVillas.map((villa) => (
              <div
                key={villa.id}
                className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg"
              >
                {villa.foto_url ? (
                  <img
                    src={villa.foto_url}
                    alt={villa.nama_villa}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                    <Building size={20} className="text-gray-400" />
                  </div>
                )}
                
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 truncate">
                    {villa.nama_villa}
                  </h3>
                  <p className="text-sm text-gray-600">{villa.lokasi}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm font-semibold text-blue-600">
                      Rp {parseInt(villa.harga_perbulan).toLocaleString('id-ID')}/bulan
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {recentVillas.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Belum ada villa. Mulai tambahkan villa pertama Anda!
              </div>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="space-y-8">
          {/* Status Distribution */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Distribusi Status</h2>
            <div className="space-y-4">
              {Object.entries(stats.byStatus).map(([status, count]) => (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 capitalize">{status}</span>
                    <span className="font-medium">{count} villa</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        status === 'available' ? 'bg-green-500' :
                        status === 'booked' ? 'bg-red-500' :
                        'bg-yellow-500'
                      }`}
                      style={{ width: `${(count / stats.totalVillas) * 100 || 0}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow p-6 text-white">
            <h2 className="text-lg font-semibold mb-4">Aksi Cepat</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/villas/new"
                className="bg-white/20 hover:bg-white/30 p-4 rounded-lg flex flex-col items-center justify-center transition-colors"
              >
                <PlusCircle size={24} />
                <span className="mt-2 text-sm font-medium">Tambah Villa</span>
              </Link>
              <Link
                to="/statistics"
                className="bg-white/20 hover:bg-white/30 p-4 rounded-lg flex flex-col items-center justify-center transition-colors"
              >
                <BarChart3 size={24} />
                <span className="mt-2 text-sm font-medium">Lihat Statistik</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
