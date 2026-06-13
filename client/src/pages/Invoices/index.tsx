import { PageHeader, DataTable, StatsCard } from '../../components/common'
import type { Invoice, Supplier, Transaction } from '../../types'
import { PAGE_HEADERS, VALIDATION_MESSAGES } from '../../utils/constants'
import { formatCurrency, formatDateDisplay } from '../../utils/helpers'
import NavigationControl from '../../components/ui/NavigationControl'
import { useState } from 'react'
import { useSuppliers } from '../../hooks/useSuppliers'
import  { useMaterials } from '../../hooks/useMaterials'
import FiltersBar, { type FilterProps } from '../../components/common/FiltersBar'
import { useInvoices } from '../../hooks/useInvoices'
import CreateInvoiceForm from './CreateInvoiceForm'
import { useNavigate } from 'react-router'
import EditInvoiceForm from './EditInvoiceForm'
import { RiBillLine } from 'react-icons/ri'

const InvoicesPage = () => {
  const { invoices, loading, refetchInvoices, materialFilter, supplierFilter, setSupplierFilter, setMaterialFilter, pagination, modifyPagination, maxPages, removeInvoice} = useInvoices({autoRefetch:true})
  const { suppliers } = useSuppliers()
  const { materials } = useMaterials({all: true})
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedEdit, setSelectedEdit] = useState<Invoice|null>(null)

  const navigate = useNavigate()

  const handleDelete = (invoice: Invoice) => {
    if (window.confirm(VALIDATION_MESSAGES.deleteConfirm('هذه الفاتورة'))) {
      removeInvoice(invoice.id)
    }
  }

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
    }   
  ]

  const tableColumns = [
    {
      field: 'createdAt',
      label: 'التاريخ',
      render: (value: any) => formatDateDisplay(value),
      align: 'center' as const
    },
    {
      field: 'supplier',
      label: 'المورد',
      render: (supplier: Supplier) => supplier.name,
      align: 'center' as const

    },
    {
      field: 'transactions',
      label: 'العناصر',
      render: (transactions: Transaction[]) => transactions?.length||0,
      align: 'center' as const
    },
    {
      field: 'paid',
      label: 'المدفوع',
      render: (value: any) => formatCurrency(value),
      align: 'center' as const
    },
    {
      field: 'total',
      label: 'الإجمالي',
      render: (value: any) => formatCurrency(value||'-'),
      align: 'center' as const
    }
  ]

  return (
    <div className="max-w-screen-lg mx-auto py-4">
      <PageHeader title={PAGE_HEADERS.invoices.title} subtitle={PAGE_HEADERS.invoices.subtitle} buttonText={PAGE_HEADERS.invoices.buttonText} onAddClick={() => setShowCreateDialog(true)} />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mb-3">
        <StatsCard value={invoices.length} label="إجمالي الفواتير" loading={loading} icon={<RiBillLine />} />
      </div>

      <div className="flex justify-between items-start">
        <FiltersBar filters={filters} />
      </div>

      <DataTable columns={tableColumns} rows={invoices} loading={loading} onEdit={(invoice: Invoice) => { setSelectedEdit(invoice); setShowEditDialog(true) }} onDelete={handleDelete} onPreview={(invoice: Invoice) => navigate(`/invoices/${invoice.id}`)} />

      <NavigationControl pageCount={pagination.page} maxPages={maxPages} modifyPagination={modifyPagination} />

      <CreateInvoiceForm onSave={refetchInvoices} open={showCreateDialog} hide={() => setShowCreateDialog(false)} />

      <EditInvoiceForm invoice={selectedEdit} onSave={refetchInvoices} open={!!(showEditDialog && selectedEdit)} hide={() => setShowCreateDialog(false)} />
    </div>
  )
}

export default InvoicesPage

