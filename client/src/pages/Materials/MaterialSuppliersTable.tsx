import React, { useEffect, useState } from 'react'
import { RelationsModal } from '../../components/common'
import type { Material } from '../../types'
import { useMaterials } from '../../hooks/useMaterials'
import ConfirmDialog from '../../components/common/ConfirmDialog'

interface Props{
    material: Material|null
    show: boolean
    hide: ()=>void
    onAdd: ()=>void
}

const MaterialSuppliersTable:React.FC<Props> = ({material, show, hide, onAdd}) => {
    const [suppliers, setSuppliers] = useState(material?.suppliers||[])
    const {getMaterialSuppliers, removeSupplierFromMaterial} = useMaterials()
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [deleteId, setDeleteId] = useState('')

    const fetchSuppliers = async()=>{
      if(material){
        const suppliers = await getMaterialSuppliers(material.id)
        setSuppliers(suppliers||[])
      }
    }

    useEffect(()=>{
      fetchSuppliers()
    },[material, getMaterialSuppliers])

  return (
  <>
    <RelationsModal
        id={material?.id||''}
        open={show}
        title={material ? `الموردين لمادة  ${material.name}` : ''}
        entityName="الموردون"
        count={suppliers.length||0}
        items={suppliers}
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
        onDelete={(supplierId: string)=>{
          setShowDeleteConfirm(true)
          setDeleteId(supplierId)
        }}
      />
      <ConfirmDialog
        open={showDeleteConfirm}
        title="تأكيد الحذف"
        content="هل أنت متأكد أنك تريد حذف هذا المورد من المادة؟"
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={async() => {
          deleteId&&await removeSupplierFromMaterial(deleteId, material?.id||'')
          await fetchSuppliers()
          setShowDeleteConfirm(false)
        }}
      />
    </>
  )
}

export default MaterialSuppliersTable