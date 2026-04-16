import { useState } from 'react'
import { Container, IconButton } from '@mui/material'
import { FiEye } from 'react-icons/fi'
import { useMaterials } from '../../hooks/useMaterials'
import { PageHeader, FormDialog, DataTable } from '../../components/common'
import type { Material } from '../../types'
import { PAGE_HEADERS, VALIDATION_MESSAGES, DIALOG_TITLES } from '../../utils/constants'
import AddSupplierToMaterialDialogue from './AddSupplierToMaterialDialogue'
import NavigationControl from '../../components/ui/NavigationControl'
import MaterialSuppliersTable from './MaterialSuppliersTable'

const MaterialsPage = () => {
  const { materials, pagination, modifyPagination, maxPages, addMaterial, updateMaterial, removeMaterial, refetchMaterials } = useMaterials()
  const [openDialog, setOpenDialog] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [showAddSupplierToMaterialDialog, setShowAddSupplierToMaterialDialog] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)
  const [formData, setFormData] = useState<Omit<Material,'id'>>({
    name: '',
    description: ''
  })

  const handleOpenDialog = (material?: Material) => {
    if (material) {
      setFormData(material)
      setEditingId(material.id)
    } else {
      setFormData({
        name: '',
        description: ''
      })
      setEditingId(null)
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingId(null)
  }

  const handleSave = async() => {
    if (!formData.name.trim()) {
      alert(VALIDATION_MESSAGES.material)
      return
    }

    if (editingId) {
      await updateMaterial(editingId, formData)
    } else {
      await addMaterial(formData)
    }
    await refetchMaterials()
    handleCloseDialog()
  }

  const handleDelete = (material: Material) => {
    if (window.confirm(VALIDATION_MESSAGES.deleteConfirm('هذه المادة'))) {
      removeMaterial(material.id)
    }
  }

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData({ ...formData, [fieldName]: value })
  }

  const handlePreview = (material: Material) => {
    setSelectedMaterial(material)
    setPreviewModalOpen(true)
  }

  const handleClosePreview = () => {
    setPreviewModalOpen(false)
    setSelectedMaterial(null)
  }

  const tableColumns = [
    { field: 'name', label: 'الاسم', align: 'center' as const },
    {
      field: 'description',
      label: 'الوصف',
      render: (value: any) => value ? (value.length > 30 ? value.substring(0, 30) + '...' : value) : '-',
      align: 'center' as const
    },
    {
      field: 'suppliers_preview',
      label: 'عرض الموردون',
      render: (_: any, row: Material) => {
        const suppliersCount = row.suppliers?.length || 0
        return (
          <IconButton
            size="small"
            onClick={() => handlePreview(row)}
            sx={{ color: '#7b1fa2', gap: '0.5rem'}}
            title={`عرض ${suppliersCount} مورد`}
            >
            <FiEye />
            <p className='text-xs'>{`${suppliersCount||'0'} مورد`}</p>
          </IconButton>
        )
      },
      align: 'center' as const
    }
  ]

  const formFields = [
    { name: 'name', label: 'اسم المادة', type: 'text' as const, required: true },
    {
      name: 'description',
      label: 'الوصف',
      type: 'text' as const,
      multiline: true,
      rows: 3
    }
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <PageHeader
        title={PAGE_HEADERS.materials.title}
        subtitle={PAGE_HEADERS.materials.subtitle}
        buttonText={PAGE_HEADERS.materials.buttonText}
        onAddClick={() => handleOpenDialog()}
      />

      <DataTable
        columns={tableColumns}
        rows={materials}
        onEdit={handleOpenDialog}
        onDelete={handleDelete}
      />

      <FormDialog
        open={openDialog}
        title={editingId ? DIALOG_TITLES.material.edit : DIALOG_TITLES.material.add}
        fields={formFields}
        formData={formData}
        onClose={handleCloseDialog}
        onSave={handleSave}
        onChange={handleFieldChange}
      />

      <MaterialSuppliersTable
        material={selectedMaterial}
        show={previewModalOpen}
        hide={handleClosePreview}
        onAdd={() => {
          setShowAddSupplierToMaterialDialog(true)
          setPreviewModalOpen(false)
        }}
      />

      <NavigationControl
        pageCount={pagination.page}
        maxPages={maxPages}
        modifyPagination={modifyPagination}
      />

      <AddSupplierToMaterialDialogue 
        open={showAddSupplierToMaterialDialog} 
        materialId={selectedMaterial?.id||''} 
        onSave={()=>{
          setShowAddSupplierToMaterialDialog(false);
          refetchMaterials();
        }}
        onClose={()=>setShowAddSupplierToMaterialDialog(false)}
        />
    </Container>
  )
}

export default MaterialsPage
