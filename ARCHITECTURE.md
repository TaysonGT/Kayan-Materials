# Project Code Refactoring - Architecture Guide

## Overview
The client application has been refactored to follow modern best practices with a modular, extensible architecture that promotes code reusability, maintainability, and readability.

## Directory Structure

```
client/src/
├── components/
│   └── common/                 # Shared reusable components
│       ├── DataTable.tsx       # Generic table component
│       ├── FormDialog.tsx      # Reusable form dialog
│       ├── FilterBar.tsx       # Filter component
│       ├── PageHeader.tsx      # Page header component
│       ├── StatsCard.tsx       # Stats display card
│       └── index.ts            # Barrel export
│
├── hooks/                      # Custom React hooks
│   ├── useSuppliers.ts         # Supplier state management
│   ├── useMaterials.ts         # Material state management
│   └── useInvoices.ts          # Invoice state management
│
├── types/
│   └── index.ts                # TypeScript interfaces & types
│
├── utils/
│   ├── mockData.ts             # Mock data for development
│   ├── constants.ts            # App constants & configurations
│   └── helpers.ts              # Utility functions
│
├── pages/
│   ├── Distributors/           # Suppliers management page
│   ├── Materials/              # Materials management page
│   ├── Invoices/               # Invoices management page
│   └── Home/                   # Dashboard
│
├── App.tsx
└── main.tsx
```

## Core Modules

### 1. **Types** (`types/index.ts`)
Centralized TypeScript interfaces and type definitions:
- `Supplier` - Supplier entity
- `Material` - Material entity
- `Invoice` - Invoice entity
- Filter and UI-specific types

### 2. **Mock Data** (`utils/mockData.ts`)
Centralized mock data for development:
- `mockSuppliers` - Pre-defined supplier data
- `mockMaterials` - Pre-defined material data
- `mockInvoices` - Pre-defined invoice data

### 3. **Constants** (`utils/constants.ts`)
Application-wide constants:
- Material types list
- Filter options
- Dialog titles
- Validation messages
- Page headers configuration

### 4. **Helpers** (`utils/helpers.ts`)
Utility functions for common operations:
- `getSupplierName(id)` - Lookup supplier by ID
- `getMaterialName(id)` - Lookup material by ID
- `getSupplierNames(ids)` - Multiple supplier lookup
- `generateNextId(items)` - Generate next ID
- `formatCurrency(amount)` - Currency formatting
- Validation helpers

### 5. **Custom Hooks** (`hooks/`)

#### `useSuppliers.ts`
```typescript
const { suppliers, addSupplier, updateSupplier, deleteSupplier, getSupplierById, getNextId } = useSuppliers()
```

#### `useMaterials.ts`
```typescript
const { materials, addMaterial, updateMaterial, deleteMaterial, getMaterialById, getNextId } = useMaterials()
```

#### `useInvoices.ts`
```typescript
const { 
  invoices, 
  deliveryFilter, 
  setDeliveryFilter,
  addInvoice, 
  updateInvoice, 
  deleteInvoice,
  getFilteredInvoices,
  getTotalRevenue,
  getPendingAmount
} = useInvoices()
```

### 6. **Common Components** (`components/common/`)

#### `DataTable.tsx`
Generic table component for displaying entity data:
```typescript
<DataTable
  columns={columns}
  rows={data}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

#### `FormDialog.tsx`
Reusable form dialog for creating/editing entries:
```typescript
<FormDialog
  open={isOpen}
  title="Add New Item"
  fields={formFields}
  formData={data}
  onClose={handleClose}
  onSave={handleSave}
  onChange={handleChange}
/>
```

#### `FilterBar.tsx`
Reusable filter component:
```typescript
<FilterBar
  label="Filter by Type"
  value={selectedFilter}
  options={filterOptions}
  onChange={handleFilterChange}
/>
```

#### `PageHeader.tsx`
Consistent page header with navigation:
```typescript
<PageHeader
  title="Page Title"
  subtitle="Page Description"
  buttonText="Add New"
  onAddClick={handleAdd}
/>
```

#### `StatsCard.tsx`
Stats display card:
```typescript
<StatsCard
  value={123}
  label="Total Items"
  backgroundColor="#e8f5e9"
  textColor="#388e3c"
  captionColor="#2e7d32"
/>
```

## Page Architecture

Each page (`Distributors`, `Materials`, `Invoices`, `Home`) now follows this pattern:

1. **Import hooks** for state management
2. **Use custom hooks** instead of useState/local state
3. **Use shared components** (PageHeader, DataTable, FormDialog, etc.)
4. **Use utilities** (constants, helpers, mock data)
5. **Minimal local logic** - focus on use case specific behavior

### Example: Suppliers Page
```typescript
import { useSuppliers } from '../../hooks/useSuppliers'
import { PageHeader, FormDialog, DataTable } from '../../components/common'
import { PAGE_HEADERS, DIALOG_TITLES, VALIDATION_MESSAGES } from '../../utils/constants'

const SuppliersPage = () => {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useSuppliers()
  
  // Use shared components
  return (
    <Container>
      <PageHeader {...PAGE_HEADERS.suppliers} />
      <DataTable columns={columns} rows={suppliers} />
      <FormDialog fields={fields} /> 
    </Container>
  )
}
```

## Benefits

### 1. **Reusability**
- Components used across multiple pages
- Utility functions shared everywhere
- Consistent UI through common components

### 2. **Maintainability**
- Changes to shared code benefit entire app
- Single source of truth for constants
- Clear separation of concerns

### 3. **Readability**
- Less code duplication
- Clear naming conventions
- Organized file structure

### 4. **Scalability**
- Easy to add new pages (use existing components)
- Easy to extend (add new hooks, utilities)
- Consistent patterns throughout

### 5. **Testability**
- Isolated hook logic
- Reusable components easy to test
- Pure utility functions

## Adding New Features

### Add a new page:
1. Create page component in `pages/`
2. Use custom hooks for state management
3. Import shared components from `components/common/`
4. Use constants from `utils/constants.ts`

### Add a new shared component:
1. Create component in `components/common/`
2. Add to barrel export `index.ts`
3. Use in pages

### Add a new utility:
1. Add function to `utils/helpers.ts`
2. Import and use across app

## Data Flow

```
Pages
  ├── Import custom hooks (useSuppliers, useMaterials, etc.)
  ├── Import shared components (DataTable, FormDialog, etc.)
  └── Import utilities (constants, helpers)
       ↓
    Hooks
      ├── Manage state (useState with mock data)
      ├── Provide CRUD operations
      └── Derive computed values
           ↓
      Utils
        ├── Constants (config values)
        ├── Helpers (calculations, lookups)
        └── Mock Data (initial state)
```

## Best Practices Applied

✅ **Single Responsibility** - Each file/component has one clear purpose
✅ **DRY (Don't Repeat Yourself)** - Shared code in utilities and components
✅ **Component Composition** - Small, reusable components
✅ **Naming Conventions** - Clear, descriptive names
✅ **Separation of Concerns** - UI, logic, data separated
✅ **Barrel Exports** - Simplified imports
✅ **Type Safety** - Full TypeScript coverage
✅ **Documentation** - Comments on complex logic

## Future Enhancements

1. **API Integration** - Replace mock data with API calls
2. **Form Validation** - Add advanced validation library
3. **State Management** - Consider Redux/Zustand for complex state
4. **Error Handling** - Add error boundaries
5. **Loading States** - Add loading indicators
6. **Caching** - Cache API responses
7. **Pagination** - Add table pagination
8. **Export/Import** - Add data export/import features
