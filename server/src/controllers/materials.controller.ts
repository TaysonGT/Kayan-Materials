import { Response, Request } from "express"
import { myDataSource } from "../app-data-source";
import { addMaterialDTO } from "../dto/add-material.dto";
import { Material } from "../entity/material.entity";

const materialRepo = myDataSource.getRepository(Material)

const findMaterial = async (req:Request, res:Response)=>{
    const {id} = req.params
    const material = await materialRepo.findOne({where: {id: id as string}})

    if(material) {
        res.json({material, success: true}) 
    }else res.json({message: "هذه الخامة غير موجود", success: false})
}

const allMaterials = async (req:Request, res:Response)=>{
    const {page = 1, limit = 10} = req.query
    const [materials, total] = await materialRepo.createQueryBuilder('materials')
    .leftJoinAndSelect('materials.suppliers', 'suppliers')
    .skip((parseInt(page as string) - 1) * parseInt(limit as string))
    .take(parseInt(limit as string))
    .orderBy('materials.addedAt', 'ASC')
    .getManyAndCount()
    
    res.json({materials, total, page, limit, success: true})
}

const addMaterial = async(req: Request, res: Response)=>{
    const { name, description }:addMaterialDTO= req.body;

    const exists = await materialRepo.exists({where: {name}})

    if(!name){
        res.json({message:"برجاء ادخال كل البيانات", success: false})
        return;
    }

    if(exists){
        res.json({success: false, message: "هذا الخام موجود بالفعل"})
        return;
    }
    
    const material = materialRepo.create({name, description})
    await materialRepo.save(material)
    res.json({material, message: "تمت إضافة خام جديد بنجاح", success: true})
}

const updateMaterial = async (req: Request, res:Response) =>{
    const {id} = req.params
    const {name, description} = req.body;

    let materialData:addMaterialDTO = {name, description}
    
    const material = await materialRepo.findOne({where: {id: id as string}})

    if(material){
        const updatedMaterial = Object.assign(material, materialData)
        const updated = await materialRepo.save(updatedMaterial)
        res.json({updated, message: "تم تحديث الخامة بنجاح", success: true})
    }else {
        res.json({message: "هذا الخامة غير موجود", success: false})
    }
}

const deleteMaterial = async (req:Request, res:Response) =>{
    const {id} = req.params
    const material = await materialRepo.createQueryBuilder('material')
    .leftJoinAndSelect('material.transactions','transactions')
    .getOne()

    if(!material){
        res.json({message: "هذه الخامة غير موجودة", success: false})
        return
    }

    if(material.transactions&&material.transactions.length>1){
        res.json({message: "لا يمكن حذف الخامة لوجود حركات لها", success: false})
        return
    }

    const deleted = await materialRepo.remove(material)
    res.json({deleted, message: "تمت إزالة الخامة بنجاح", success:true})
}

export {
    findMaterial,
    allMaterials,
    addMaterial,
    updateMaterial,
    deleteMaterial,
}