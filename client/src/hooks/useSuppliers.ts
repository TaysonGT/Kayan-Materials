import { useEffect, useState } from 'react'
import type { Supplier } from '../types'
import { addMaterialToSupplier, createSupplier, deleteSupplier, fetchSuppliers, getMaterialsBySupplierId, getSupplierById, patchSupplier, removeSupplierMaterialRelation } from '../api/suppliers'
import { toast } from 'react-toastify'

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10 })
  const [maxPages, setMaxPages] = useState(0)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const refetchSuppliers = async () => {
    setLoading(true)
    const {suppliers, success, total:suppliersTotal} = await fetchSuppliers(pagination.page, pagination.limit)
    if(!success){
      toast.error('Failed to fetch suppliers')
      return
    }
    setSuppliers(suppliers||[])
    setMaxPages(Math.ceil((suppliersTotal || 0) / pagination.limit))
    setTotal(suppliersTotal || 0)
    setLoading(false)
  }

  const modifyPagination = (newPagination: Partial<typeof pagination>) => {
    setPagination(prev => ({...prev, ...newPagination}))
  }

  useEffect(()=>{
    refetchSuppliers()
  },[pagination])

  const addSupplier = async(supplier: Omit<Supplier, 'id'>) => {
    const newSupplier = await createSupplier(supplier)
    if(newSupplier.success){
      toast.success(newSupplier.message||'Supplier created successfully')
      refetchSuppliers()
    }else{
      toast.error(newSupplier.message || 'Failed to create supplier')
    }
  }

  const updateSupplier = async (id: string, supplier: Omit<Supplier, 'id'>) => {
    const {success, message} = await patchSupplier(id, supplier)
    if(!success){
      toast.error('Failed to update supplier')
      return
    }
    toast.success(message)
    refetchSuppliers()
  }

  const removeSupplier = async (id: string) => {
    const {success, message} = await deleteSupplier(id)
    if(!success){
      toast.error(message)
      return
    }
    toast.success(message)
    refetchSuppliers()
  }

  const getSupplier = async (id: string) => {
    const {supplier, success} = await getSupplierById(id)
    if(!success){
      toast.error('Failed to fetch supplier')
      return undefined
    }
    return supplier
  }

  const getSupplierMaterials = async(id: string) => {
    const {materials, success, message} = await getMaterialsBySupplierId(id)
    if(!success){
      toast.error(message)
      return
    }
    return materials;
  }
  // const getNextId = () => generateNextId(suppliers)


  const addSupplierMaterial = async(supplierId: string, materialId: string) => {
    const {success, message} = await addMaterialToSupplier(supplierId, materialId)
    if(!success){
      toast.error(message || 'Failed to add material')
      return
    }
    toast.success(message || 'marerial added successfully')
    refetchSuppliers()
  }
  
  const removeMaterialFromSupplier = async(supplierId: string, materialId: string) => {
    const {success, message} = await removeSupplierMaterialRelation(supplierId, materialId)
    if(!success){
      toast.error(message || 'Failed to remove material')
      return
    }
    toast.success(message || 'marerial removed successfully')
    refetchSuppliers()
  }

  return {
    suppliers,
    total,
    loading,
    maxPages,
    pagination,
    modifyPagination,
    refetchSuppliers,
    addSupplier,
    updateSupplier,
    removeSupplier,
    getSupplier,
    getSupplierMaterials,
    addSupplierMaterial,
    removeMaterialFromSupplier
    // getNextId
  }
}
