import React, { useEffect, useState } from 'react'
import { FormDialog } from '../../components/common'
import { toast } from 'react-toastify'
import { DIALOG_TITLES, VALIDATION_MESSAGES } from '../../utils/constants'
import { useSuppliers } from '../../hooks/useSuppliers'
import { useTransactions } from '../../hooks/useTransactions'
import type { Material, Transaction, TRANSACTION_STATUS } from '../../types'
import { formatDateInput } from '../../utils/helpers'

interface Props{
    show: boolean
    hide: ()=>void
    onSave: ()=>void
    transaction: Transaction|null
}

const EditTransactionForm:React.FC<Props> = ({show, hide, onSave, transaction}) => {
    const { suppliers, getSupplierMaterials} = useSuppliers()
    const { refetchTransactions, updateTransaction } = useTransactions()
    const [materials, setMaterials] = useState<Material[]>([])

    const fetchMaterials = async () => {
        const materials = await getSupplierMaterials(formData.supplierId)
        setMaterials(materials||[])
    }

    const [formData, setFormData] = useState({
        supplierId: transaction?.supplier.id||'',
        materialId: transaction?.material.id||'',
        unitPrice: 0,
        quantity: 0,
        type: 'material' as 'material' | 'freight',
        status: 'received' as TRANSACTION_STATUS,
        date: formatDateInput(transaction?.date||0),
    })

    useEffect(()=>{
        if(transaction){
            setFormData({
                supplierId: transaction.supplier.id,
                materialId: transaction.material.id,
                unitPrice: transaction.unitPrice,
                quantity: transaction.quantity,
                type: transaction.type,
                status: transaction.status,
                date: formatDateInput(transaction.date),
            })
        }
    },[transaction, show])

    useEffect(()=>{
        formData.supplierId&& fetchMaterials()
    },[formData.supplierId, transaction, show])

    const formFields = [
        {
        name: 'supplierId',
        label: 'المورد',
        type: 'select' as const,
        required: true,
        value: transaction?.supplier.id,
        options: suppliers.map(s => ({ value: s.id, label: s.name}))
        },
        {
        name: 'materialId',
        label: 'المادة',
        type: 'select' as const,
        required: true,
        value: transaction?.material.id,
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
            {label: 'معلق', value: 'pending'}
        ]
        },
        { 
        name: 'type', 
        label: 'النوع', 
        type: 'select' as const, 
        required: true, 
        options: [
            { value: 'material', label: 'خام' },
            { value: 'freight', label: 'نولون' }
        ],
        value: transaction?.type,
        }
    ]

    const handleFieldChange = (fieldName: string, value: any) => {
        if (fieldName === 'unitPrice' || fieldName === 'quantity') {
            setFormData({ ...formData, [fieldName]: parseFloat(value) || 0 })
        } else {
            setFormData({ ...formData, [fieldName]: value })
        }
    }

    const handleSave = async () => {
      if (!transaction) {
          toast.error(VALIDATION_MESSAGES.transaction)
          return
      }

      if (!formData.supplierId || !formData.materialId || formData.unitPrice <= 0 ) {
        toast.error(VALIDATION_MESSAGES.transaction)
        return
      }
      
      await updateTransaction(transaction?.id, formData)
      refetchTransactions()
      onSave()
      hide()
    }


  return (
    
      <FormDialog
        open={show}
        title={DIALOG_TITLES.transaction.edit}
        fields={formFields}
        formData={formData}
        onClose={hide}
        onSave={handleSave}
        onChange={handleFieldChange}
      />
  )
}

export default EditTransactionForm