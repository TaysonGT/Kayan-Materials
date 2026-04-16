import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel
} from '@mui/material'

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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2, pt: 0.75 }}>
          {fields.map((field) => {
            if (field.type === 'number') {
              return (
                <TextField
                  key={field.name}
                  name={field.name}
                  label={field.label}
                  type="number"
                  fullWidth
                  required={field.required}
                  value={formData[field.name] || ''}
                  onChange={(e) => onChange(field.name, e.target.value)}
                />
              )
            }
            if (field.type === 'select') {
              return (
                <FormControl key={field.name} fullWidth>
                  <InputLabel>{field.label}</InputLabel>
                  <Select
                    name={field.name}
                    label={field.label}
                    defaultValue={field.value || formData[field.name] ||  ''}
                    onChange={(e) => onChange(field.name, e.target.value)}
                    required={field.required}
                  >
                    {field.options?.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )
            }

            if (field.type === 'multiselect') {
              return (
                <FormControl key={field.name} fullWidth>
                  <InputLabel>{field.label}</InputLabel>
                  <Select
                    multiple
                    name={field.name}
                    label={field.label}
                    value={formData[field.name] || []}
                    onChange={(e) => onChange(field.name, e.target.value)}
                    required={field.required}
                  >
                    {field.options?.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )
            }

            if (field.type === 'date') {
              return (
                <TextField
                  key={field.name}
                  name={field.name}
                  label={field.label}
                  type="date"
                  fullWidth
                  required={field.required}
                  value={formData[field.name] || formData.value}
                  onChange={(e) => onChange(field.name, e.target.value)}
                />
              )
            }

            if (field.type === 'checkbox') {
              return (
                <FormControlLabel 
                control={
                  <Checkbox
                    name={field.name}
                    value={formData[field.name] || formData.value || []}
                    onChange={(e) => onChange(field.name, e.target.checked)}
                    required={field.required}
                  />
                }
                label={field.label}
                />
              )
            }

            return (
              <TextField
                key={field.name}
                name={field.name}
                label={field.label}
                type={field.type}
                fullWidth
                required={field.required}
                multiline={field.multiline}
                rows={field.rows || 1}
                placeholder={field.placeholder}
                value={formData[field.name] || ''}
                onChange={(e) => onChange(field.name, e.target.value)}
              />
            )
          })}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          إلغاء
        </Button>
        <Button onClick={onSave} variant="contained" disabled={isLoading}>
          {isLoading ? 'جاري...' : 'حفظ'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default FormDialog
