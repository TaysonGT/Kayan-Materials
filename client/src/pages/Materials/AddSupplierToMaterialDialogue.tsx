import React, { useEffect, useState } from 'react'

import { FormDialog } from '../../components/common'
import { DIALOG_TITLES, VALIDATION_MESSAGES } from '../../utils/constants'
import { useMaterials } from '../../hooks/useMaterials'
import { useSuppliers } from '../../hooks/useSuppliers'

interface Props{ materialId: string, open: boolean, onClose: ()=>void, onSave: ()=>void }

const AddSupplierToMaterialDialogue: React.FC<Props> = ({ materialId, open, onClose, onSave }) => {
    const {addMaterialSupplier} = useMaterials()
    const {suppliers, modifyPagination} = useSuppliers()

    const [formData, setFormData] = useState({
        materialId,
        supplierId: '',
      })
    
    const formFields = [
        {
          name: 'supplierId',
          label: 'المورد',
          type: 'select' as const,
          options: suppliers.map(s => ({ value: s.id, label: s.name }))
        }
      ]
    
    const handleSave = async() => {
        if (!formData.supplierId.trim()) {
          alert(VALIDATION_MESSAGES.material)
          return
        }

        try{
            await addMaterialSupplier(formData.supplierId, materialId)
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
        materialId,
        supplierId: '',
    })
    
  },[materialId])

  return (
      <FormDialog
        open={open}
        title={DIALOG_TITLES.material.addSupplier}
        fields={formFields}
        formData={formData}
        onClose={onClose}
        onSave={handleSave}
        onChange={handleFieldChange}
      />
  )
}

export default AddSupplierToMaterialDialogue