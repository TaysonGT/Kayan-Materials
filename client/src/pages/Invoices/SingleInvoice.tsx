import { useEffect, useState } from 'react'
import { FiArrowRight } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router';
import { DataTable } from '../../components/common';
import { useInvoices } from '../../hooks/useInvoices';
import type { Invoice, Material, Transaction } from '../../types';
import { formatCurrency, formatDateDisplay } from '../../utils/helpers';
import CreateTransactionForm from '../Transactions/CreateTransactionForm';
import { VALIDATION_MESSAGES } from '../../utils/constants';
import EditTransactionForm from '../Transactions/EditTransactionForm';
import { deleteTransaction } from '../../services/transactions.service';

const SingleInvoicePage = () => {
  const {invoiceId} = useParams()
  const navigate = useNavigate()
  const [invoice, setInvoice] = useState<Invoice>() 
  const [loading, setLoading] = useState(false)
  const {getInvoice} = useInvoices({autoRefetch:false})
  const [selectedEdit, setSelectedEdit] = useState<Transaction|null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  
  const handleDelete = (transaction: Transaction) => {
    if (window.confirm(VALIDATION_MESSAGES.deleteConfirm('هذا العنصر'))) {
      deleteTransaction(transaction.id)
    }
  }

  const loadInvoice = async()=>{
    if(!invoiceId) return;
    setLoading(true)
    const returnedInvoice = await getInvoice(invoiceId)

    setInvoice(returnedInvoice)
    setLoading(false)
  }

  const transactionsTableColumns = [
      {
        field: 'id',
        label: 'رقم الحركة',
        render: (value: any) => `#${value}`,
        align: 'center' as const
  
      },
      {
        field: 'supplier',
        label: 'المورد',
        render: () => invoice?.supplier?.name,
        align: 'center' as const
  
      },
      {
        field: 'material',
        label: 'المادة',
        render: (material: Material) => material?.name,
        align: 'center' as const
      },
      {
        field: 'unitPrice',
        label: 'سعر الوحدة',
        align: 'center' as const
  ,
        render: (value: any) => formatCurrency(value)
      },
      {
        field: 'quantity',
        label: 'الكمية',
        align: 'center' as const,
        render: (value: any) => value ? value : '-'
      },
      { 
        field: 'received_date', label: 'التاريخ', 
        render: (date: string)=> 
          date? formatDateDisplay(date) : '-',
          align: 'center' as const
      },
      {
        field: 'status',
        label: 'الحالة',
        render: (value: any) => (
          <span className={`inline-block px-2 py-1 text-sm rounded ${value === 'received' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'}`}>{value === 'received' ? 'مسلم' : 'معلق'}</span>
        ),
        align: 'center' as const
      },
      {
        field: 'total',
        label: 'الإجمالي',
        render: (value: any) => value? formatCurrency (value):'-',
        align: 'center' as const
      }
    ]
  

  useEffect(()=>{
    loadInvoice()
  },[invoiceId])

  return (
    <div className="max-w-screen-lg mx-auto py-4">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate('/invoices')} className="p-1 rounded text-gray-700 hover:bg-gray-200"><FiArrowRight /></button>
        <div>
          <h1 className="text-2xl font-bold">عرض فاتورة</h1>
          <p className="text-sm text-gray-500">تفاصيل الفاتورة وعناصرها</p>
        </div>
      </div>
      <div className="pt-4 flex flex-col gap-2">
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm mb-1">المورد</label>
            <div className="border rounded px-3 py-2">{invoice?.supplier?.name || 'لم يتم تحديد المورد'}</div>
          </div>
          <div className="flex-1">
            <label className="block text-sm mb-1">التاريخ</label>
            <div className="border rounded px-3 py-2">{formatDateDisplay(invoice?.createdAt || 0)}</div>
          </div>
          <div className="flex-1">
            <label className="block text-sm mb-1">الوصف</label>
            <div className="border rounded px-3 py-2">{invoice?.description || '-'}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm mb-1">القيمة المدفوعة</label>
            <div className="border rounded px-3 py-2">{formatCurrency(invoice?.paid || 0)}</div>
          </div>
          <div className="flex-1">
            <label className="block text-sm mb-1">النولون</label>
            <div className="border rounded px-3 py-2">{formatCurrency(invoice?.freight || 0)}</div>
          </div>
          <div className="flex-1">
            <label className="block text-sm mb-1">الإجمالي</label>
            <div className="border rounded px-3 py-2">{formatCurrency(invoice?.total || 0)}</div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex justify-between">
          <div className='text-lg font-semibold'>عناصر الفاتورة</div>
          <button onClick={() => setShowAddDialog(true)} className="px-3 py-2 bg-blue-600 text-white rounded">إضافة عنصر</button>
        </div>
        <div className="mt-2">
          <DataTable columns={transactionsTableColumns} rows={invoice?.transactions || []} loading={loading} onEdit={(transaction: Transaction) => { setSelectedEdit(transaction); setShowEditDialog(true) }} onDelete={handleDelete} />
        </div>
      </div>

      <CreateTransactionForm open={showAddDialog} hide={() => setShowAddDialog(false)} invoice={invoice} onSave={loadInvoice} />
      <EditTransactionForm open={showEditDialog} hide={() => setShowEditDialog(false)} transaction={selectedEdit} invoice={invoice} onSave={loadInvoice} />

    </div>
  )
}

export default SingleInvoicePage