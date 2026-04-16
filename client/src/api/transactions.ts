import axios from 'axios';
import type { Transaction, TRANSACTION_STATUS } from '../types';

const API_URL = '/api/transactions';

export const fetchTransactions = async (params?: {page?: number, limit?: number, materialId?: string, supplierId?: string, status?: TRANSACTION_STATUS}): Promise<{transactions?: Transaction[], success:boolean, message: string, total: number, limit: number, page: number}> => {
  const response = await axios.get(API_URL, { params });
  return response.data;
};

export const fetchSupplierMaterialTransactions = async (params?: {page?: number, limit?: number, materialId: string, supplierId: string, status?: TRANSACTION_STATUS}): Promise<{transactions: Transaction[], success:boolean, message: string, total: number, limit: number, page: number}> => {
  const response = await axios.get(`${API_URL}/supplier-material`, { params });
  return response.data;
};

export const getCalculateSupplierMaterial = async (params?: {material?: string, supplier?: string}): Promise<{total: number, materialTotal: number, freightTotal: number, averageCost: number, materialUnitCount: number, success:boolean, message: string}> => {
  const response = await axios.get(`${API_URL}/calculate`, { params });
  return response.data;
};

export const createTransaction = async (transaction: Omit<Transaction, 'id'|'supplier'|'material'>): Promise<{transaction?: Transaction, success:boolean, message: string}> => {
  const response = await axios.post(API_URL, transaction);
  return response.data;
}

export const patchTransaction = async (id: string, transaction: Partial<Omit<Transaction, 'id'|'supplier'|'material'>>): Promise<{transaction?: Transaction, success:boolean, message: string}> => {
  const response = await axios.put(`${API_URL}/${id}`, transaction);
  return response.data;
}

export const removeTransaction = async (id: string): Promise<{success:boolean, message: string}> => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
}

export const getTransactionById = async (id: string): Promise<{transaction?: Transaction, success:boolean, message: string}> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
}

export const getDetailedCosts = async (params:{material?: string, supplier?: string, status?: TRANSACTION_STATUS}): Promise<{total: number, materialCost: number, supplierCost: number, receivedCosts: number, notReceivedCosts: number, success:boolean, message: string}> => {
  const response = await axios.get(`${API_URL}/detailed`, {params});
  return response.data;
}