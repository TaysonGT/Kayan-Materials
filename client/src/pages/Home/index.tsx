import { useNavigate } from 'react-router'
import {
  Container,
  Box,
  Typography
} from '@mui/material'
import { useSuppliers } from '../../hooks/useSuppliers'
import { useMaterials } from '../../hooks/useMaterials'
import { useTransactions } from '../../hooks/useTransactions'
import { StatsCard } from '../../components/common'
import { formatCurrency } from '../../utils/helpers'
import TransactionTable from './TransactionTable'
import MaterialTable from './MaterialTable'
import SupplierTable from './SupplierTable'
import InvoiceTable from './InvoiceTable'
import { useInvoices } from '../../hooks/useInvoices'

const HomePage = () => {
  const navigate = useNavigate()
  const { suppliers, total: suppliersTotal, loading: suppliersLoading } = useSuppliers()
  const { materials, total: materialsTotal, loading: materialsLoading } = useMaterials({})
  const { transactions, total: transactionsTotal, loading: transactionsLoading, detailedCosts } = useTransactions()
  const { invoices, total: invoicesTotal, loading: invoicesLoading } = useInvoices({autoRefetch:true})

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          لوحة التحكم
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          نظرة عامة على الموردين والمواد والفواتير
        </Typography>
      </Box>

      {/* Stats Overview */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3, mb: 4 }}>
        <StatsCard
          value={suppliersTotal}
          label="الموردون"
          backgroundColor="#e3f2fd"
          textColor="#1976d2"
          captionColor="#1565c0"
          loading={suppliersLoading}
        />
        <StatsCard
          value={materialsTotal}
          label="المواد"
          backgroundColor="#f3e5f5"
          textColor="#7b1fa2"
          captionColor="#6a1b9a"
          loading={materialsLoading}
        />
        <StatsCard
          value={invoicesTotal}
          label="الفواتير"
          backgroundColor="#fff3e0"
          textColor="#f57c00"
          captionColor="#e65100"
          loading={invoicesLoading}
        />
        <StatsCard
          value={formatCurrency(detailedCosts.total)}
          label="إجمالي التكاليف"
          backgroundColor="#e8f5e9"
          textColor="#388e3c"
          captionColor="#2e7d32"
          loading={transactionsLoading}
        />
      </Box>

      {/* Tables */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
        <InvoiceTable
          data={invoices}
          total={invoicesTotal}
          loading={invoicesLoading}
          onViewMore={() => navigate('/invoices')}
        />
        <SupplierTable
          data={suppliers}
          total={suppliersTotal}
          loading={suppliersLoading}
          onViewMore={() => navigate('/suppliers')}
        />
        <MaterialTable
          data={materials}
          total={materialsTotal}
          loading={materialsLoading}
          onViewMore={() => navigate('/materials')}
        />
        <TransactionTable
          data={transactions}
          total={transactionsTotal}
          loading={transactionsLoading}
          onViewMore={() => navigate('/transactions')}
        />
      </Box>
    </Container>
  )
}

export default HomePage
