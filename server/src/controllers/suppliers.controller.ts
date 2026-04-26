import { Response, Request } from "express"
import { myDataSource } from "../app-data-source";
import { Supplier } from "../entity/supplier.entity";
import { AddSupplierDTO } from "../dto/add-supplier.dto";
import { SupplierService } from "../services/supplier.service";

const supplierRepo = myDataSource.getRepository(Supplier)
const supplierService = new SupplierService()

const findSupplier = async (req:Request, res:Response)=>{
    const {id} = req.params
    try{
        const supplier = await supplierService.getSupplier(id as string)
        res.json({success:true, supplier})
    }catch(error){
        res.json({success:false, message: error.message})
    }
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
    const {name, address, phone1, phone2} = req.body;

    let supplierData:AddSupplierDTO = {name, address, phone1, phone2}
    
    try{
        const supplier = await supplierService.getSupplier(id as string)
        const updatedSupplier = Object.assign(supplier, supplierData)
        const updated = await supplierRepo.save(updatedSupplier)
        res.json({updated, message: "تم تحديث المورد بنجاح", success: true})
    }catch(error){
        res.json({success:false, message: error.message})
    }

}

const deleteSupplier = async (req:Request, res:Response) =>{
    const {id} = req.params
    const supplier = await supplierRepo.createQueryBuilder('supplier')
    .where('supplier.id=:id', {id})
    .leftJoinAndSelect('supplier.invoices', 'invoices')
    .getOne()

    if(!supplier){
        res.json({message: "هذا المورد غير موجود", success: false})
        return
    }

    if(supplier.invoices.length>0){
        res.json({message: "لا يمكن حذف المورد لوجود فواتير باسمه", success: false})
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
}