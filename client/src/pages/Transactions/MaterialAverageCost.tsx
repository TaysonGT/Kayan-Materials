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
            <span className={`inline-block px-2 py-1 text-sm rounded ${value === 'received' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'}`}>{value === 'received' ? 'مسلم' : 'معلق'}</span>
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
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={onClose} />
          <div className="bg-white rounded shadow-lg max-w-4xl w-full p-6 z-10">
            <div className="text-lg font-bold mb-4">متوسط سعر الخام</div>

            <div className="flex items-start gap-2 pt-1">
              <FiltersBar filters={filters} />
              <div className="flex items-center gap-2">
                <button onClick={calculate} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? 'جاري...' : 'حساب'}</button>
                <button onClick={reset} className="px-4 py-2 border rounded text-red-600">إعادة</button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mb-3 mt-4">
              <StatsCard value={costInfo?.materialUnitCount || 0} label="عدد الوحدات" loading={loading} />
              <StatsCard value={formatCurrency(costInfo?.averageCost || 0)} label="متوسط سعر الوحدة" loading={loading} />
              <StatsCard value={formatCurrency(costInfo?.materialTotal || 0)} label="إجمالي الخام" loading={loading} />
              <StatsCard value={formatCurrency(costInfo?.freightTotal || 0)} label="إجمالي النولون" loading={loading} />
            </div>

            <div className="flex justify-between items-center mb-2">
              <div className="text-lg font-semibold">الحركات الأخيرة</div>
              <div className="text-sm text-gray-500">الإجمالي: {total}</div>
            </div>

            <DataTable withAcitons={false} columns={tableColumns} rows={transactions} loading={loading} />
            <NavigationControl maxPages={maxPages} pageCount={pagination.page} modifyPagination={modifyPagination} />
          </div>
        </div>
      )}
    </>
  )
}

export default MaterialAverageCost