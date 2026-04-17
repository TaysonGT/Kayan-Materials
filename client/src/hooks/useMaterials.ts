import { useEffect, useState } from 'react'
import type { Material } from '../types'
import { createMaterial, deleteMaterial, fetchMaterials, getMaterialById, getSuppliersByMaterialId, patchMaterial } from '../api/materials'
import { toast } from 'react-toastify'
import { addMaterialToSupplier, removeSupplierMaterialRelation } from '../api/supplier-materials'

export const useMaterials = () => {
  const [materials, setMaterials] = useState<Material[]>([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10 })
  const [maxPages, setMaxPages] = useState(0)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const refetchMaterials = async () => {
    setLoading(true)
    const {materials, success, message, total:materialsTotal} = await fetchMaterials(pagination.page, pagination.limit)
    if(!success){
      toast.error(message || 'Failed to fetch materials')
      return
    }
    setMaterials(materials||[])
    setMaxPages(Math.ceil((materialsTotal || 0) / pagination.limit))
    setTotal(materialsTotal || 0)
    setLoading(false)
  }

  useEffect(()=>{
    refetchMaterials()
  },[pagination])

  const modifyPagination = (newPagination: Partial<typeof pagination>) => {
    setPagination(prev => ({...prev, ...newPagination}))
  }

  const addMaterial = async(material: Omit<Material, 'id'>) => {
    const {success, message} = await createMaterial(material)
    if(!success){
      toast.error(message || 'Failed to create material')
      return
    }
    toast.success(message || 'Material created successfully')
    refetchMaterials()
  }

  const updateMaterial = async(id: string, material: Partial<Omit<Material, 'id'>>) => {
    const {success, message} = await patchMaterial(id, material)
    if(!success){
      toast.error(message || 'Failed to update material')
      return
    }
    toast.success(message || 'Material updated successfully')
    refetchMaterials()
  }

  const removeMaterial = async(id: string) => {
    const {success, message} = await deleteMaterial(id)
    if(!success){
      toast.error(message || 'Failed to delete material')
      return
    }
    toast.success(message || 'Material deleted successfully')
    refetchMaterials()
  }
  
  const removeSupplierFromMaterial = async(supplierId: string, materialId: string) => {
    const {success, message} = await removeSupplierMaterialRelation(supplierId, materialId)
    if(!success){
      toast.error(message || 'Failed to delete material')
      return
    }
    toast.success(message || 'Material deleted successfully')
    refetchMaterials()
  }

  const getMaterial = async(id: string) => {
    const {material, success, message} = await getMaterialById(id)
    if(!success){
      toast.error(message)
      return
    }
    return material;
  }
  
  const getMaterialSuppliers = async(id: string) => {
    const {suppliers, success, message} = await getSuppliersByMaterialId(id)
    if(!success){
      toast.error(message)
      return
    }
    return suppliers;
  }

  const addMaterialSupplier = async(supplierId: string, materialId: string) => {
    const {success, message} = await addMaterialToSupplier(supplierId, materialId)
    if(!success){
      toast.error(message || 'Failed to add supplier')
      return
    }
    toast.success(message || 'supplier added successfully')
    refetchMaterials()
  }

  return {
    materials,
    total,
    loading,
    refetchMaterials,
    addMaterial,
    updateMaterial,
    removeMaterial,
    removeSupplierFromMaterial,
    getMaterial,
    getMaterialSuppliers,
    addMaterialSupplier,
    maxPages,
    modifyPagination,
    pagination
  }
}
