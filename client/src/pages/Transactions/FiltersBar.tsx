import React from 'react'

interface FilterOption {
  value?: string
  label: string
}

export interface FilterProps{
    label: string
    value?: string|boolean
    options: FilterOption[]
    onChange: (value?: string|boolean) => void
}

interface FiltersBarProps {
  filters: FilterProps[]
}
const FiltersBar:React.FC<FiltersBarProps> = ({filters}) => {
  return (
    <div className="mb-3 flex gap-4">
      {filters.map((filter) => (
        <div key={filter.label} className="min-w-[200px]">
          <label className="block text-sm mb-1">{filter.label}</label>
          <select className="w-full border rounded px-3 py-2 bg-white" value={filter.value as any || ''} onChange={(e)=>filter.onChange(e.target.value)}>
            <option value={""}>{'الكل'}</option>
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  )
}

export default FiltersBar
