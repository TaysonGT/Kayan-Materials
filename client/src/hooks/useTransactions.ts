import { useEffect, useState } from 'react'
import type { Transaction, TRANSACTION_STATUS } from '../types'
import { createTransaction, fetchSupplierMaterialTransactions, fetchTransactions, getCalculateSupplierMaterial, getDetailedCosts, getTransactionById, patchTransaction, removeTransaction } from '../api/transactions'
import { toast } from 'react-toastify'

export const useTransactions = () => {
  const [transactions, setTransaction] = useState<Transaction[]>([])
  const [statusFilter, setStatusFilter] = useState<TRANSACTION_STATUS|undefined>()
  const [supplierFilter, setSupplierFilter] = useState<string>()
  const [materialFilter, setMaterialFilter] = useState<string>()
  const [pagination, setPagination] = useState({ page: 1, limit: 10 })
  const [maxPages, setMaxPages] = useState(0)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [detailedCosts, setDetailedCosts] = useState({total:0, materialCost: 0, supplierCost: 0, receivedCosts: 0, notReceivedCosts: 0})

  const refetchTransactions = async () => {
    setLoading(true)
    const {transactions, success, message, total:transactionsTotal} = await fetchTransactions({page: pagination.page, limit: pagination.limit, status: statusFilter, supplierId: supplierFilter, materialId: materialFilter})
    const {total, materialCost, supplierCost, receivedCosts, notReceivedCosts, success: costsSuccess, message: costsMessage} = await getDetailedCosts({status: statusFilter, supplier: supplierFilter, material: materialFilter})

    if(!success){
      toast.error(message || 'Failed to fetch transactions')
      return
    }
    
    if(!costsSuccess){
      toast.error(costsMessage || 'Failed to fetch costs')
      return
    }

    setTransaction(transactions||[])
    setMaxPages(Math.ceil((transactionsTotal || 0) / pagination.limit))
    setTotal(transactionsTotal || 0)
    setDetailedCosts({total, materialCost, supplierCost, receivedCosts, notReceivedCosts})
    setLoading(false)
  }

  const modifyPagination = (newPagination: Partial<typeof pagination>) => {
    setPagination(prev => ({...prev, ...newPagination}))
  }

  useEffect(()=>{
    refetchTransactions()
  },[pagination, statusFilter, materialFilter, supplierFilter])

  const addTransaction = async (transaction: Omit<Transaction, 'id'|'supplier'|'material'>) => {
    const {success, message} = await createTransaction(transaction)
    if(!success){
      toast.error(message || 'Failed to create transaction')
      return
    }
    setStatusFilter(undefined)
    toast.success(message || 'Transaction created successfully')
    refetchTransactions()
  }

  const updateTransaction = async (id: string, transaction: Partial<Transaction>) => {
    const {success, message} = await patchTransaction(id, transaction)
    if(!success){
      toast.error(message || 'Failed to update transaction')
      return
    }
    toast.success(message || 'Transaction updated successfully')
    refetchTransactions()
  }

  const deleteTransaction = async (id: string) => {
    const {success, message} = await removeTransaction(id)
    if(!success){
      toast.error(message || 'Failed to delete transaction')
      return
    }
    toast.success(message || 'Transaction deleted successfully')
    refetchTransactions()
  }

  const getTransaction = async(id: string) => {
    const {success, transaction, message} = await getTransactionById(id)
    if(!success){
      toast.error(message || 'Failed to fetch transaction')
      return
    }
    return transaction;
  }

  const getSupplierMaterialCosts = async(supplierId: string, materialId: string) => {
    const data = await getCalculateSupplierMaterial({supplier: supplierId, material: materialId})
    if(!data.success){
      toast.error(data.message || 'Failed to remove material')
      return
    }
    return data;
  }
  
  const getSupplierMaterialTransactions = async(params?: {supplierId: string, materialId: string, page: number, limit: number}) => {
    const data = await fetchSupplierMaterialTransactions(params)
    if(!data.success){
      toast.error(data.message || 'Failed to remove material')
      return
    }
    return data;
  }

  return {
    transactions,
    loading,
    total,
    maxPages,
    pagination,
    modifyPagination,
    refetchTransactions,
    getSupplierMaterialCosts,
    getSupplierMaterialTransactions,
    statusFilter,
    supplierFilter,
    materialFilter,
    setStatusFilter,
    setMaterialFilter,
    setSupplierFilter,
    getTransaction,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    detailedCosts
  }
}
