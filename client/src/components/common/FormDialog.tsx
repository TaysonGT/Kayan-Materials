import React from 'react'

interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'select' | 'multiselect' | 'checkbox' | 'date' | 'number'
  required?: boolean
  multiline?: boolean
  rows?: number
  placeholder?: string
  options?: Array<{ value: any; label: string, selected?:boolean }>
  value?: any
  selected?: any;
  readOnly?: boolean
  onChange?: (value: any) => void
}

interface FormDialogProps {
  open: boolean
  title: string
  fields: FormField[]
  formData: Record<string, any>
  onClose: () => void
  onSave: () => void
  onChange: (fieldName: string, value: any) => void
  isLoading?: boolean
}

const FormDialog: React.FC<FormDialogProps> = ({
  open,
  title,
  fields,
  formData,
  onClose,
  onSave,
  onChange,
  isLoading = false
}) => {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={onClose} />
          <div className="bg-white rounded shadow-lg max-w-lg w-full p-6 z-10">
            <div className="text-lg font-bold mb-4">{title}</div>
            <div className="grid gap-4">
              {fields.map((field) => {
                const value = field.value ?? formData[field.name] ?? ''
                if (field.type === 'number') {
                  return (
                    <input
                      key={field.name}
                      name={field.name}
                      type="number"
                      className="w-full border rounded px-3 py-2"
                      aria-readonly={field.readOnly}
                      required={field.required}
                      value={value}
                      onChange={(e) => onChange(field.name, e.target.value)}
                    />
                  )
                }

                if (field.type === 'select') {
                  return (
                    <select
                      key={field.name}
                      name={field.name}
                      className="w-full border rounded px-3 py-2"
                      value={value}
                      onChange={(e) => onChange(field.name, e.target.value)}
                      aria-readonly={field.readOnly}
                      required={field.required}
                    >
                      <option value="">{field.label}</option>
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  )
                }

                if (field.type === 'multiselect') {
                  return (
                    <select
                      key={field.name}
                      multiple
                      name={field.name}
                      className="w-full border rounded px-3 py-2"
                      value={formData[field.name] || []}
                      onChange={(e) => {
                        const opts = Array.from((e.target as HTMLSelectElement).selectedOptions).map(o => o.value)
                        onChange(field.name, opts)
                      }}
                      aria-readonly={field.readOnly}
                      required={field.required}
                    >
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  )
                }

                if (field.type === 'date') {
                  return (
                    <input
                      key={field.name}
                      name={field.name}
                      type="date"
                      className="w-full border rounded px-3 py-2"
                      aria-readonly={field.readOnly}
                      required={field.required}
                      value={value}
                      onChange={(e) => onChange(field.name, e.target.value)}
                    />
                  )
                }

                if (field.type === 'checkbox') {
                  return (
                    <label key={field.name} className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        name={field.name}
                        checked={!!value}
                        onChange={(e) => onChange(field.name, e.target.checked)}
                        required={field.required}
                        aria-readonly={field.readOnly}
                      />
                      <span>{field.label}</span>
                    </label>
                  )
                }

                return (
                  field.multiline ? (
                    <textarea
                      key={field.name}
                      name={field.name}
                      className="w-full border rounded px-3 py-2"
                      rows={field.rows || 3}
                      placeholder={field.placeholder}
                      value={value}
                      onChange={(e) => onChange(field.name, e.target.value)}
                      readOnly={field.readOnly}
                    />
                  ) : (
                    <input
                      key={field.name}
                      name={field.name}
                      type={field.type}
                      className="w-full border rounded px-3 py-2"
                      required={field.required}
                      placeholder={field.placeholder}
                      value={value}
                      onChange={(e) => onChange(field.name, e.target.value)}
                      readOnly={field.readOnly}
                    />
                  )
                )
              })}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={onClose} disabled={isLoading} className="px-4 py-2 border rounded">
                إلغاء
              </button>
              <button onClick={onSave} disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded">
                {isLoading ? 'جاري...' : 'حفظ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default FormDialog
