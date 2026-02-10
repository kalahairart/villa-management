// src/pages/VillaForm.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { villaService } from '../services/villaService'
import { ArrowLeft, Save, Upload } from 'lucide-react'

const VillaForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    nama_villa: '',
    foto_url: '',
    deskripsi: '',
    lokasi: '',
    harga_perbulan: '',
    harga_pertahun: '',
    fee_agen: '',
    status: 'available',
    fasilitas: [],
    jumlah_kamar: 1,
    kapasitas: 2,
  })

  const fasilitasOptions = [
    'Kolam Renang', 'AC', 'WiFi', 'Parkir', 'Dapur', 'TV',
    'Breakfast', 'Laundry', 'Gym', 'Spa', 'Sea View', 'Garden'
  ]

  useEffect(() => {
    if (id) {
      loadVilla()
    }
  }, [id])

  const loadVilla = async () => {
    try {
      setLoading(true)
      const villa = await villaService.getVillaById(id)
      setFormData({
        ...villa,
        harga_perbulan: villa.harga_perbulan?.toString() || '',
        harga_pertahun: villa.harga_pertahun?.toString() || '',
        fee_agen: villa.fee_agen?.toString() || '',
      })
    } catch (error) {
      setError('Gagal memuat data villa')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFasilitasChange = (fasilitas) => {
    setFormData(prev => {
      const currentFasilitas = [...prev.fasilitas]
      if (currentFasilitas.includes(fasilitas)) {
        return {
          ...prev,
          fasilitas: currentFasilitas.filter(f => f !== fasilitas)
        }
      } else {
        return {
          ...prev,
          fasilitas: [...currentFasilitas, fasilitas]
        }
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (id) {
        await villaService.updateVilla(id, formData)
      } else {
        await villaService.createVilla(formData)
      }
      navigate('/villas')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const calculatePertahun = () => {
    const perbulan = parseFloat(formData.harga_perbulan) || 0
    return (perbulan * 12).toLocaleString('id-ID')
  }

  const calculateFeePercentage = () => {
    const harga = parseFloat(formData.harga_perbulan) || 1
    const fee = parseFloat(formData.fee_agen) || 0
    return ((fee / harga) * 100).toFixed(1)
  }

  if (loading && id) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/villas')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {id ? 'Edit Villa' : 'Tambah Villa Baru'}
            </h1>
            <p className="text-gray-600">
              {id ? 'Perbarui informasi villa' : 'Tambahkan villa baru ke dalam sistem'}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informasi Dasar */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Informasi Dasar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Villa *
              </label>
              <input
                type="text"
                name="nama_villa"
                value={formData.nama_villa}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lokasi *
              </label>
              <input
                type="text"
                name="lokasi"
                value={formData.lokasi}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL Foto
              </label>
              <div className="flex space-x-2">
                <input
                  type="url"
                  name="foto_url"
                  value={formData.foto_url}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/foto.jpg"
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center space-x-2"
                >
                  <Upload size={16} />
                  <span>Upload</span>
                </button>
              </div>
              {formData.foto_url && (
                <div className="mt-2">
                  <img
                    src={formData.foto_url}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="available">Tersedia</option>
                <option value="booked">Dipesan</option>
                <option value="maintenance">Perawatan</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi
            </label>
            <textarea
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Deskripsikan villa secara detail..."
            />
          </div>
        </div>

        {/* Spesifikasi */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Spesifikasi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jumlah Kamar
              </label>
              <input
                type="number"
                name="jumlah_kamar"
                value={formData.jumlah_kamar}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kapasitas (orang)
              </label>
              <input
                type="number"
                name="kapasitas"
                value={formData.kapasitas}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fasilitas
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {fasilitasOptions.map((fasilitas) => (
                <label
                  key={fasilitas}
                  className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.fasilitas.includes(fasilitas)}
                    onChange={() => handleFasilitasChange(fasilitas)}
                    className="rounded text-blue-600"
                  />
                  <span className="text-sm">{fasilitas}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Harga dan Fee */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Harga dan Komisi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Harga per Bulan (Rp) *
              </label>
              <input
                type="number"
                name="harga_perbulan"
                value={formData.harga_perbulan}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Harga per Tahun (Rp)
              </label>
              <div className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                <p className="text-lg font-semibold text-gray-800">
                  Rp {calculatePertahun()}
                </p>
                <p className="text-xs text-gray-500">Otomatis dihitung (12 bulan)</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fee Agen (Rp) *
              </label>
              <input
                type="number"
                name="fee_agen"
                value={formData.fee_agen}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {calculateFeePercentage()}% dari harga bulanan
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/villas')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50"
          >
            <Save size={20} />
            <span>{loading ? 'Menyimpan...' : 'Simpan Villa'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default VillaForm
