import { Box, Button, Card, CardActions, CardContent, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import type { Invoice } from "../../types"
import { Loader } from "../../components/ui"
import { FiArrowRight } from "react-icons/fi"
import { formatCurrency, formatDateDisplay } from "../../utils/helpers"

interface InvoiceTableProps {
    data: Invoice[]
    total: number
    loading: boolean
    onViewMore: () => void
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ data, total, loading, onViewMore }) => (
    <Card>
        <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>الفواتير</Typography>
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
                    <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>التاريخ </TableCell>
                    <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>المورد</TableCell>
                    <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>الأصناف</TableCell>
                    <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>الإجمالي</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                data.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={4} sx={{ textAlign: 'center', py: 3 }}>
                        لا توجد فواتير لعرضها
                    </TableCell>
                </TableRow>
                ) : (
                data.slice(0, 4).map((row) => (
                    <TableRow key={row.id} sx={{ '&:hover': { backgroundColor: '#fafafa' } }}>
                        <TableCell sx={{ textAlign: 'right' }}>{formatDateDisplay(row.createdAt)}</TableCell>
                        <TableCell sx={{ textAlign: 'right' }}>{row.supplier.name}</TableCell>
                        <TableCell sx={{ textAlign: 'right' }}>{row.transactions.length}</TableCell>
                        <TableCell sx={{ textAlign: 'right' }}>{formatCurrency(row.total||0)}</TableCell>
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

export default InvoiceTable