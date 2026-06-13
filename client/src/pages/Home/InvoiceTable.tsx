import React from 'react'
import { Loader } from "../../components/ui"
import { FiArrowLeft } from "react-icons/fi"
import type { Invoice } from "../../types"
import { formatCurrency, formatDateDisplay } from "../../utils/helpers"
interface InvoiceTableProps {
    data: Invoice[]
    total: number
    loading: boolean
    onViewMore: () => void
}

interface InvoiceTableProps {
    data: Invoice[]
    total: number
    loading: boolean
    onViewMore: () => void
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ data, total, loading, onViewMore }) => (
    <div className="shadow-sm border border-[#d9d9d9] rounded-sm bg-white">
        <div className="p-4">
            <div className='flex justify-between items-center mb-2'>
                <div className="font-semibold">الفواتير</div>
                <div className="text-sm text-gray-500">الإجمالي: {total}</div>
            </div>
            <div className="mb-2 border border-[#e8e8e8] rounded-sm">
                {loading ? (
                    <div className='w-full flex justify-center py-10'>
                        <Loader size={30} thickness={5} />
                    </div>
                ) : (
                    <table className="min-w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 font-semibold text-start">التاريخ</th>
                                <th className="px-4 py-2 font-semibold text-start">المورد</th>
                                <th className="px-4 py-2 font-semibold text-start">الأصناف</th>
                                <th className="px-4 py-2 font-semibold text-start">الإجمالي</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-3">لا توجد فواتير لعرضها</td>
                                </tr>
                            ) : (
                                data.slice(0, 4).map((row) => (
                                    <tr key={row.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-2">{formatDateDisplay(row.createdAt)}</td>
                                        <td className="px-4 py-2">{row.supplier.name}</td>
                                        <td className="px-4 py-2">{row.transactions.length}</td>
                                        <td className="px-4 py-2">{formatCurrency(row.total || 0)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
        <div className="p-3 flex justify-end">
            <button onClick={onViewMore} className="flex items-center gap-2 px-3 py-2 bg-transparent text-blue-600 hover:underline cursor-pointer">
                عرض الكل والإدارة <FiArrowLeft />
            </button>
        </div>
    </div>
)

export default InvoiceTable