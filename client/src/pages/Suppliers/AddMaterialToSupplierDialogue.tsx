import React, { useEffect, useState } from 'react'

import { FormDialog } from '../../components/common'
import { DIALOG_TITLES, VALIDATION_MESSAGES } from '../../utils/constants'
import { useMaterials } from '../../hooks/useMaterials'
import { useSuppliers } from '../../hooks/useSuppliers'

interface Props{ supplierId: string, open: boolean, onClose: ()=>void, onSave: ()=>void }

const AddMaterialToSupplierDialogue: React.FC<Props> = ({ supplierId, open, onClose, onSave }) => {
  const {materials, modifyPagination} = useMaterials({all:false})
  const {addSupplierMaterial} = useSuppliers()

  const [formData, setFormData] = useState({
    supplierId,
    materialId: '',
  })
  
  const formFields = [
    {
      name: 'materialId',
      label: 'الخام',
      type: 'select' as const,
      options: materials.map(m => ({ value: m.id, label: m.name }))
    }
  ]
  
  const handleSave = async() => {
    if (!formData.materialId.trim()) {
      alert(VALIDATION_MESSAGES.material)
      return
    }

    try{
      await addSupplierMaterial(supplierId, formData.materialId)
      onSave()
    }catch (error){
      console.log(error)
    }
  }

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData({ ...formData, [fieldName]: value })
  }

  useEffect(()=>{
    modifyPagination({page: 1, limit: 200})
    setFormData({
      supplierId,
      materialId: '',
    })
    
  },[supplierId])

  return (
    <FormDialog
      open={open}
      title={DIALOG_TITLES.supplier.addMaterial}
      fields={formFields}
      formData={formData}
      onClose={onClose}
      onSave={handleSave}
      onChange={handleFieldChange}
    />
  )
}

export default AddMaterialToSupplierDialogue