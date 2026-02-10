// src/services/villaService.js
import { supabase } from './supabaseClient'

export const villaService = {
  // Get all villas for current user
  async getVillas() {
    const { data, error } = await supabase
      .from('villas')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Get single villa by ID
  async getVillaById(id) {
    const { data, error } = await supabase
      .from('villas')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Create new villa
  async createVilla(villaData) {
    const { data: { user } } = await supabase.auth.getUser()
    
    const villaWithUser = {
      ...villaData,
      user_id: user.id,
      harga_perbulan: parseFloat(villaData.harga_perbulan),
      harga_pertahun: parseFloat(villaData.harga_pertahun),
      fee_agen: parseFloat(villaData.fee_agen),
      fasilitas: Array.isArray(villaData.fasilitas) ? villaData.fasilitas : [],
    }

    const { data, error } = await supabase
      .from('villas')
      .insert([villaWithUser])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update villa
  async updateVilla(id, villaData) {
    const updatedData = {
      ...villaData,
      harga_perbulan: parseFloat(villaData.harga_perbulan),
      harga_pertahun: parseFloat(villaData.harga_pertahun),
      fee_agen: parseFloat(villaData.fee_agen),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('villas')
      .update(updatedData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Delete villa
  async deleteVilla(id) {
    const { error } = await supabase
      .from('villas')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Search villas
  async searchVillas(query) {
    const { data, error } = await supabase
      .from('villas')
      .select('*')
      .or(`nama_villa.ilike.%${query}%,lokasi.ilike.%${query}%,deskripsi.ilike.%${query}%`)
    
    if (error) throw error
    return data
  },

  // Get statistics
  async getStatistics() {
    const { data, error } = await supabase
      .from('villas')
      .select('*')
    
    if (error) throw error
    
    const totalVillas = data.length
    const totalRevenue = data.reduce((sum, villa) => {
      return sum + (villa.fee_agen || 0)
    }, 0)
    
    const averagePrice = data.length > 0 
      ? data.reduce((sum, villa) => sum + (villa.harga_perbulan || 0), 0) / data.length
      : 0
    
    return {
      totalVillas,
      totalRevenue,
      averagePrice,
      byLocation: this.groupByLocation(data),
      byStatus: this.groupByStatus(data),
    }
  },

  groupByLocation(villas) {
    return villas.reduce((groups, villa) => {
      const location = villa.lokasi || 'Unknown'
      groups[location] = (groups[location] || 0) + 1
      return groups
    }, {})
  },

  groupByStatus(villas) {
    return villas.reduce((groups, villa) => {
      const status = villa.status || 'unknown'
      groups[status] = (groups[status] || 0) + 1
      return groups
    }, {})
  },
}
