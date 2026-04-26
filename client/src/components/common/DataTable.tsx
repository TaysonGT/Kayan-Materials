import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Typography
} from '@mui/material'
import { FiEdit, FiEye, FiTrash2 } from 'react-icons/fi'
import { Loader } from '../ui'

interface Column {
  field: string
  label: string
  align?: 'left' | 'center' | 'right'
  render?: (value: any, row: any) => React.ReactNode
}

interface DataTableProps {
  columns: Column[]
  rows: any[]
  withAcitons?: boolean
  onEdit?: (row: any) => void
  onDelete?: (row: any) => void
  onPreview?: (row: any) => void
  emptyMessage?: string
  rowsPerPage?: number
  loading: boolean;
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  rows,
  loading,
  onEdit,
  onDelete,
  onPreview,
  withAcitons=true,
  emptyMessage = 'لا توجد بيانات',
  rowsPerPage = 10
}) => {
  
  if (loading) {
    return (
      <div className='w-full flex justify-center py-10'>
          <Loader size={30} thickness={5}/>
        </div>
      )
  }

  if (rows.length<1) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {emptyMessage}
        </Typography>
      </Paper>
    )
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            {columns.map((col) => (
              <TableCell
                key={col.field}
                sx={{ fontWeight: 600 }}
                align={col.align || 'left'}
              >
                {col.label}
              </TableCell>
            ))}
            { withAcitons&&
              <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>
                الإجراءات
              </TableCell>
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.slice(0, rowsPerPage).map((row, idx) => (
            <TableRow
              key={row.id || idx}
              sx={{ '&:hover': { backgroundColor: '#fafafa' } }}
            >
              {columns.map((col) => (
                <TableCell
                  key={`${row.id}-${col.field}`}
                  align={col.align || 'left'}
                >
                  {col.render ? col.render(row[col.field], row) : row[col.field]}
                </TableCell>
              ))}
              {withAcitons&&
              <TableCell sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                  {onEdit&&
                    <IconButton
                      size="small"
                      onClick={() => onEdit(row)}
                      sx={{ color: '#1976d2' }}
                      title="تعديل"
                    >
                      <FiEdit />
                    </IconButton>
                  }
                  {onDelete&&
                    <IconButton
                      size="small"
                      onClick={() => onDelete(row)}
                      sx={{ color: '#d32f2f' }}
                      title="حذف"
                    >
                      <FiTrash2 />
                    </IconButton>
                  }
                  {onPreview&&
                    <IconButton
                      size="small"
                      onClick={() => onPreview(row)}
                      sx={{ color: '#040a4e' }}
                      title="عرض"
                    >
                      <FiEye />
                    </IconButton>
                  }
                </Box>
              </TableCell>
              }
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default DataTable
