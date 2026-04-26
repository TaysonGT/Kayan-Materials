import React, { useEffect, useState } from 'react'
import { FormDialog } from '../../components/common'
import { toast } from 'react-toastify'
import { DIALOG_TITLES, VALIDATION_MESSAGES } from '../../utils/constants'
import type { Invoice, TRANSACTION_STATUS } from '../../types'
import { useMaterials } from '../../hooks/useMaterials'
import { addTransactionToInvoice } from '../../api/invoices'

interface Props{
    invoice?: Invoice
    show: boolean
    hide: ()=>void
    onSave: ()=>void
}

const CreateTransactionForm:React.FC<Props> = ({show, hide, onSave, invoice}) => {
    const { materials } = useMaterials({all:true})
    const [isLoading, setIsLoading] = useState(false)
    
    const [formData, setFormData] = useState({
        invoiceId: invoice?.id || '',
        materialId: '',
        unitPrice: 0,
        quantity: 0,
        status: 'received' as TRANSACTION_STATUS,
        received_date: new Date().toISOString().split('T')[0],
    })

    useEffect(()=>{
        setFormData({
            invoiceId: invoice?.id || '',
            materialId: '',
            quantity: 0,
            unitPrice: 0,
            status: 'received',
            received_date: new Date().toISOString().split('T')[0]
        })
    },[show])

    const formFields = [
        {
        name: 'supplierId',
        label: 'المورد',
        type: 'text' as const,
        readOnly: true,
        value: invoice?.supplier?.name
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
        { name: 'received_date', label: 'التاريخ', type: 'date' as const, required: true },
        {
        name: 'status',
        label: 'حالة الإستلام',
        type: 'select' as const,
        required: true,
        options: [
            {label: 'تم الإستلام', value: 'received'},
            {label: 'معلق', value: 'pending'}]
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
      if (!formData.invoiceId || !formData.materialId || formData.unitPrice <= 0 ) {
        toast.error(VALIDATION_MESSAGES.transaction)
        return
      }
      setIsLoading(true)
      const {success, message} = await addTransactionToInvoice(formData)
      if(!success){
        toast.error(message)
        return
      }
      toast.success(message || 'تم إضافة الحركة بنجاح')
      setIsLoading(false)
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
        isLoading={isLoading}
      />
  )
}

export default CreateTransactionForm