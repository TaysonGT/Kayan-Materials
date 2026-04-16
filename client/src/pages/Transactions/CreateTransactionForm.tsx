import React, { useEffect, useState } from 'react'
import { FormDialog } from '../../components/common'
import { toast } from 'react-toastify'
import { DIALOG_TITLES, VALIDATION_MESSAGES } from '../../utils/constants'
import { useSuppliers } from '../../hooks/useSuppliers'
import { useTransactions } from '../../hooks/useTransactions'
import type { Material, TRANSACTION_STATUS } from '../../types'

interface Props{
    show: boolean
    hide: ()=>void
    onSave: ()=>void
}

const CreateTransactionForm:React.FC<Props> = ({show, hide, onSave}) => {
    const { suppliers, getSupplierMaterials} = useSuppliers()
    const { refetchTransactions, addTransaction } = useTransactions()
    const [materials, setMaterials] = useState<Material[]>([])

    const fetchMaterials = async () => {
        const materials = await getSupplierMaterials(formData.supplierId)
        setMaterials(materials||[])
    }

    const [formData, setFormData] = useState({
        supplierId: '',
        materialId: '',
        unitPrice: 0,
        quantity: 0,
        type: 'material' as 'material' | 'freight',
        status: 'received' as TRANSACTION_STATUS,
        date: new Date().toISOString().split('T')[0],
    })

    useEffect(()=>{
        setFormData({
            supplierId: '',
            materialId: '',
            quantity: 0,
            unitPrice: 0,
            type: 'material',
            status: 'received',
            date: new Date().toISOString().split('T')[0]
        })
    },[show])

    useEffect(()=>{
        if(formData.supplierId){
            fetchMaterials()            
        }
    },[formData.supplierId])

    const formFields = [
        {
        name: 'supplierId',
        label: 'المورد',
        type: 'select' as const,
        required: true,
        options: suppliers.map(s => ({ value: s.id, label: s.name }))
        },
        {
        name: 'materialId',
        label: 'المادة',
        type: 'select' as const,
        required: true,
        options: materials.map(m => ({ value: m.id, label: m.name }))
        },
        { name: 'unitPrice', label: 'سعر الوحدة', type: 'number' as const, required: true },
        { name: 'quantity', label: 'الكمية', type: 'number' as const, required: true },
        { name: 'date', label: 'التاريخ', type: 'date' as const, required: true },
        {
        name: 'status',
        label: 'حالة الإستلام',
        type: 'select' as const,
        required: true,
        options: [
            {label: 'تم الإستلام', value: 'received'},
            {label: 'معلق', value: 'pending'}]
        },
        { 
        name: 'type', label: 'النوع', type: 'select' as const, required: true, options: [
            { value: 'material', label: 'خام' },
            { value: 'freight', label: 'نولون' }
        ] 
        }
    ]

    const handleFieldChange = (fieldName: string, value: any) => {
        console.log(fieldName, value)
        if (fieldName === 'unitPrice' || fieldName === 'quantity') {
            setFormData({ ...formData, [fieldName]: parseFloat(value) || 0 })
        } else {
            setFormData({ ...formData, [fieldName]: value })
        }
    }

    const handleSave = async () => {
      if (!formData.supplierId || !formData.materialId || formData.unitPrice <= 0 ) {
        toast.error(VALIDATION_MESSAGES.transaction)
        return
      }
      await addTransaction(formData)
      refetchTransactions()
      onSave()
      hide()
    }


  return (
    
      <FormDialog
        open={show}
        // title={editingId ? DIALOG_TITLES.transaction.edit : DIALOG_TITLES.transaction.add}
        title={DIALOG_TITLES.transaction.add}
        fields={formFields}
        formData={formData}
        onClose={hide}
        onSave={handleSave}
        onChange={handleFieldChange}
      />
  )
}

export default CreateTransactionForm