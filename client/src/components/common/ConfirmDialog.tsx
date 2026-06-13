import React from 'react'

interface Props{
    open: boolean;
    title: string
    content: string
    type?: 'save' | 'delete'
    onConfirm: ()=>void
    onCancel: ()=>void
}

const ConfirmDialog:React.FC<Props> = ({open, onConfirm, onCancel, title, content, type}) => {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={onCancel} />
          <div className="bg-white rounded shadow-lg max-w-sm w-full p-6 z-10">
            <div className="text-lg font-bold mb-2">{title}</div>
            <div className="text-sm text-gray-700">{content}</div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={onCancel} className="px-4 py-2 border rounded">إلغاء</button>
              <button onClick={onConfirm} className={`px-4 py-2 rounded text-white ${type === 'save' ? 'bg-blue-600' : 'bg-red-600'}`}>
                {type === 'save' ? 'حفظ' : 'حذف'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ConfirmDialog