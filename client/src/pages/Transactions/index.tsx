import { Container, Box, Chip, Button } from '@mui/material'
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
        <Chip
          label={value==='received' ? 'مسلم' : 'معلق'}
          color={value==='received' ? 'success' : 'warning'}
          variant="outlined"
          size="small"
        />
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <PageHeader
        title={PAGE_HEADERS.transactions.title}
        subtitle={PAGE_HEADERS.transactions.subtitle}
        buttonText={PAGE_HEADERS.transactions.buttonText}
        // onAddClick={() => setShowCreateDialog(true)}
        onAddClick={() => 0}
      />

      {/* Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
        <StatsCard
          value={formatCurrency(detailedCosts.receivedCosts)}
          label="الحركات المسلمة"
          backgroundColor="#e8f5e9"
          textColor="#388e3c"
          captionColor="#2e7d32"
          loading={loading}
        />
        <StatsCard
          value={formatCurrency(detailedCosts.notReceivedCosts)}
          label="الحركات المعلقة"
          backgroundColor="#fff3e0"
          textColor="#f57c00"
          captionColor="#e65100"
          loading={loading}
        />
        <StatsCard
          value={transactions.length}
          label="إجمالي الحركات"
          backgroundColor="#f3e5f5"
          textColor="#7b1fa2"
          captionColor="#6a1b9a"
          loading={loading}
        />
      </Box>
      
      <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
        <FiltersBar filters={filters}/>
        <Button
          dir='ltr'
          variant="contained"
          startIcon={<FiEye />}
          onClick={()=>setShowMaterialCostModal(true)}>
          متوسط سعر الخام
        </Button>
      </Box>

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

    </Container>
  )
}

export default TransactionsPage

