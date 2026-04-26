import { Container, Box } from '@mui/material'
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <PageHeader
        title={PAGE_HEADERS.invoices.title}
        subtitle={PAGE_HEADERS.invoices.subtitle}
        buttonText={PAGE_HEADERS.invoices.buttonText}
        onAddClick={() => setShowCreateDialog(true)}
      />

      {/* Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
        {/* <StatsCard
          value={formatCurrency(detailedCosts.receivedCosts)}
          label="إجمالي المسلم"
          backgroundColor="#e8f5e9"
          textColor="#388e3c"
          captionColor="#2e7d32"
          loading={loading}
        />
        <StatsCard
          value={formatCurrency(detailedCosts.notReceivedCosts)}
          label="إجمالي المعلق"
          backgroundColor="#fff3e0"
          textColor="#f57c00"
          captionColor="#e65100"
          loading={loading}
        /> */}
        <StatsCard
          value={invoices.length}
          label="إجمالي الفواتير"
          backgroundColor="#f3e5f5"
          textColor="#7b1fa2"
          captionColor="#6a1b9a"
          loading={loading}
        />
        {/* <StatsCard
          value={transactions.filter(i => i.status==='pending').length}
          label="فواتير معلقة"
          backgroundColor="#e3f2fd"
          textColor="#1976d2"
          captionColor="#1565c0"
          loading={loading}
        /> */}
      </Box>
      
      <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
        <FiltersBar filters={filters}/>
        {/* <Button
          dir='ltr'
          variant="contained"
          startIcon={<FiEye />}
          onClick={()=>setShowMaterialCostModal(true)}>
          متوسط سعر الخام
        </Button> */}
      </Box>

      <DataTable
        columns={tableColumns}
        rows={invoices}
        loading={loading}
        onEdit={(invoice: Invoice)=>{
          setSelectedEdit(invoice);
          setShowEditDialog(true)}}
        onDelete={handleDelete}
        onPreview={(invoice: Invoice)=>navigate(`/invoices/${invoice.id}`)}
      />

      <NavigationControl
        pageCount={pagination.page}
        maxPages={maxPages}
        modifyPagination={modifyPagination}
      />

      <CreateInvoiceForm
        onSave={refetchInvoices}
        show={showCreateDialog}
        hide={()=>setShowCreateDialog(false)}
      />
      
      <EditInvoiceForm
        invoice={selectedEdit}
        onSave={refetchInvoices}
        show={!!(showEditDialog&&selectedEdit)}
        hide={()=>setShowCreateDialog(false)}
      />

      {/* 
      <MaterialPriceModal
      open={showMaterialCostModal}
      onClose={()=>setShowMaterialCostModal(false)}
      getMaterialSupplierCosts={getSupplierMaterialCosts}
      getMaterialSupplierInvoices={getSupplierMaterialInvoices}
      /> */}

    </Container>
  )
}

export default InvoicesPage

