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
  unitPrice: number
  quantity: number
  status: TRANSACTION_STATUS
  invoice: Invoice;
  received_date: string
  total?: number
}

export interface Invoice {
  id: string;
  description: string;
  supplier: Supplier;
  paid: number;
  createdAt: Date;
  transactions: Transaction[]
  total?: number
  freight?:number
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
