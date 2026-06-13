import React from 'react'
import type { Supplier } from "../../types"
import { Loader } from "../../components/ui"
import { FiArrowLeft } from "react-icons/fi"

interface SupplierTableProps {
    data: Supplier[]
    total:  number;
    loading: boolean
    onViewMore: () => void
}

const SupplierTable: React.FC<SupplierTableProps> = ({ data, total, loading, onViewMore }) => (
    <div className="shadow-sm border border-[#d9d9d9] rounded-sm bg-white">
        <div className="p-4">
            <div className='flex justify-between items-center mb-2'>
                <div className="font-semibold">الموردون</div>
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
                                <th className="px-4 py-2 font-semibold text-start">الاسم</th>
                                <th className="px-4 py-2 font-semibold text-start">الهاتف الأول</th>
                                <th className="px-4 py-2 font-semibold text-start">العنوان</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="text-center py-3">لا يوجد موردون لعرضهم</td>
                                </tr>
                            ) : (
                                data.slice(0, 4).map((row) => (
                                    <tr key={row.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-2">{row.name}</td>
                                        <td className="px-4 py-2">{row.phone1}</td>
                                        <td className="px-4 py-2">{row.address || '-'}</td>
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

export default SupplierTable