import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Chip,
  IconButton
} from '@mui/material'
import { FiTrash2 } from 'react-icons/fi';

interface RelationsModalProps {
  id: string;
  open: boolean
  title: string
  entityName: string
  count: number
  items: any[]
  columns: Array<{
    field: string
    label: string
    render?: (value: any, row: any) => React.ReactNode
  }>
  onClose: () => void;
  onAdd: () => void;
  onDelete?: (id1: string) => void;
}

const RelationsModal: React.FC<RelationsModalProps> = ({
  open,
  title,
  entityName,
  count,
  items,
  columns,
  onClose,
  onAdd,
  onDelete
}) => {
  if (!items.length) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent sx={{ py: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              لا توجد {entityName} مرتبطة
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>إغلاق</Button>
          <Button onClick={onAdd} variant="contained" color="primary">
            إضافة {entityName}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{title}</span>
          <Chip label={`${count} ${entityName}`} color="primary" variant="outlined" />
        </Box>
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                {columns.map((col) => (
                  <TableCell key={col.field} sx={{ fontWeight: 600, textAlign: 'center' }}>
                    {col.label}
                  </TableCell>
                ))}
                <TableCell key={`${'remove'}`} sx={{ textAlign: 'center' }}>
                  إزالة
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, idx) => (
                <TableRow key={item.id || idx} sx={{ '&:hover': { backgroundColor: '#fafafa' } }}>
                  {columns.map((col) => (
                    <TableCell sx={{ textAlign: 'center' }} key={`${item.id}-${col.field}`}>
                      {col.render ? col.render(item[col.field], item) : item[col.field]}
                    </TableCell>
                  ))}
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => onDelete&&onDelete(item.id)}
                        sx={{ color: '#d32f2f' }}
                        title="حذف"
                      >
                        <FiTrash2 />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>إغلاق</Button>
        <Button onClick={onAdd} variant="contained" color="primary">
            إضافة {entityName}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RelationsModal
