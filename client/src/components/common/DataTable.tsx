import React from 'react'
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

  if (rows.length < 1) {
    return (
      <div className="p-6 text-center border border-[#e8e8e8] rounded-sm shadow-sm bg-white">
        <div className="text-sm text-gray-500">{emptyMessage}</div>
      </div>
    )
  }

  return (
    <div className="overflow-auto border border-[#e8e8e8] bg-white rounded-sm shadow-md">
      <table className="min-w-full">
        <thead className="bg-[#797979] text-white">
          <tr>
            {columns.map((col) => (
              <th
                key={col.field}
                className={`px-4 py-2 font-semibold ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-start'}`}
              >
                {col.label}
              </th>
            ))}
            {withAcitons && (
              <th className="px-4 py-2 font-semibold text-center">الإجراءات</th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, rowsPerPage).map((row, idx) => (
            <tr key={row.id || idx} className="hover:bg-gray-50">
              {columns.map((col) => (
                <td key={`${row.id}-${col.field}`} className={`px-4 py-2 align-top ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-start'}`}>
                  {col.render ? col.render(row[col.field], row) : row[col.field]}
                </td>
              ))}
              {withAcitons && (
                <td className="px-4 py-2 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {onEdit && (
                      <button title="تعديل" onClick={() => onEdit(row)} className="p-1 text-blue-600 hover:bg-gray-100 rounded">
                        <FiEdit />
                      </button>
                    )}
                    {onDelete && (
                      <button title="حذف" onClick={() => onDelete(row)} className="p-1 text-red-600 hover:bg-gray-100 rounded">
                        <FiTrash2 />
                      </button>
                    )}
                    {onPreview && (
                      <button title="عرض" onClick={() => onPreview(row)} className="p-1 text-gray-900 hover:bg-gray-100 rounded">
                        <FiEye />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable
