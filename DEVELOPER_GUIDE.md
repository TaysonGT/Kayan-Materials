# Developer Guide - Working with the New Architecture

## Quick Start for Developers

This guide explains how to work with the refactored codebase effectively.

## Understanding the Architecture

### Three-Layer Architecture

```
UI Layer (Pages)
    ↓ (imports)
Logic Layer (Hooks + Components)
    ↓ (imports)
Data Layer (Utils + Types)
```

**Page** = UI presentation layer
**Hook** = Business logic & state management
**Utils** = Data manipulation & configuration
**Types** = Type definitions

## Working with Each Layer

### 1. DATA LAYER - (`types/`, `utils/`)

**When to use:**
- Defining new entity types
- Adding helper functions
- Adding application constants
- Managing mock data

**Example: Adding a new entity type**
```typescript
// types/index.ts
export interface Department {
  id: number
  name: string
  manager?: string
}
```

**Example: Adding a helper function**
```typescript
// utils/helpers.ts
export const getDepartmentName = (id: number, departments: Department[]): string => {
  return departments.find(d => d.id === id)?.name || ''
}
```

**Example: Adding constants**
```typescript
// utils/constants.ts
export const DEPARTMENT_TYPES = ['IT', 'HR', 'Finance', 'Operations']
```

### 2. LOGIC LAYER - (`hooks/`, `components/common/`)

#### Custom Hooks

**When to create a new hook:**
- When you have repeating state logic
- When multiple pages need same functionality
- When logic needs to be testable

**Template for new hook:**
```typescript
// hooks/useDepartments.ts
import { useState } from 'react'
import { Department } from '../types'
import { mockDepartments } from '../utils/mockData'

export const useDepartments = () => {
  const [departments, setDepartments] = useState<Department[]>(mockDepartments)

  const addDepartment = (dept: Department) => {
    setDepartments([...departments, dept])
  }

  const updateDepartment = (id: number, dept: Department) => {
    setDepartments(departments.map(d => d.id === id ? dept : d))
  }

  const deleteDepartment = (id: number) => {
    setDepartments(departments.filter(d => d.id !== id))
  }

  return {
    departments,
    addDepartment,
    updateDepartment,
    deleteDepartment
  }
}
```

#### Reusable Components

**When to create a shared component:**
- Styling repeated across pages
- UI pattern used in multiple places
- Component with configurable behavior

**Template for new component:**
```typescript
// components/common/ActionButtons.tsx
import React from 'react'
import { Box, IconButton } from '@mui/material'
import { FiEdit, FiTrash2 } from 'react-icons/fi'

interface ActionButtonsProps {
  onEdit: () => void
  onDelete: () => void
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onEdit, onDelete }) => {
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <IconButton size="small" onClick={onEdit} sx={{ color: '#1976d2' }}>
        <FiEdit />
      </IconButton>
      <IconButton size="small" onClick={onDelete} sx={{ color: '#d32f2f' }}>
        <FiTrash2 />
      </IconButton>
    </Box>
  )
}

export default ActionButtons
```

**Add to barrel export:**
```typescript
// components/common/index.ts
export { default as ActionButtons } from './ActionButtons'
```

### 3. UI LAYER - (`pages/`)

**What pages contain:**
- Router logic
- Page-specific layout
- UI composition
- Event handlers

**Page template:**
```typescript
// pages/Departments/index.tsx
import React, { useState } from 'react'
import { Container } from '@mui/material'
import { useDepartments } from '../../hooks/useDepartments'
import { PageHeader, FormDialog, DataTable } from '../../components/common'
import { Department } from '../../types'
import { DIALOG_TITLES } from '../../utils/constants'

const DepartmentsPage = () => {
  // 1. Get state and operations from hook
  const { departments, addDepartment, updateDepartment, deleteDepartment, getNextId } = useDepartments()

  // 2. Local UI state only
  const [openDialog, setOpenDialog] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<Department>({ id: 0, name: '' })

  // 3. Handler functions
  const handleOpenDialog = (dept?: Department) => {
    if (dept) {
      setFormData(dept)
      setEditingId(dept.id)
    } else {
      setFormData({ id: getNextId(), name: '' })
      setEditingId(null)
    }
    setOpenDialog(true)
  }

  const handleSave = () => {
    if (editingId) {
      updateDepartment(editingId, formData)
    } else {
      addDepartment(formData)
    }
    setOpenDialog(false)
  }

  // 4. Table configuration
  const tableColumns = [
    { field: 'name', label: 'الاسم' }
  ]

  // 5. Form configuration
  const formFields = [
    { name: 'name', label: 'الاسم', type: 'text' as const, required: true }
  ]

  // 6. Render with shared components
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <PageHeader
        title="إدارة الأقسام"
        subtitle="إدارة الأقسام"
        buttonText="إضافة قسم"
        onAddClick={() => handleOpenDialog()}
      />

      <DataTable
        columns={tableColumns}
        rows={departments}
        onEdit={handleOpenDialog}
        onDelete={(dept) => deleteDepartment(dept.id)}
      />

      <FormDialog
        open={openDialog}
        title={editingId ? 'تعديل القسم' : 'إضافة قسم جديد'}
        fields={formFields}
        formData={formData}
        onClose={() => setOpenDialog(false)}
        onSave={handleSave}
        onChange={(field, value) => setFormData({ ...formData, [field]: value })}
      />
    </Container>
  )
}

export default DepartmentsPage
```

## Common Tasks

### Task 1: Create a New Page

1. **Create types** (if needed):
```typescript
// types/index.ts - add new interface
export interface YourEntity { ... }
```

2. **Create mock data** (if needed):
```typescript
// utils/mockData.ts - add mock array
export const mockYourEntity = [ ... ]
```

3. **Create constants** (if needed):
```typescript
// utils/constants.ts - add constants
export const YOUR_TYPES = [ ... ]
```

4. **Create custom hook**:
```typescript
// hooks/useYourEntity.ts
export const useYourEntity = () => {
  // State management logic
}
```

5. **Create page component**:
```typescript
// pages/YourEntity/index.tsx
import { useYourEntity } from '../../hooks/useYourEntity'
import { PageHeader, DataTable, FormDialog } from '../../components/common'

const YourEntityPage = () => {
  const { items, add, update, delete: remove } = useYourEntity()
  // Page logic...
}
```

6. **Add to router**:
```typescript
// routes/PublicRoutes.tsx
import YourEntityPage from '../pages/YourEntity'
// Add route...
```

### Task 2: Customize DataTable

```typescript
// More complex column with custom rendering
const tableColumns = [
  { 
    field: 'name', 
    label: 'الاسم' 
  },
  { 
    field: 'amount',
    label: 'المبلغ',
    align: 'right' as const,
    render: (value: number) => `$${value.toFixed(2)}`
  },
  {
    field: 'status',
    label: 'الحالة',
    render: (value: string) => (
      <Chip label={value} color={value === 'active' ? 'success' : 'warning'} />
    )
  }
]
```

### Task 3: Create Conditional Rendering

```typescript
// Render different UI based on state
const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')

return (
  <>
    <ModeToggle onToggle={setViewMode} />
    {viewMode === 'table' ? (
      <DataTable {...props} />
    ) : (
      <GridView {...props} />
    )}
  </>
)
```

### Task 4: Add Filter Options

```typescript
// utils/constants.ts
export const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'جميع' },
  { value: 'active', label: 'نشط' },
  { value: 'inactive', label: 'غير نشط' }
]

// In page
const [statusFilter, setStatusFilter] = useState('all')

const filtered = items.filter(i => 
  statusFilter === 'all' ? true : i.status === statusFilter
)

// Render
<FilterBar
  label="تصفية الحالة"
  value={statusFilter}
  options={STATUS_FILTER_OPTIONS}
  onChange={setStatusFilter}
/>
```

### Task 5: Add Export Function

```typescript
// utils/helpers.ts
export const exportToCSV = (data: any[], filename: string) => {
  const csv = data.map(row => Object.values(row).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
}

// In page
const handleExport = () => {
  exportToCSV(departments, 'departments.csv')
}
```

## Import Patterns

### Import from common components
```typescript
import { PageHeader, DataTable, FormDialog, FilterBar, StatsCard } from '../../components/common'
```

### Import from hooks
```typescript
import { useSuppliers } from '../../hooks/useSuppliers'
import { useMaterials } from '../../hooks/useMaterials'
```

### Import from utils
```typescript
import { PAGE_HEADERS, VALIDATION_MESSAGES } from '../../utils/constants'
import { getSupplierName, formatCurrency } from '../../utils/helpers'
import { mockSuppliers } from '../../utils/mockData'
```

### Import types
```typescript
import { Supplier, Material, Invoice } from '../../types'
```

## Testing Hooks

Hooks are easily testable:

```typescript
// Example test for useSuppliers hook
test('useSuppliers adds supplier', () => {
  const { result } = renderHook(() => useSuppliers())
  
  act(() => {
    result.current.addSupplier({ id: 5, name: 'New Supplier' })
  })
  
  expect(result.current.suppliers.length).toBe(5) // 4 initial + 1 new
  expect(result.current.suppliers[4].name).toBe('New Supplier')
})
```

## Performance Tips

1. **Use memo for components:**
```typescript
import { memo } from 'react'
export const DataTable = memo(({ columns, rows, ... }) => {
  // Component...
})
```

2. **Avoid unnecessary re-renders:**
```typescript
// Good - callbacks outside render
const handleEdit = useCallback((row) => {
  // Handle edit
}, [dependencies])

<DataTable onEdit={handleEdit} />
```

3. **Use useMemo for expensive calculations:**
```typescript
const totalCosts = useMemo(() => 
  invoices.reduce((sum, inv) => sum + inv.cost, 0),
  [invoices]
)
```

## Debugging

### Check Hook State
```typescript
const { items } = useYourEntity()
console.log('Items:', items) // See current state
```

### Verify Props
```typescript
const DataTable = ({ columns, rows, ... }: DataTableProps) => {
  console.log('Columns:', columns)
  console.log('Rows:', rows)
  // Component...
}
```

### Use React DevTools
- Install React DevTools browser extension
- Inspect component hierarchy
- Check props and state in real-time

## Common Patterns

### Pattern: Search + Filter
```typescript
const [search, setSearch] = useState('')
const [filter, setFilter] = useState('all')

const filtered = items
  .filter(i => filter === 'all' ? true : i.type === filter)
  .filter(i => i.name.includes(search))
```

### Pattern: Pagination
```typescript
const [page, setPage] = useState(1)
const itemsPerPage = 10
const paginatedItems = items.slice(
  (page - 1) * itemsPerPage,
  page * itemsPerPage
)
```

### Pattern: Sort
```typescript
const [sortBy, setSortBy] = useState('name')
const sorted = [...items].sort((a, b) => 
  a[sortBy] > b[sortBy] ? 1 : -1
)
```

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Material-UI Documentation](https://mui.com)
- [React Hooks Documentation](https://react.dev/reference/react)

## Getting Help

If you need to add a new feature:
1. Identify which layer it belongs to (data/logic/ui)
2. Check existing patterns in similar files
3. Follow the templates provided above
4. Test in browser before committing
