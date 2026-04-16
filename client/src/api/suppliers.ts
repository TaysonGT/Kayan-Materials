import axios from 'axios';
import type { Material, Supplier } from '../types';

const API_URL = '/api/suppliers';

export const fetchSuppliers = async (page: number, limit: number): Promise<{suppliers?: Supplier[], success:boolean, message?:string, total: number, limit: number, page: number }> => {
  const response = await axios.get(API_URL, {params: { page, limit }});
  return response.data;
};

export const createSupplier = async (supplier: Omit<Supplier, 'id'>): Promise<{supplier?: Supplier, success:boolean, message?:string}> => {
  const response = await axios.post(API_URL, supplier);
  return response.data;
}

export const patchSupplier = async (id: string, supplier: Partial<Omit<Supplier, 'id'>>): Promise<{supplier?: Supplier, success:boolean, message?:string}> => {
  const response = await axios.put(`${API_URL}/${id}`, supplier);
  return response.data;
}

export const deleteSupplier = async (id: string): Promise<{success:boolean, message?:string}> => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
}

export const getSupplierById = async (id: string): Promise<{supplier?: Supplier, success:boolean, message?:string}> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
}

export const getMaterialsBySupplierId = async (id: string): Promise<{materials?: Material[], success:boolean, message?:string}> => {
  const response = await axios.get(`${API_URL}/${id}/materials`);
  return response.data;
}

export const addMaterialToSupplier = async (supplierId: string, materialId: string): Promise<{success:boolean, message?:string}> => {
  const response = await axios.post(`/supplier-materials/${supplierId}/${materialId}`);
  return response.data;
}

export const removeSupplierMaterialRelation = async (supplierId: string, materialId: string): Promise<{success:boolean, message?:string}> => {
  const response = await axios.delete(`/supplier-materials/${supplierId}/${materialId}`);
  return response.data;
}