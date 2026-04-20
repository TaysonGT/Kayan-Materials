// Entity Types
export interface Supplier {
  id: string
  name: string
  phone1?: string
  phone2?: string
  address?: string
  materials?: Material[]
}

export interface Material {
  id: string
  name: string
  description?: string
  suppliers?: Supplier[]
}

export interface Transaction {
  id: string
  material: Material
  supplier: Supplier
  materialId: string
  supplierId: string
  unitPrice: number
  quantity: number
  type: 'freight' | 'material'
  status: TRANSACTION_STATUS
  date: string
  total?: number
}

// Common Types
export type FilterOption = 'all' | string
export type TRANSACTION_STATUS = 'pending'|'received'

export interface TableColumn {
  field: string
  label: string
  align?: 'left' | 'center' | 'right'
  width?: string
}

export interface StatsCardProps {
  title: string
  value: string | number
  backgroundColor: string
  textColor: string
  captionColor: string
}
