import { Box, Button, Card, CardActions, CardContent, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { Loader } from "../../components/ui"
import type { Transaction } from "../../types"
import { formatCurrency } from "../../utils/helpers"
import { FiArrowRight } from "react-icons/fi"

export interface TransactionTableProps {
data: Transaction[]
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
                    <TableCell sx={{textAlign: 'right'}}>{row.invoice?.supplier?.name}</TableCell>
                    <TableCell sx={{textAlign: 'right'}}>{row.material?.name}</TableCell>
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
                    <TableCell sx={{textAlign: 'center'}}>{formatCurrency(row.total||0)}</TableCell>
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

export default TransactionTable;