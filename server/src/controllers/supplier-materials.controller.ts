import { Response, Request } from "express"
import { myDataSource } from "../app-data-source";
import { Material } from "../entity/material.entity";
import { Supplier } from "../entity/supplier.entity";

const materialRepo = myDataSource.getRepository(Material)
const supplierRepo = myDataSource.getRepository(Supplier)

const getSupplierMaterials = async (req:Request, res:Response)=>{
    const {id} = req.params
    const supplier = await supplierRepo.createQueryBuilder('supplier')
    .where('supplier.id = :id', {id: id as string})
    .leftJoinAndSelect('supplier.materials', 'materials')
    .getOne()

    if(!supplier) {
        res.json({message: "هذا المورد غير موجود", success: false})
        return;
    }

    res.json({materials: supplier.materials||[], success: true, message: "تم جلب المواد الخام الخاصة بالمورد بنجاح"})
}

const getMaterialSuppliers = async (req:Request, res:Response)=>{
    const {id} = req.params
    const material = await materialRepo.createQueryBuilder('material')
    .where('material.id = :id', {id: id as string})
    .leftJoinAndSelect('material.suppliers', 'suppliers')
    .getOne()

    if(!material) {
        res.json({message: "هذه الخامة غير موجودة", success: false})
        return;
    }

    res.json({suppliers: material.suppliers, success: true, message: "تم جلب الموردين الذين يوردون هذه الخامة بنجاح"})
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
    .where('supplier.id = :id', {id: supplierId as string})
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
    
    if(supplier.transactions&&supplier.transactions.length>0){
        res.json({success: false, message: "لا يمكن حذف هذه العلاقة بين المورد والخامة لوجود معاملات تعتمد عليها"})
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
