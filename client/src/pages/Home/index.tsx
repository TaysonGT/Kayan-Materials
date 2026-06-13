import { useNavigate } from 'react-router'
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
import { RiBillLine, RiCashLine } from 'react-icons/ri'
import { MdPeople } from 'react-icons/md'
import { LuContainer } from 'react-icons/lu'

const HomePage = () => {
  const navigate = useNavigate()
  const { suppliers, total: suppliersTotal, loading: suppliersLoading } = useSuppliers()
  const { materials, total: materialsTotal, loading: materialsLoading } = useMaterials({})
  const { transactions, total: transactionsTotal, loading: transactionsLoading, detailedCosts } = useTransactions()
  const { invoices, total: invoicesTotal, loading: invoicesLoading } = useInvoices({autoRefetch:true})

  const stats =[
    {
      value:suppliersTotal,
      label:"الموردون",
      loading:suppliersLoading,
      icon:<MdPeople/>
    },
    {
      value:materialsTotal,
      label:"المواد",
      loading:materialsLoading,
      icon:<LuContainer/>
    },
    {
      value:invoicesTotal,
      label:"الفواتير",
      loading:invoicesLoading,
      icon:<RiBillLine/>
    },
    {
      value:formatCurrency(detailedCosts.total),
      label:"إجمالي التكاليف",
      loading:transactionsLoading,
      icon:<RiCashLine/>
    }
  ]

  return (
    <div className="max-w-screen-lg mx-auto py-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-1">لوحة التحكم</h1>
        <p className="text-sm text-gray-500">نظرة عامة على الموردين والمواد والفواتير</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {stats.map((stat, i) => (
          <StatsCard key={i} value={stat.value} label={stat.label} loading={stat.loading} icon={stat.icon} />
        ))}
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 gap-3">
        <InvoiceTable data={invoices} total={invoicesTotal} loading={invoicesLoading} onViewMore={() => navigate('/invoices')} />
        <SupplierTable data={suppliers} total={suppliersTotal} loading={suppliersLoading} onViewMore={() => navigate('/suppliers')} />
        <MaterialTable data={materials} total={materialsTotal} loading={materialsLoading} onViewMore={() => navigate('/materials')} />
        <TransactionTable data={transactions} total={transactionsTotal} loading={transactionsLoading} onViewMore={() => navigate('/transactions')} />
      </div>
    </div>
  )
}

export default HomePage
