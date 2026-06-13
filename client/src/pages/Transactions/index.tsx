import { useTransactions } from '../../hooks/useTransactions'
import { PageHeader, DataTable, StatsCard } from '../../components/common'
import type { Invoice, Material, Transaction } from '../../types'
import { PAGE_HEADERS, DELIVERY_FILTER_OPTIONS } from '../../utils/constants'
import { formatCurrency, formatDateDisplay } from '../../utils/helpers'
import NavigationControl from '../../components/ui/NavigationControl'
import { useState } from 'react'
import { useSuppliers } from '../../hooks/useSuppliers'
import  { useMaterials } from '../../hooks/useMaterials'
import FiltersBar, { type FilterProps } from '../../components/common/FiltersBar'
import { FiEye } from 'react-icons/fi'
import { useNavigate } from 'react-router'
import MaterialAverageCost from './MaterialAverageCost'

const TransactionsPage = () => {
  const { transactions, loading, getSupplierMaterialCosts, getSupplierMaterialTransactions, detailedCosts, statusFilter, materialFilter, supplierFilter, setSupplierFilter, setMaterialFilter, setStatusFilter, pagination, modifyPagination, maxPages} = useTransactions()
  const { suppliers } = useSuppliers()
  const { materials } = useMaterials({all:true})
  const [showMaterialCostModal, setShowMaterialCostModal] = useState(false)
  const navigate = useNavigate()
  
  // const [showCreateDialog, setShowCreateDialog] = useState(false)
  // const [showEditDialog, setShowEditDialog] = useState(false)
  // const [selectedEdit, setSelectedEdit] = useState<Transaction|null>(null)


  // const handleDelete = (transaction: Transaction) => {
  //   if (window.confirm(VALIDATION_MESSAGES.deleteConfirm('هذه الفاتورة'))) {
  //     deleteTransaction(transaction.id)
  //   }
  // }

  const filters: FilterProps[] = [
    {
      label: 'تصنيف حسب المورد',
      value: supplierFilter,
      options: suppliers.map((s)=>({label: s.name, value: s.id})),
      onChange: (value:any)=>setSupplierFilter(value)
    },
    {
      label: 'تصنيف حسب الخام',
      value: materialFilter,
      options: materials.map((s)=>({label: s.name, value: s.id})),
      onChange: (value:any)=>setMaterialFilter(value)
    },
    {
      label: 'تصنيف حسب حالة الاستلام',
      value: statusFilter,
      options: DELIVERY_FILTER_OPTIONS,
      onChange: (value: any) => setStatusFilter(value)
    }    
  ]

  const tableColumns = [
    {
      field: 'id',
      label: 'رقم الحركة',
      render: (value: any) => `#${value}`,
      align: 'center' as const

    },
    {
      field: 'invoice',
      label: 'المورد',
      render: (invoice: Invoice) => invoice?.supplier?.name,
      align: 'center' as const

    },
    {
      field: 'material',
      label: 'المادة',
      render: (material: Material) => material.name,
      align: 'center' as const
    },
    {
      field: 'unitPrice',
      label: 'سعر الوحدة',
      align: 'center' as const,
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
      render: (value: any) => value?formatCurrency (value):'-',
      align: 'center' as const
    }
  ]

  return (
    <div className="max-w-screen-lg mx-auto py-4">
      <PageHeader
        title={PAGE_HEADERS.transactions.title}
        subtitle={PAGE_HEADERS.transactions.subtitle}
        buttonText={PAGE_HEADERS.transactions.buttonText}
        // onAddClick={() => setShowCreateDialog(true)}
        onAddClick={() => 0}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mb-3">
        <StatsCard value={formatCurrency(detailedCosts.receivedCosts)} label="الحركات المسلمة" loading={loading} />
        <StatsCard value={formatCurrency(detailedCosts.notReceivedCosts)} label="الحركات المعلقة" loading={loading} />
        <StatsCard value={transactions.length} label="إجمالي الحركات" loading={loading} />
      </div>
      
      <div className="flex justify-between items-start">
        <FiltersBar filters={filters} />
        <button onClick={() => setShowMaterialCostModal(true)} className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded">
          <FiEye />
          متوسط سعر الخام
        </button>
      </div>

      <DataTable
        columns={tableColumns}
        rows={transactions}
        loading={loading}
        // onEdit={(transaction: Transaction)=>{
        //   setSelectedEdit(transaction);
        //   setShowEditDialog(true)}}
        // onDelete={handleDelete}
        onPreview={(transaction: Transaction)=>transaction.invoice&&navigate(`/invoices/${transaction.invoice?.id}`)}
      />

      <NavigationControl
        pageCount={pagination.page}
        maxPages={maxPages}
        modifyPagination={modifyPagination}
      />

      {/* <CreateTransactionForm
      onSave={refetchTransactions}
      show={showCreateDialog}
      hide={()=>setShowCreateDialog(false)}
      /> */}

      {/* <EditTransactionForm
      onSave={refetchTransactions}
      show={showEditDialog}
      hide={()=>{setShowEditDialog(false);setSelectedEdit(null)}}
      transaction={selectedEdit}
      /> */}

      <MaterialAverageCost
      open={showMaterialCostModal}
      onClose={()=>setShowMaterialCostModal(false)}
      getMaterialSupplierCosts={getSupplierMaterialCosts}
      getMaterialSupplierTransactions={getSupplierMaterialTransactions}
      />

    </div>
  )
}

export default TransactionsPage

