import { useEffect, useState } from 'react'
import { Container, Box, Chip, IconButton, Typography, TextField, Button } from '@mui/material'
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
        render: (value: any) => value? formatCurrency (value):'-',
        align: 'center' as const
      }
    ]
  

  useEffect(()=>{
    loadInvoice()
  },[invoiceId])

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => navigate('/invoices')} size="small">
          <FiArrowRight />
        </IconButton>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            عرض فاتورة
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            تفاصيل الفاتورة وعناصرها
          </Typography>
        </Box>
      </Box>
      <Box sx={{ pt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField 
                aria-readonly
                focused={false}
                label={'المورد'}
                value={invoice?.supplier?.name||'لم يتم تحديد المورد'}
            />
            <TextField 
                aria-readonly
                focused={false}
                label={'التاريخ'}
                value={formatDateDisplay(invoice?.createdAt||0)}
            />
            <TextField 
                aria-readonly
                focused={false}
                label={'الوصف'}
                value={invoice?.description||'-'}
            />
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField 
                aria-readonly
                focused={false}
                label={'القيمة المدفوعة'}
                value={formatCurrency(invoice?.paid||0)}
            />
            <TextField 
                aria-readonly
                focused={false}
                label={'النولون'}
                value={formatCurrency(invoice?.freight||0)}
            />
            <TextField 
                aria-readonly
                focused={false}
                label={'الإجمالي'}
                value={formatCurrency(invoice?.total||0)}
            />
        </Box>
      </Box>
      <Box sx={{mt: 4}}>
        <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
            <Typography variant='h6' fontWeight={600}>
                عناصر الفاتورة
            </Typography>
            <Button onClick={()=>setShowAddDialog(true)} variant='contained' color='primary'>
                إضافة عنصر
            </Button>
        </Box>
        <Box sx={{mt: 2}}>    
            <DataTable
                columns={transactionsTableColumns}
                rows={invoice?.transactions||[]}
                loading={loading}
                onEdit={(transaction: Transaction)=>{
                    setSelectedEdit(transaction);
                    setShowEditDialog(true)}
                }
                onDelete={handleDelete}
            />
        </Box>
      </Box>

      <CreateTransactionForm 
        show={showAddDialog} 
        hide={()=>setShowAddDialog(false)} 
        invoice={invoice} 
        onSave={loadInvoice}
      />
      
      <EditTransactionForm 
        show={showEditDialog} 
        hide={()=>setShowEditDialog(false)} 
        transaction={selectedEdit} 
        invoice={invoice}
        onSave={loadInvoice}
      />

    </Container>
  )
}

export default SingleInvoicePage