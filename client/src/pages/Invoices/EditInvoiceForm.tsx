import React, { useEffect, useState } from 'react'
import { FormDialog } from '../../components/common'
import { toast } from 'react-toastify'
import { DIALOG_TITLES, VALIDATION_MESSAGES } from '../../utils/constants'
import { useSuppliers } from '../../hooks/useSuppliers'
import type { Invoice } from '../../types'
import { modifyInvoice } from '../../services/invoices.service'

interface Props{
    show: boolean
    hide: ()=>void
    onSave: ()=>void
    invoice?: Invoice|null
}

const EditInvoiceForm:React.FC<Props> = ({show, hide, onSave, invoice}) => {
    const { suppliers} = useSuppliers(true)
    const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState({
        supplierId: invoice?.supplier?.id || '',
        description: invoice?.description || '',
        freight: invoice?.freight || 0,
        paid: invoice?.paid||0,
        createdAt: invoice?.createdAt || new Date().toISOString().split('T')[0],
    })

    useEffect(()=>{
        setFormData({
            supplierId: invoice?.supplier?.id || '',
            description: invoice?.description || '',
            freight: invoice?.freight || 0,
            paid: invoice?.paid||0,
            createdAt: invoice?.createdAt || new Date().toISOString().split('T')[0],
        })
    },[show])

    const formFields = [
        {
            name: 'supplierId',
            label: 'المورد',
            type: 'select' as const,
            required: true,
            options: suppliers.map(s => ({ value: s.id, label: s.name }))
        },
        { name: 'paid', label: 'القيمة المدفوعة', type: 'number' as const },
        { name: 'freight', label: 'نولون', type: 'number' as const },
        { name: 'createdAt', label: 'التاريخ', type: 'date' as const, required: true },
        {
            name: 'description',
            label: 'الوصف',
            type: 'text' as const,
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
      if (!formData.supplierId || !formData.createdAt || !invoice?.id ) {
        toast.error(VALIDATION_MESSAGES.transaction)
        return
      }
        
      setIsLoading(true)

      const response = await modifyInvoice(invoice?.id, formData)

      if(response.invoice){
        toast.success(response.message || 'تم تعديل الفاتورة بنجاح')
        onSave()
      }
      setIsLoading(false)
    }


  return (
      <FormDialog
        open={show}
        title={DIALOG_TITLES.invoice.edit}
        fields={formFields}
        formData={formData}
        onClose={hide}
        onSave={handleSave}
        onChange={handleFieldChange}
        isLoading={isLoading}
      />
  )
}

export default EditInvoiceForm