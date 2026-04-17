import axios from "axios";

const API_URL = '/api/supplier-materials'

export const addMaterialToSupplier = async (supplierId: string, materialId: string): Promise<{success:boolean, message?:string}> => {
  const response = await axios.post(`${API_URL}/${supplierId}/${materialId}`);
  return response.data;
}

export const removeSupplierMaterialRelation = async (supplierId: string, materialId: string): Promise<{success:boolean, message?:string}> => {
  const response = await axios.delete(`${API_URL}/${supplierId}/${materialId}`);
  return response.data;
}