import { useState } from 'react'
import { Container, IconButton } from '@mui/material'
import { FiEye } from 'react-icons/fi'
import { useSuppliers } from '../../hooks/useSuppliers'
import { PageHeader, FormDialog, DataTable } from '../../components/common'
import type { Supplier } from '../../types'
import { PAGE_HEADERS, VALIDATION_MESSAGES, DIALOG_TITLES } from '../../utils/constants'
import AddMaterialToSupplierDialogue from './AddMaterialToSupplierDialogue'
import NavigationControl from '../../components/ui/NavigationControl'
import SupplierMaterialsTable from './SupplierMaterialsTable'

const SuppliersPage = () => {
  const { suppliers, loading, pagination, maxPages, modifyPagination, addSupplier, updateSupplier, removeSupplier, refetchSuppliers } = useSuppliers()
  const [openDialog, setOpenDialog] = useState(false)
  const [showAddMaterialToSupplierDialog, setShowAddMaterialToSupplierDialog] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [formData, setFormData] = useState<Omit<Supplier, 'id'>>({
    name: '',
    phone1: '',
    phone2: '',
    address: ''
  })

  const handleOpenDialog = (supplier?: Supplier) => {
    if (supplier) {
      setFormData(supplier)
      setEditingId(supplier.id)
    } else {
      setFormData({
        name: '',
        phone1: '',
        phone2: '',
        address: ''
      })
      setEditingId(null)
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingId(null)
  }

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert(VALIDATION_MESSAGES.supplier)
      return
    }

    if (editingId) {
      updateSupplier(editingId, formData)
    } else {
      addSupplier(formData)
    }
    handleCloseDialog()
  }

  const handleDelete = (supplier: Supplier) => {
    if (window.confirm(VALIDATION_MESSAGES.deleteConfirm('هذا المورد'))) {
      removeSupplier(supplier.id)
    }
  }

  const handlePreview = (supplier: Supplier) => {
    setSelectedSupplier(supplier)
    setPreviewModalOpen(true)
  }

  const handleClosePreview = () => {
    setPreviewModalOpen(false)
    setSelectedSupplier(null)
  }

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData({ ...formData, [fieldName]: value })
  }

  const tableColumns = [
    { field: 'name', label: 'الاسم', align: 'center' as const },
    { field: 'phone1', label: 'الهاتف الأول', align: 'center' as const },
    {
      field: 'phone2',
      label: 'الهاتف الثاني',
      render: (value: any) => value || '-',
      align: 'center' as const
    },
    {
      field: 'address',
      label: 'العنوان',
      render: (value: any) => value || '-',
      align: 'center' as const
    },
    {
      field: 'materials_count',
      label: 'المواد المزودة',
      render: (_: any, row: Supplier) => {
        const suppliersCount = row.materials?.length || 0
        return (
          <IconButton
            size="small"
            onClick={() => handlePreview(row)}
            sx={{ color: '#7b1fa2', gap: '0.5rem'}}
            title={`عرض ${suppliersCount} مورد`}
            >
            <FiEye />
            <p className='text-xs'>{`${suppliersCount||'0'} خامات`}</p>
          </IconButton>
        )
      },
      align: 'center' as const
    }
  ]

  const formFields = [
    { name: 'name', label: 'الاسم', type: 'text' as const, required: true },
    { name: 'phone1', label: 'الهاتف الأول', type: 'tel' as const },
    { name: 'phone2', label: 'الهاتف الثاني', type: 'tel' as const },
    { name: 'address', label: 'العنوان', type: 'text' as const, multiline: true, rows: 2 }
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <PageHeader
        title={PAGE_HEADERS.suppliers.title}
        subtitle={PAGE_HEADERS.suppliers.subtitle}
        buttonText={PAGE_HEADERS.suppliers.buttonText}
        onAddClick={() => handleOpenDialog()}
      />

      <DataTable
        columns={tableColumns}
        rows={suppliers}
        onEdit={handleOpenDialog}
        onDelete={handleDelete}
        loading={loading}
      />

      <FormDialog
        open={openDialog}
        title={editingId ? DIALOG_TITLES.supplier.edit : DIALOG_TITLES.supplier.add}
        fields={formFields}
        formData={formData}
        onClose={handleCloseDialog}
        onSave={handleSave}
        onChange={handleFieldChange}
      />

      <NavigationControl
        pageCount={pagination.page}
        maxPages={maxPages}
        modifyPagination={modifyPagination}
      />

      <AddMaterialToSupplierDialogue
        open={showAddMaterialToSupplierDialog} 
        supplierId={selectedSupplier?.id||''} 
        onSave={async()=>{
          setShowAddMaterialToSupplierDialog(false);
          await refetchSuppliers();
          setSelectedSupplier(prev => {
            if (!prev) return prev
            return {
              ...prev,
              materials: [...(suppliers.find(s => s.id === prev.id)?.materials||[])]
            }
          })
        }}
        onClose={()=>setShowAddMaterialToSupplierDialog(false)}
      />

      <SupplierMaterialsTable
        show={previewModalOpen}
        supplier={selectedSupplier}
        hide={handleClosePreview}
        onAdd={()=>{
          setShowAddMaterialToSupplierDialog(true)
          setPreviewModalOpen(false)
        }}
      />
      
    </Container>
  )
}

export default SuppliersPage
