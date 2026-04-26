import React from 'react'
import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material'

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
    <Box sx={{ mb: 3, display: 'flex', gap: '1rem' }}>
      {filters.map((filter)=>
            <FormControl key={filter.label} sx={{ minWidth: 200 }}>
            <InputLabel>{filter.label}</InputLabel>
            <Select
                value={filter.value||''}
                label={filter.label}
                onChange={(e) => filter.onChange(e.target.value)}
            >
                <MenuItem key={'all'} value={undefined}>
                    الكل
                </MenuItem>
                {filter.options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
            </FormControl>
        )}
    </Box>
  )
}

export default FiltersBar