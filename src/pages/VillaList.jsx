// src/pages/VillaList.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { villaService } from '../services/villaService'
import { 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  Plus
} from 'lucide-react'

const VillaList = () => {
  const [villas, setVillas] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    loadVillas()
  }, [])

  const loadVillas = async () => {
    try {
      setLoading(true)
      const data = await villaService.getVillas()
      setVillas(data)
    } catch (error) {
      console.error('Error loading villas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus villa ini?')) {
      try {
        await villaService.deleteVilla(id)
        setVillas(villas.filter(villa => villa.id !== id))
      } catch (error) {
        console.error('Error deleting villa:', error)
      }
    }
  }

  const filteredVillas = villas.filter(villa => {
    const matchesSearch = villa.nama_villa.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         villa.lokasi.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || villa.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'booked': return 'bg-red-100 text-red-800'
      case 'maintenance': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'available': return 'Tersedia'
      case 'booked': return 'Dipesan'
      case 'maintenance': return 'Perawatan'
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Daftar Villa</h1>
          <p className="text-gray-600">Kelola semua villa yang Anda promosikan</p>
        </div>
        <Link
          to="/villas/new"
          className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Tambah Villa</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari villa atau lokasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Semua Status</option>
                <option value="available">Tersedia</option>
                <option value="booked">Dipesan</option>
                <option value="maintenance">Perawatan</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Villa Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVillas.map((villa) => (
          <div key={villa.id} className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              {villa.foto_url ? (
                <img
                  src={villa.foto_url}
                  alt={villa.nama_villa}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
                  <span className="text-gray-500">Tidak ada gambar</span>
                </div>
              )}
              <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(villa.status)}`}>
                {getStatusText(villa.status)}
              </span>
            </div>

            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-800 truncate">
                {villa.nama_villa}
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                <span className="flex items-center">
                  📍 {villa.lokasi}
                </span>
              </p>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                {villa.deskripsi || 'Tidak ada deskripsi'}
              </p>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Harga/Bulan</p>
                  <p className="font-semibold text-gray-800">
                    Rp {parseInt(villa.harga_perbulan).toLocaleString('id-ID')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Fee Agen</p>
                  <p className="font-semibold text-blue-600">
                    Rp {parseInt(villa.fee_agen).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">
                    🛏️ {villa.jumlah_kamar} kamar
                  </span>
                  <span className="text-xs text-gray-500">
                    👥 {villa.kapasitas} orang
                  </span>
                </div>

                <div className="flex space-x-2">
                  <Link
                    to={`/villas/${villa.id}`}
                    className="p-2 text-gray-600 hover:text-blue-600"
                    title="Detail"
                  >
                    <Eye size={18} />
                  </Link>
                  <Link
                    to={`/villas/edit/${villa.id}`}
                    className="p-2 text-gray-600 hover:text-green-600"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(villa.id)}
                    className="p-2 text-gray-600 hover:text-red-600"
                    title="Hapus"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVillas.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Building size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Tidak ada villa ditemukan
          </h3>
          <p className="text-gray-500">
            {villas.length === 0 
              ? 'Belum ada villa. Tambahkan villa pertama Anda!'
              : 'Coba ubah filter pencarian Anda.'}
          </p>
        </div>
      )}
    </div>
  )
}

export default VillaList
