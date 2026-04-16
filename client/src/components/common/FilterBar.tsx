import React from 'react'
import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material'

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
    <Box sx={{ mb: 3 }}>
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>{label}</InputLabel>
        <Select
          value={value}
          label={label}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}

export default FilterBar
