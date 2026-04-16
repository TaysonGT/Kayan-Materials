import React, { useEffect, useState } from 'react'
import { RelationsModal } from '../../components/common'
import type { Supplier } from '../../types'
import { useSuppliers } from '../../hooks/useSuppliers'
import ConfirmDialog from '../../components/common/ConfirmDialog'

interface Props{
    supplier: Supplier|null
    show: boolean
    hide: ()=>void
    onAdd: ()=>void
}

const SupplierMaterialsTable:React.FC<Props> = ({supplier, show, hide, onAdd}) => {
    const [materials, setMaterials] = React.useState(supplier?.materials||[])
    const {getSupplierMaterials, removeMaterialFromSupplier} = useSuppliers()
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [deleteId, setDeleteId] = useState('')
    
    const fetchMaterials = async()=>{
      if(supplier){
        const materials = await getSupplierMaterials(supplier.id)
        setMaterials(materials||[])
      }
    }

    useEffect(()=>{
      fetchMaterials()
    },[supplier])

  return (
    <>
    <RelationsModal
        id={supplier?.id||''}
        open={show}
        title={supplier ? `المواد المورّدة من قبل ${supplier.name}` : ''}
        entityName="مواد"
        count={materials.length||0}
        items={materials}
        columns={[
          { field: 'name', label: 'الاسم' },
          {
            field: 'type', label: 'النوع' },
          { 
            field: 'available', 
            label: 'الحالة',
            render: (value:any)=> (value? 'متاح' : 'غير متاح')
          },
          {
            field: 'description',
            label: 'الوصف',
            render: (value: any) => (value ? value.substring(0, 30) + '...' : '-')
          }
        ]}
        onClose={hide}
        onAdd={onAdd}
        onDelete={(materialId: string)=>{
          setShowDeleteConfirm(true)
          setDeleteId(materialId)
        }}
      />
      <ConfirmDialog
        open={showDeleteConfirm}
        title="تأكيد الحذف"
        content="هل أنت متأكد أنك تريد حذف هذا المورد من المادة؟"
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={async() => {
          deleteId&&await removeMaterialFromSupplier(supplier?.id||'', deleteId)
          await fetchMaterials()
          setShowDeleteConfirm(false)
        }}
      />
    </>
  )
}

export default SupplierMaterialsTable