import { Container, Box, Chip, Button } from '@mui/material'
import { useTransactions } from '../../hooks/useTransactions'
import { PageHeader, DataTable, StatsCard } from '../../components/common'
import type { Material, Supplier, Transaction } from '../../types'
import { PAGE_HEADERS, VALIDATION_MESSAGES, DELIVERY_FILTER_OPTIONS } from '../../utils/constants'
import { formatCurrency } from '../../utils/helpers'
import NavigationControl from '../../components/ui/NavigationControl'
import { useState } from 'react'
import CreateTransactionForm from './CreateTransactionForm'
import EditTransactionForm from './EditTransactionForm'
import { useSuppliers } from '../../hooks/useSuppliers'
import  { useMaterials } from '../../hooks/useMaterials'
import FiltersBar, { type FilterProps } from './FiltersBar'
import { FiEye } from 'react-icons/fi'
import MaterialPriceModal from './MaterialPriceModal'

const TransactionsPage = () => {
  const { transactions, loading, getSupplierMaterialCosts, getSupplierMaterialTransactions, detailedCosts, refetchTransactions, statusFilter, materialFilter, supplierFilter, setSupplierFilter, setMaterialFilter, setStatusFilter, pagination, modifyPagination, maxPages, deleteTransaction} = useTransactions()
  const { suppliers } = useSuppliers()
  const { materials } = useMaterials()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedEdit, setSelectedEdit] = useState<Transaction|null>(null)
  const [showMaterialCostModal, setShowMaterialCostModal] = useState(false)

  const handleDelete = (transaction: Transaction) => {
    if (window.confirm(VALIDATION_MESSAGES.deleteConfirm('هذه الفاتورة'))) {
      deleteTransaction(transaction.id)
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
      field: 'supplier',
      label: 'المورد',
      render: (supplier: Supplier) => supplier.name,
      align: 'center' as const

    },
    {
      field: 'material',
      label: 'المادة',
      render: (material: Material) => material.name,
      align: 'center' as const
    },
    {
      field: 'type',
      label: 'النوع',
      render: (value: string) => {
        switch (value) {
          case 'material':
            return 'فاتورة';
          case 'freight':
            return 'نولون';
          default:
            return value;
        }
      },
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
      field: 'date', label: 'التاريخ', 
      render: (date: string)=> 
        date?new Date(date).toLocaleDateString('ar-EG', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }):'-',
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
        onAddClick={() => setShowCreateDialog(true)}
      />

      {/* Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
        <StatsCard
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
        />
        <StatsCard
          value={transactions.length}
          label="إجمالي الفواتير"
          backgroundColor="#f3e5f5"
          textColor="#7b1fa2"
          captionColor="#6a1b9a"
          loading={loading}
        />
        <StatsCard
          value={transactions.filter(i => i.status==='pending').length}
          label="فواتير معلقة"
          backgroundColor="#e3f2fd"
          textColor="#1976d2"
          captionColor="#1565c0"
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
        onEdit={(transaction: Transaction)=>{
          setSelectedEdit(transaction);
          setShowEditDialog(true)}}
        onDelete={handleDelete}
      />

      <NavigationControl
        pageCount={pagination.page}
        maxPages={maxPages}
        modifyPagination={modifyPagination}
      />

      <CreateTransactionForm
      onSave={refetchTransactions}
      show={showCreateDialog}
      hide={()=>setShowCreateDialog(false)}
      />

      <EditTransactionForm
      onSave={refetchTransactions}
      show={showEditDialog}
      hide={()=>{setShowEditDialog(false);setSelectedEdit(null)}}
      transaction={selectedEdit}
      />

      <MaterialPriceModal
      open={showMaterialCostModal}
      onClose={()=>setShowMaterialCostModal(false)}
      getMaterialSupplierCosts={getSupplierMaterialCosts}
      getMaterialSupplierTransactions={getSupplierMaterialTransactions}
      />

    </Container>
  )
}

export default TransactionsPage

