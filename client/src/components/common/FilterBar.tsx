import React from 'react'

interface FilterOption {
  value: string
  label: string
}

interface FilterBarProps {
  label: string
  value: string
  options: FilterOption[]
  onChange: (value: string) => void
}

const FilterBar: React.FC<FilterBarProps> = ({ label, value, options, onChange }) => {
  return (
    <div className="mb-3">
      <label className="block text-sm mb-1">{label}</label>
      <select className="min-w-[200px] border rounded px-3 py-2" value={value} onChange={(e)=>onChange(e.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  )
}

export default FilterBar
