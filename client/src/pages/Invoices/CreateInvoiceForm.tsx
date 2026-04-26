import React, { useEffect, useState } from 'react'
import { FormDialog } from '../../components/common'
import { toast } from 'react-toastify'
import { DIALOG_TITLES, VALIDATION_MESSAGES } from '../../utils/constants'
import { useSuppliers } from '../../hooks/useSuppliers'
import { useNavigate } from 'react-router'
import { newInvoice } from '../../services/invoices.service'

interface Props{
    show: boolean
    hide: ()=>void
    onSave: ()=>void
}

const CreateInvoiceForm:React.FC<Props> = ({show, hide}) => {
    const { suppliers} = useSuppliers(true)
    const [isLoading, setIsLoading] = useState(false)
    
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        supplierId: '',
        description:'',
        freight: 0,
        paid: 0,
        createdAt: new Date().toISOString().split('T')[0],
    })

    useEffect(()=>{
        setFormData({
            supplierId: '',
            description: '',
            freight: 0,
            paid: 0,
            createdAt: new Date().toISOString().split('T')[0]
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
      if (!formData.supplierId || !formData.createdAt ) {
        toast.error(VALIDATION_MESSAGES.transaction)
        return
      }
      setIsLoading(true)
      await newInvoice(formData)
      .then(({invoice, message})=>{
        if(invoice){
          toast.success(message || 'تم تعديل الفاتورة بنجاح')
          navigate(`/invoices/${invoice.id}`)
        }
      }).catch(error=>{
        toast.error(error.message || 'حدث خطأ أثناء إنشاء الفاتورة')
      }).finally(()=>setIsLoading(false))
    }


  return (
      <FormDialog
        open={show}
        title={DIALOG_TITLES.invoice.add}
        fields={formFields}
        formData={formData}
        onClose={hide}
        onSave={handleSave}
        onChange={handleFieldChange}
        isLoading={isLoading}
      />
  )
}

export default CreateInvoiceForm