import type { Supplier, Material, Invoice } from '../types'

export const mockSuppliers: Supplier[] = [
  {
    id: 1,
    name: 'تجارة الخليج',
    phone1: '+966501234567',
    phone2: '+966501234568',
    address: 'طريق الملك فهد، الرياض'
  },
  {
    id: 2,
    name: 'خليج المواد',
    phone1: '+966501234569',
    phone2: '+966501234570',
    address: 'شارع الكورنيش، جدة'
  },
  {
    id: 3,
    name: 'مستودعات الصحراء',
    phone1: '+966501234571',
    address: 'المنطقة الصناعية، الدمام'
  },
  {
    id: 4,
    name: 'مجموعة التجارة الشرقية',
    phone1: '+966501234572',
    phone2: '+966501234573',
    address: 'مدينة الأعمال، الرياض'
  }
]

export const mockMaterials: Material[] = [
  {
    id: 1,
    name: 'إسمنت بورتلاند',
    type: 'البناء',
    suppliers: [1],
    description: 'إسمنت عالي القوة'
  },
  {
    id: 2,
    name: 'حديد التسليح',
    type: 'الفولاذ',
    suppliers: [2],
    description: 'تعزيز البناء بالفولاذ'
  },
  {
    id: 3,
    name: 'رمل صحراوي',
    type: 'الركام',
    suppliers: [3],
    description: 'رمل للبناء'
  },
  {
    id: 4,
    name: 'حصى الحجر',
    type: 'الركام',
    suppliers: [4],
    description: 'حصى غليظة للأساسات'
  },
  {
    id: 5,
    name: 'صفائح الحديد',
    type: 'المعادن',
    suppliers: [1],
    description: 'صفائح الحديد مغطاة'
  }
]

export const mockInvoices: Invoice[] = [
  {
    id: 101,
    supplier: 1,
    material: 1,
    cost: 2275,
    delivered: true,
    date: '2026-04-08',
    notes: 'تم التسليم بالوقت المحدد'
  },
  {
    id: 102,
    supplier: 2,
    material: 2,
    cost: 1275,
    delivered: false,
    date: '2026-04-09',
    notes: 'بانتظار التسليم'
  },
  {
    id: 103,
    supplier: 3,
    material: 3,
    cost: 1650,
    delivered: true,
    date: '2026-04-07',
    notes: 'تم الاستلام كاملاً'
  },
  {
    id: 104,
    supplier: 4,
    material: 4,
    cost: 1425,
    delivered: false,
    date: '2026-04-06',
    notes: 'قيد المعالجة'
  },
  {
    id: 105,
    supplier: 1,
    material: 5,
    cost: 660,
    delivered: false,
    date: '2026-04-10',
    notes: 'معالجة الشحنة'
  }
]
