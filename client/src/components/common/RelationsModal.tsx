import React from 'react'
import { FiTrash2 } from 'react-icons/fi';

interface RelationsModalProps {
  id: string;
  open: boolean
  title: string
  entityName: string
  count: number
  items: any[]
  columns: Array<{
    field: string
    label: string
    render?: (value: any, row: any) => React.ReactNode
  }>
  onClose: () => void;
  onAdd: () => void;
  onDelete?: (id1: string) => void;
}

const RelationsModal: React.FC<RelationsModalProps> = ({
  open,
  title,
  entityName,
  count,
  items,
  columns,
  onClose,
  onAdd,
  onDelete
}) => {
  if (!items.length) {
    return (
      <>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/40" onClick={onClose} />
            <div className="bg-white rounded shadow-lg max-w-md w-full p-6 z-10">
              <div className="text-lg font-bold mb-2">{title}</div>
              <div className="py-4 text-center text-sm text-gray-600">لا توجد {entityName} مرتبطة</div>
              <div className="mt-4 flex justify-end gap-2">
                <button onClick={onClose} className="px-4 py-2 border rounded">إغلاق</button>
                <button onClick={onAdd} className="px-4 py-2 bg-blue-600 text-white rounded">إضافة {entityName}</button>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={onClose} />
          <div className="bg-white rounded shadow-lg max-w-4xl w-full p-6 z-10">
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg font-bold">{title}</div>
              <div className="px-3 py-1 border rounded text-sm">{count} {entityName}</div>
            </div>
            <div className="overflow-auto">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    {columns.map((col) => (
                      <th key={col.field} className="px-4 py-2 font-semibold text-center">{col.label}</th>
                    ))}
                    <th className="px-4 py-2 text-center">إزالة</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-gray-50">
                      {columns.map((col) => (
                        <td className="px-4 py-2 text-center" key={`${item.id}-${col.field}`}>{col.render ? col.render(item[col.field], item) : item[col.field]}</td>
                      ))}
                      <td className="px-4 py-2 text-center">
                        <button onClick={() => onDelete && onDelete(item.id)} className="p-1 text-red-600 hover:bg-gray-100 rounded" title="حذف">
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={onClose} className="px-4 py-2 border rounded">إغلاق</button>
              <button onClick={onAdd} className="px-4 py-2 bg-blue-600 text-white rounded">إضافة {entityName}</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default RelationsModal
