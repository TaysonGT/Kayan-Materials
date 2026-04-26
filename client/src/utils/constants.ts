// Filter Options
export const DELIVERY_FILTER_OPTIONS = [
  { value: 'received', label: 'مسلمة' },
  { value: 'pending', label: 'معلقة' }
]

export const STATUS_LABELS: Record<string, string> = {
  'true': 'مسلم',
  'false': 'معلق'
}

export const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  'true': { bg: '#e8f5e9', text: '#388e3c' },
  'false': { bg: '#fff3e0', text: '#f57c00' }
}

// Dialog Titles
export const DIALOG_TITLES = {
  supplier: {
    add: 'إضافة مورد جديد',
    edit: 'تعديل المورد',
    addMaterial: 'إضافة خام'
  },
  material: {
    add: 'إضافة مادة جديدة',
    edit: 'تعديل المادة',
    addSupplier: 'إضافة مورد'
  },
  transaction: {
    add: 'إنشاء حركة جديدة',
    edit: 'تعديل الحركة'
  },
  invoice: {
    add: 'إنشاء فاتورة جديدة',
    edit: 'تعديل الفاتورة'
  },
  
}

// Validation Messages
export const VALIDATION_MESSAGES = {
  supplier: 'يرجى ملء اسم المورد',
  material: 'يرجى ملء اسم المادة والنوع',
  transaction: 'يرجى ملء جميع الحقول بقيم صحيحة',
  deleteConfirm: (entity: string) => `هل أنت متأكد من حذف ${entity}؟`
}

// Page Headers
export const PAGE_HEADERS = {
  suppliers: {
    title: 'إدارة الموردين',
    subtitle: 'إدارة جميع الموردين ومعلوماتهم وتفاصيلهم',
    buttonText: 'إضافة مورد'
  },
  materials: {
    title: 'إدارة المواد',
    subtitle: 'إدارة جميع المواد والموردين المرتبطين بها',
    buttonText: 'إضافة مادة'
  },
  transactions: {
    title: 'إدارة الحركات',
    subtitle: 'تتبع وإدارة جميع الحركات من الموردين والمواد',
    buttonText: 'إنشاء حركة'
  },
  invoices: {
    title: 'إدارة الفواتير',
    subtitle: 'تتبع وإدارة جميع الفواتير',
    buttonText: 'إنشاء فاتورة'
  }
}
