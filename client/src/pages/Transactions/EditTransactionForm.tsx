import React, { useEffect, useState } from 'react'
import { FormDialog } from '../../components/common'
import { toast } from 'react-toastify'
import { DIALOG_TITLES, VALIDATION_MESSAGES } from '../../utils/constants'
import type { Invoice, Transaction, TRANSACTION_STATUS } from '../../types'
import { formatDateInput } from '../../utils/helpers'
import { useMaterials } from '../../hooks/useMaterials'
import { patchTransaction } from '../../api/transactions'

interface Props{
    show: boolean
    hide: ()=>void
    onSave: ()=>void
    transaction: Transaction|null
    invoice?: Invoice
}

const EditTransactionForm:React.FC<Props> = ({show, hide, onSave, transaction, invoice}) => {
    const { materials } = useMaterials({all:true})
    const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState({
        invoiceId: invoice?.id||'',
        materialId: transaction?.material?.id||'',
        unitPrice: 0,
        quantity: 0,
        status: 'received' as TRANSACTION_STATUS,
        received_date: formatDateInput(transaction?.received_date||0),
    })

    useEffect(()=>{
        if(transaction){
            setFormData({
                invoiceId: invoice?.id||'',
                materialId: transaction.material?.id||'',
                unitPrice: transaction.unitPrice,
                quantity: transaction.quantity,
                status: transaction.status,
                received_date: formatDateInput(transaction.received_date),
            })
        }
    },[transaction, show])


    const formFields = [
        {
        name: 'materialId',
        label: 'المادة',
        type: 'select' as const,
        required: true,
        value: transaction?.material?.id,
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
            {label: 'معلق', value: 'pending'}
        ]
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
      if (!formData.invoiceId || !formData.materialId || formData.unitPrice <= 0 || !transaction ) {
        toast.error(VALIDATION_MESSAGES.transaction)
        return
      }
      setIsLoading(true)
      
      const {success, message} = await patchTransaction(transaction?.id, formData)
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
        title={DIALOG_TITLES.transaction.edit}
        fields={formFields}
        formData={formData}
        onClose={hide}
        onSave={handleSave}
        onChange={handleFieldChange}
        isLoading={isLoading}
      />
  )
}

export default EditTransactionForm