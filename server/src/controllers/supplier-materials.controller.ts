import { Response, Request } from "express"
import { myDataSource } from "../app-data-source";
import { Material } from "../entity/material.entity";
import { Supplier } from "../entity/supplier.entity";

const materialRepo = myDataSource.getRepository(Material)
const supplierRepo = myDataSource.getRepository(Supplier)

const getSupplierMaterials = async (req:Request, res:Response)=>{
    const {id} = req.params
    const materials = await materialRepo.createQueryBuilder('materials')
    .leftJoinAndSelect('materials.suppliers', 'suppliers')
    .leftJoinAndSelect('materials.transactions', 'transactions')
    .leftJoinAndSelect('transactions.invoice', 'invoice')
    .leftJoinAndSelect('invoice.supplier', 'supplier')
    .where('suppliers.id = :id', {id: id as string})
    .orWhere('supplier.id = :id', {id: id as string})
    .getMany()

    res.json({materials: materials||[], success: true, message: "تم جلب المواد الخام الخاصة بالمورد بنجاح"})
}

const getMaterialSuppliers = async (req:Request, res:Response)=>{
    const {id} = req.params
    const suppliers = await supplierRepo.createQueryBuilder('suppliers')
    .leftJoinAndSelect('suppliers.materials', 'materials')
    .where('materials.id = :id', {id: id as string})
    .getMany()

    res.json({suppliers: suppliers, success: true, message: "تم جلب الموردين الذين يوردون هذه الخامة بنجاح"})
    return;
}

const addSupplierMaterial = async(req: Request, res: Response)=>{
    const {materialId, supplierId} = req.params
    
    if(!materialId){
        res.json({message:"برجاء ادخال كل البيانات", success: false})
        return;
    }

    const supplier = await supplierRepo.createQueryBuilder('supplier')
    .where('supplier.id = :id', {id: supplierId as string})
    .leftJoinAndSelect('supplier.materials', 'materials', 'materials.id = :materialId', {materialId: materialId as string})
    .getOne()
    
    if(!supplier){
        res.json({success: false, message: "هذا المورد غير موجود"})
        return;
    }

    if(supplier.materials&&supplier.materials.length>0){
        res.json({success: false, message: "هذه الخامة موجودة في قائمة هذا المورد بالفعل"})
        return;
    }
    
    const material = await materialRepo.findOne({where: {id: materialId as string}})

    if(!material){
        res.json({success: false, message: "هذه الخامة غير موجودة"})
        return;
    }
    
    await supplierRepo.createQueryBuilder('supplier')
    .relation(Supplier, 'materials')
    .of(supplier)
    .add(material)
    
    res.json({supplier, message: "تمت إضافة مادة خام للمورد بنجاح", success: true})
}


const removeSupplierMaterial = async (req: Request, res: Response) => {
    const { supplierId, materialId } = req.params;
        
    const supplier = await supplierRepo.createQueryBuilder('supplier')
    .where('supplier.id = :id', {id: supplierId})
    .leftJoinAndSelect('supplier.materials', 'materials', 'materials.id = :materialId', {materialId: materialId as string})
    .leftJoinAndSelect('supplier.transactions', 'transactions')
    .getOne()

    if(!supplier){
        res.json({success: false, message: "هذا المورد غير موجود"})
        return;
    }

    if(!supplier.materials||supplier.materials.length<1){
        res.json({success: false, message: "هذه الخامة غير موجودة في قائمة هذا المورد"})
        return;
    }

    supplier.materials = supplier.materials?.filter((m) => m.id !== materialId)
    await supplierRepo.save(supplier)

    res.json({message: "تم حذف العلاقة بين المورد والخامة بنجاح", success: true})
}


export {
    getSupplierMaterials,
    getMaterialSuppliers,
    addSupplierMaterial,
    removeSupplierMaterial
}
