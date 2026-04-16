import React from 'react'
import { useNavigate } from 'react-router'
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material'
import { FiArrowRight } from 'react-icons/fi'
import { useSuppliers } from '../../hooks/useSuppliers'
import { useMaterials } from '../../hooks/useMaterials'
import { useTransactions } from '../../hooks/useTransactions'
import { StatsCard } from '../../components/common'
import { formatCurrency } from '../../utils/helpers'
import { Loader } from '../../components/ui'

const HomePage = () => {
  const navigate = useNavigate()
  const { suppliers, total: suppliersTotal, loading: suppliersLoading } = useSuppliers()
  const { materials, total: materialsTotal, loading: materialsLoading } = useMaterials()
  const { transactions, total: transactionsTotal, loading: transactionsLoading, detailedCosts } = useTransactions()

  /**
   * Reusable table component for displaying entity previews
   */
  interface SupplierTableProps {
    data: typeof suppliers
    total:  number;
    loading: boolean
    onViewMore: () => void
  }

  const SupplierTable: React.FC<SupplierTableProps> = ({ data, total, loading, onViewMore }) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>الموردون</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>الإجمالي: {total}</Typography>
        </Box>
        <TableContainer component={Paper} sx={{ mb: 2 }}>
          {
          loading? (
            <div className='w-full flex justify-center py-10'>
              <Loader size={30} thickness={5}/>
            </div>
          ):
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>الاسم</TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>الهاتف الأول</TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>العنوان</TableCell>
              </TableRow>
            </TableHead>
            
              <TableBody>
              {
              data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} sx={{ textAlign: 'center', py: 3 }}>
                    لا يوجد موردون لعرضهم
                  </TableCell>
                </TableRow>
              ) : (
                data.slice(0, 4).map((row) => (
                  <TableRow key={row.id} sx={{ '&:hover': { backgroundColor: '#fafafa' } }}>
                    <TableCell sx={{textAlign: 'right'}}>{row.name}</TableCell>
                    <TableCell sx={{textAlign: 'right'}}>{row.phone1}</TableCell>
                    <TableCell sx={{textAlign: 'right'}}>{row.address || '-'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          }
        </TableContainer>
      </CardContent>
      <CardActions dir='ltr'>
        <Button onClick={onViewMore} sx={{ ml: 'auto' }} endIcon={<FiArrowRight />}>
          عرض الكل والإدارة
        </Button>
      </CardActions>
    </Card>
  )

  interface MaterialTableProps {
    data: typeof materials
    total: number
    loading: boolean
    onViewMore: () => void
  }

  const MaterialTable: React.FC<MaterialTableProps> = ({ data, total, loading, onViewMore }) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>المواد</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>الإجمالي: {total}</Typography>
        </Box>
        <TableContainer component={Paper} sx={{ mb: 2 }}>
          {
          loading? (
            <div className='w-full flex justify-center py-10'>
              <Loader size={30} thickness={5}/>
            </div>
          ):
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>الاسم</TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>الوصف</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
              data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} sx={{ textAlign: 'center', py: 3 }}>
                    لا توجد مواد لعرضها
                  </TableCell>
                </TableRow>
              ) : (
                data.slice(0, 4).map((row) => (
                  <TableRow key={row.id} sx={{ '&:hover': { backgroundColor: '#fafafa' } }}>
                    <TableCell sx={{ textAlign: 'right' }}>{row.name}</TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>{row.description?.substring(0, 30) || '-'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          }
        </TableContainer>
      </CardContent>
      <CardActions dir='ltr'>
        <Button onClick={onViewMore} sx={{ ml: 'auto' }} endIcon={<FiArrowRight />}>
          عرض الكل والإدارة
        </Button>
      </CardActions>
    </Card>
  )

  interface TransactionTableProps {
    data: typeof transactions
    total: number
    loading: boolean
    onViewMore: () => void
  }

  const TransactionTable: React.FC<TransactionTableProps> = ({ data, total, onViewMore, loading }) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>الحركات الأخيرة</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>الإجمالي: {total}</Typography>
        </Box>
        <TableContainer component={Paper} sx={{ mb: 2 }}>
          {
          loading? (
            <div className='w-full flex justify-center py-10'>
              <Loader size={30} thickness={5}/>
            </div>
          ):
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>رقم</TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>المورد</TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>المادة</TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>الحالة</TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>الكمية</TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>سعر الوحدة</TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>الإجمالي</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
              data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', py: 3 }}>
                    لا توجد حركات لعرضها
                  </TableCell>
                </TableRow>
              ) :
              data.slice(0, 4).map((row) => (
                <TableRow key={row.id} sx={{ '&:hover': { backgroundColor: '#fafafa' } }}>
                  <TableCell sx={{textAlign: 'right'}}>#{row.id}</TableCell>
                  <TableCell sx={{textAlign: 'right'}}>{row.supplier.name}</TableCell>
                  <TableCell sx={{textAlign: 'right'}}>{row.material.name}</TableCell>
                  <TableCell sx={{textAlign: 'center'}}>
                    <Box
                      sx={{
                        display: 'inline-block',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '4px',
                        backgroundColor: row.status==='received' ? '#4caf5020' : '#2196f320',
                        color: row.status==='received' ? '#4caf50' : '#2196f3',
                        fontSize: '0.85rem',
                        fontWeight: 500
                      }}
                    >
                      {row.status==='received' ? 'تم الاستلام' : 'لم يتم الاستلام'}
                    </Box>
                  </TableCell>
                  <TableCell sx={{textAlign: 'center'}}>{row.quantity.toLocaleString('ar-EG')}</TableCell>
                  <TableCell sx={{textAlign: 'center'}}>{formatCurrency(row.unitPrice)}</TableCell>
                  <TableCell sx={{textAlign: 'center'}}>{formatCurrency(row.quantity*row.unitPrice)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          }
        </TableContainer>
      </CardContent>
      <CardActions dir='ltr'>
        <Button onClick={onViewMore} sx={{ ml: 'auto' }} endIcon={<FiArrowRight />}>
          عرض الكل والإدارة
        </Button>
      </CardActions>
    </Card>
  )

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
          value={suppliers.length}
          label="الموردون"
          backgroundColor="#e3f2fd"
          textColor="#1976d2"
          captionColor="#1565c0"
        />
        <StatsCard
          value={materials.length}
          label="المواد"
          backgroundColor="#f3e5f5"
          textColor="#7b1fa2"
          captionColor="#6a1b9a"
        />
        <StatsCard
          value={transactions.length}
          label="الفواتير"
          backgroundColor="#fff3e0"
          textColor="#f57c00"
          captionColor="#e65100"
        />
        <StatsCard
          value={
            formatCurrency(detailedCosts.total)
          }
          label="إجمالي التكاليف"
          backgroundColor="#e8f5e9"
          textColor="#388e3c"
          captionColor="#2e7d32"
        />
      </Box>

      {/* Tables */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
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
