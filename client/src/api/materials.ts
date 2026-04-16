import axios from 'axios'
import type { Material, Supplier } from '../types'

const API_URL = '/api/materials'

export const fetchMaterials = async (page= 1, limit=10): Promise<{ materials: Material[], success: boolean, message?: string, total: number, limit: number, page: number }> => {
  const response = await axios.get(API_URL, { params: { page, limit } })
  return response.data
}

export const createMaterial = async (material: Omit<Material, 'id'>): Promise<{ material: Material, success: boolean, message?: string }> => {
  const response = await axios.post(API_URL, material)
  return response.data
}

export const patchMaterial = async (id: string, material: Partial<Omit<Material, 'id'>>): Promise<{ material: Material, success: boolean, message?: string }> => {
  const response = await axios.put(`${API_URL}/${id}`, material)
  return response.data
}

export const deleteMaterial = async (id: string): Promise<{ success: boolean, message?: string }> => {
  const response = await axios.delete(`${API_URL}/${id}`)
  return response.data
}

export const getMaterialById = async (id: string): Promise<{ material: Material, success: boolean, message?: string }> => {
  const response = await axios.get(`${API_URL}/${id}`)
  return response.data
}

export const getMaterialInvoices = async (id: string): Promise<{ invoices: number[], success: boolean, message?: string }> => {
  const response = await axios.get(`${API_URL}/${id}/invoices`)
  return response.data
}

export const getSuppliersByMaterialId = async (id: string): Promise<{suppliers?: Supplier[], success:boolean, message?:string}> => {
  const response = await axios.get(`${API_URL}/${id}/suppliers`);
  return response.data;
}