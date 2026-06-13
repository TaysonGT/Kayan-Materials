import React from 'react'
import { Loader } from "../../components/ui"
import type { Transaction } from "../../types"
import { formatCurrency } from "../../utils/helpers"
import { FiArrowLeft } from "react-icons/fi"

export interface TransactionTableProps {
data: Transaction[]
total: number
loading: boolean
onViewMore: () => void
}

const TransactionTable: React.FC<TransactionTableProps> = ({ data, total, onViewMore, loading }) => (
    <div className="shadow-sm border border-[#d9d9d9] rounded-sm bg-white">
        <div className="p-4">
            <div className='flex justify-between items-center mb-2'>
                <div className="font-semibold">الحركات الأخيرة</div>
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
                                <th className="px-4 py-2 font-semibold text-right">رقم</th>
                                <th className="px-4 py-2 font-semibold text-right">المورد</th>
                                <th className="px-4 py-2 font-semibold text-right">المادة</th>
                                <th className="px-4 py-2 font-semibold text-center">الحالة</th>
                                <th className="px-4 py-2 font-semibold text-center">الكمية</th>
                                <th className="px-4 py-2 font-semibold text-center">سعر الوحدة</th>
                                <th className="px-4 py-2 font-semibold text-center">الإجمالي</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-3">لا توجد حركات لعرضها</td>
                                </tr>
                            ) : (
                                data.slice(0, 4).map((row) => (
                                    <tr key={row.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 text-right">#{row.id}</td>
                                        <td className="px-4 py-2 text-right">{row.invoice?.supplier?.name}</td>
                                        <td className="px-4 py-2 text-right">{row.material?.name}</td>
                                        <td className="px-4 py-2 text-center">
                                            <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${row.status === 'received' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                                {row.status === 'received' ? 'تم الاستلام' : 'لم يتم الاستلام'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 text-center">{row.quantity.toLocaleString('ar-EG')}</td>
                                        <td className="px-4 py-2 text-center">{formatCurrency(row.unitPrice)}</td>
                                        <td className="px-4 py-2 text-center">{formatCurrency(row.total || 0)}</td>
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

export default TransactionTable;