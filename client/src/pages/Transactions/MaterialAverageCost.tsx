import { Box, Button, Chip, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useSuppliers } from '../../hooks/useSuppliers'
import { type Transaction, type Material, type Supplier, type Invoice } from '../../types'
import FiltersBar, { type FilterProps } from './FiltersBar'
import { DataTable, StatsCard } from '../../components/common'
import { formatCurrency } from '../../utils/helpers'
import { toast } from 'react-toastify'
import NavigationControl from '../../components/ui/NavigationControl'
import { getSupplierAssociatedMaterials } from '../../services/materials.service'

interface Props {
    open: boolean,
    onClose: ()=>void,
    getMaterialSupplierCosts: (supplierId: string, materialId: string)=> Promise<{
        total: number;
        materialTotal: number;
        freightTotal: number;
        averageCost: number;
        materialUnitCount: number;
        success: boolean;
        message: string;
    } | undefined>;
    getMaterialSupplierTransactions: (params:{supplierId: string, materialId: string, page:number, limit:number})=> Promise<{
        transactions: Transaction[];
        total: number;
        page: number;
        limit: number;
        success: boolean;
        message: string;
    } | undefined>
}

const MaterialAverageCost:React.FC<Props> = ({open, onClose, getMaterialSupplierCosts, getMaterialSupplierTransactions}) => {
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier|undefined>()
    const [selectedMaterial, setSelectedMaterial] = useState<Material|undefined>()
    const {suppliers} = useSuppliers()
    const [materials, setMaterials] = useState<Material[]>([])
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(false)
    const [pagination, setPagination] = useState({ page: 1, limit: 10 })
    const [maxPages, setMaxPages] = useState(0)
    const [total, setTotal] = useState(0)

    const [costInfo, setCostInfo] = useState<{
        total: number,
        materialTotal: number,
        freightTotal: number,
        averageCost: number,
        materialUnitCount: number
    }|undefined>()

    const reset = ()=>{
      setSelectedMaterial(undefined)
      setSelectedSupplier(undefined)
      setTransactions([])
      setPagination({page:1, limit:10})
      setCostInfo(undefined)
      setLoading(false)
    }

    const calculate = async()=>{
        setLoading(true)
        if(!selectedMaterial||!selectedSupplier){
            toast.error('برجاء اختيار المورد والخام')
            setLoading(false)
            reset()
            return
        };
        await getCosts()
        await getTransactions()
        setLoading(false)
    }

    const getCosts = async()=> {
      await getTransactions()
      const data = await getMaterialSupplierCosts(selectedSupplier?.id||'', selectedMaterial?.id||'')
      setCostInfo(data)   
    }
    
    const getTransactions = async()=> {
      if(!selectedMaterial||!selectedSupplier){
          toast.error('برجاء اختيار المورد والخام')
          setLoading(false)
          return
      };
      const data = await getMaterialSupplierTransactions({supplierId: selectedSupplier.id, materialId: selectedMaterial.id, page: pagination.page, limit: pagination.limit})
      setTransactions(data?.transactions||[])
      setMaxPages(Math.ceil((data?.total || 0) / pagination.limit))
      setTotal(data?.total || 0)
    }

    const modifyPagination = (newPagination: Partial<typeof pagination>) => {
        setPagination(prev => ({...prev, ...newPagination}))
    }

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
          align: 'center' as const
    ,
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
        }
      ]

    const filters: FilterProps[] = [
    {
        label: 'المورد',
        value: selectedSupplier?.id,
        options: suppliers.map((s)=>({label: s.name, value: s.id})),
        onChange: (value:any)=>setSelectedSupplier(suppliers.find(s=>s.id===value))
    },
    {
        label: 'الخام',
        value: selectedMaterial?.id,
        options: materials.map((s)=>({label: s.name, value: s.id})),
        onChange: (value:any)=>setSelectedMaterial(materials.find(s=>s.id===value))
    }
    ]

    const loadMaterials = async (supplier?:Supplier)=>{
      if(supplier){
        getSupplierAssociatedMaterials(supplier.id)
        .then((materials)=>setMaterials(materials))
        .catch(err=> toast.error(err.message))
      }
    }

    useEffect(()=>{
      selectedSupplier && loadMaterials(selectedSupplier)
    },[selectedSupplier])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>متوسط سعر الخام</DialogTitle>
        <DialogContent sx={{ pt: 8, display: 'flex', flexDirection: 'column'}}>
            <Box sx={{display:'flex', alignItems: 'start', pt:1, gap:2}}>
                <FiltersBar filters={filters}/>
                <Button onClick={calculate} variant="contained" size='large' disabled={loading}>
                    {loading ? 'جاري...' : 'حساب'}
                </Button>
                <Button onClick={reset} variant="outlined" color='error' size='large'>
                    إعادة
                </Button>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
                <StatsCard
                value={costInfo?.materialUnitCount||0}
                label="عدد الوحدات"
                backgroundColor="#e3f2fd"
                textColor="#1976d2"
                captionColor="#1565c0"
                loading={loading}
                />
                <StatsCard
                value={formatCurrency(costInfo?.averageCost||0)}
                label="متوسط سعر الوحدة"
                backgroundColor="#e8f5e9"
                textColor="#388e3c"
                captionColor="#2e7d32"
                loading={loading}
                />
                <StatsCard
                value={formatCurrency(costInfo?.materialTotal||0)}
                label="إجمالي الخام"
                backgroundColor="#fff3e0"
                textColor="#f57c00"
                captionColor="#e65100"
                loading={loading}
                />
                <StatsCard
                value={formatCurrency(costInfo?.freightTotal||0)}
                label="إجمالي النولون"
                backgroundColor="#f3e5f5"
                textColor="#7b1fa2"
                captionColor="#6a1b9a"
                loading={loading}
                />
                
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>الحركات الأخيرة</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>الإجمالي: {total}</Typography>
            </Box>
            <DataTable
              withAcitons={false}
              columns={tableColumns}
              rows={transactions}
              loading={loading}
            />
            <NavigationControl 
            maxPages={maxPages}
            pageCount={pagination.page}
            modifyPagination={modifyPagination}
            />
        </DialogContent>
    </Dialog>
  )
}

export default MaterialAverageCost