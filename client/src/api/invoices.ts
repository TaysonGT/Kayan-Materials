import axios from 'axios';
import type { Invoice, TRANSACTION_STATUS } from '../types';
import type { TransactionPayload } from './transactions';

const API_URL = '/api/invoices';

export interface InvoicePayload extends Omit<Invoice,'id'|'supplier'|'createdAt'> {
  supplierId: string;
  createdAt: string;
}

export const fetchInvoices = async (params?: {page?: number, limit?: number, materialId?: string, supplierId?: string, status?: TRANSACTION_STATUS}): Promise<{invoices?: Invoice[], success:boolean, message: string, total: number, limit: number, page: number}> => {
  const response = await axios.get(API_URL, { params });
  return response.data;
};

export const fetchSupplierMaterialInvoices = async (params?: {page?: number, limit?: number, materialId: string, supplierId: string, status?: TRANSACTION_STATUS}): Promise<{invoices: Invoice[], success:boolean, message: string, total: number, limit: number, page: number}> => {
  const response = await axios.get(`${API_URL}/supplier-material`, { params });
  return response.data;
};

export const getCalculateSupplierMaterial = async (params?: {material?: string, supplier?: string}): Promise<{total: number, materialTotal: number, freightTotal: number, averageCost: number, materialUnitCount: number, success:boolean, message: string}> => {
  const response = await axios.get(`${API_URL}/calculate`, { params });
  return response.data;
};

export const createInvoice = async (invoice: InvoicePayload): Promise<{invoice?: Invoice, success:boolean, message: string}> => {
  const response = await axios.post(API_URL, invoice);
  return response.data;
}

export const addTransactionToInvoice = async (transaction: TransactionPayload): Promise<{invoice?: Invoice, success:boolean, message: string}> => {
  const response = await axios.post(`${API_URL}/transaction/${transaction.invoiceId}`, transaction);
  return response.data;
}

export const patchInvoice = async (id: string, invoice: Partial<InvoicePayload>): Promise<{invoice?: Invoice, success:boolean, message: string}> => {
  const response = await axios.put(`${API_URL}/${id}`, invoice);
  return response.data;
}

export const deleteInvoice = async (id: string): Promise<{success:boolean, message: string}> => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
}

export const getInvoiceById = async (id: string): Promise<{invoice?: Invoice, success:boolean, message: string}> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
}