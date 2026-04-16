import { Response, Request } from "express"
import { myDataSource } from "../app-data-source";
import { Material } from "../entity/material.entity";
import { Supplier } from "../entity/supplier.entity";
import { AddSupplierDTO } from "../dto/add-supplier.dto";
import { In } from "typeorm";

const materialRepo = myDataSource.getRepository(Material)
const supplierRepo = myDataSource.getRepository(Supplier)

const findSupplier = async (req:Request, res:Response)=>{
    const {id} = req.params
    const supplier = await supplierRepo.findOne({where: {id: id as string}, relations: ['materials']})

    if(supplier) {
        res.json({supplier, success: true}) 
    }else res.json({message: "هذا المورد غير موجود", success: false})
}

const allSuppliers = async (req:Request, res:Response)=>{
    const {page = 1, limit = 10} = req.query 

    const [suppliers, total] = await supplierRepo.createQueryBuilder('suppliers')
    .leftJoinAndSelect('suppliers.materials', 'materials')
    .skip((parseInt(page as string) - 1) * parseInt(limit as string))
    .take(parseInt(limit as string))
    .orderBy('materials.addedAt', 'ASC')
    .getManyAndCount()

    res.json({suppliers, success: true, total, page, limit})
}

const getSupplierTransactions = async (req:Request, res:Response)=>{
    const {id} = req.params
    const supplier = await supplierRepo.findOne({where: {id: id as string}, relations: ['transactions']})

    if(supplier) {
        res.json({transactions: supplier.transactions, success: true}) 
    }else res.json({message: "هذا المورد غير موجود", success: false})
}

const addSupplier = async(req: Request, res: Response)=>{
    const { name, address, phone1, phone2 }= req.body;
    
    if(!name){
        res.json({message:"برجاء ادخال كل البيانات", success: false})
        return;
    }

    const checkExists = await supplierRepo.exists({where: {name}})

    if(checkExists){
        res.json({success: false, message: "هذا المورد موجود بالفعل"})
        return;
    }
    
    const supplier = supplierRepo.create({name, address, phone1, phone2})
    
    await supplierRepo.save(supplier)
    res.json({supplier, message: "تمت إضافة مورد جديد بنجاح", success: true})
}

const updateSupplier = async (req: Request, res:Response) =>{
    const {id} = req.params
    const {name, address, phone1, phone2, materials: materialIds} = req.body;

    let supplierData:AddSupplierDTO = {name, address, phone1, phone2, materials: materialIds}
    
    const supplier = await supplierRepo.findOne({where: {id: id as string}})

    const materials = await materialRepo.find({where: {id: In(materialIds)}})

    if(supplier){
        const updatedSupplier = Object.assign(supplier, supplierData, materials? {materials}: {})
        const updated = await supplierRepo.save(updatedSupplier)
        res.json({updated, message: "تم تحديث المورد بنجاح", success: true})
    }else {
        res.json({message: "هذا المورد غير موجود", success: false})
    }
}

const deleteSupplier = async (req:Request, res:Response) =>{
    const {id} = req.params
    const supplier = await supplierRepo.findOne({where: {id: id as string}})

    if(!supplier){
        res.json({message: "حدث خطأ", success: false})
        return
    }

    const deleted = await supplierRepo.remove(supplier)
    res.json({deleted, message: "تمت إزالة المورد بنجاح", success:true})
}

export {
    findSupplier,
    allSuppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    getSupplierTransactions
}