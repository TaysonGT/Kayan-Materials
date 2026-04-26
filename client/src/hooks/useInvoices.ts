import { useEffect, useState } from 'react'
import type { Invoice } from '../types'
import { deleteInvoice, fetchInvoices, getInvoiceById, patchInvoice, type InvoicePayload } from '../api/invoices'
import { toast } from 'react-toastify'
import { newInvoice } from '../services/invoices.service'

export const useInvoices = ({autoRefetch=true}:{autoRefetch?:boolean}) => {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10 })
  const [maxPages, setMaxPages] = useState(0)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [supplierFilter, setSupplierFilter] = useState<string>()
  const [materialFilter, setMaterialFilter] = useState<string>()

  const refetchInvoices = async () => {
    setLoading(true)
    const {invoices, success, message, total:invoicesTotal} = await fetchInvoices({page:pagination.page, limit:pagination.limit, supplierId: supplierFilter, materialId:materialFilter})
    if(!success){
      toast.error(message || 'Failed to fetch invoices')
      return
    }
    setInvoices(invoices||[])
    setMaxPages(Math.ceil((invoicesTotal || 0) / pagination.limit))
    setTotal(invoicesTotal || 0)
    setLoading(false)
  }

  useEffect(()=>{
    autoRefetch&&refetchInvoices()
  },[pagination, materialFilter, supplierFilter])

  const modifyPagination = (newPagination: Partial<typeof pagination>) => {
    setPagination(prev => ({...prev, ...newPagination}))
  }

  const addInvoice = async(invoicePayload: InvoicePayload) => {
    const {invoice} = await newInvoice(invoicePayload)
    autoRefetch&&refetchInvoices()
    return {invoice}
  }

  const updateInvoice = async(id: string, invoice: InvoicePayload) => {
    const {success, message} = await patchInvoice(id, invoice)
    if(!success){
      toast.error(message || 'Failed to update material')
      return
    }
    toast.success(message || 'Material updated successfully')
    autoRefetch&&refetchInvoices()
  }

  const removeInvoice = async(id: string) => {
    const {success, message} = await deleteInvoice(id)
    if(!success){
      toast.error(message || 'Failed to delete material')
      return
    }
    toast.success(message || 'Material deleted successfully')
    autoRefetch&&refetchInvoices()
  }

  const getInvoice = async(id: string) => {
    const {invoice, success, message} = await getInvoiceById(id)
    if(!success){
      toast.error(message)
      return
    }
    return invoice;
  }

  return {
    invoices,
    total,
    loading,
    refetchInvoices,
    addInvoice,
    updateInvoice,
    removeInvoice,
    getInvoice,
    maxPages,
    modifyPagination,
    pagination,
    materialFilter,
    supplierFilter,
    setMaterialFilter,
    setSupplierFilter
  }
}
