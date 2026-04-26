import { myDataSource } from "../app-data-source";
import { Supplier } from "../entity/supplier.entity";

const supplierRepo = myDataSource.getRepository(Supplier)

export class SupplierService{
    constructor() {}
    
    async getSupplier(id:string){
        const supplier = await supplierRepo.findOne({where: {id: id as string}, relations: ['materials']})
        if(!supplier) {
            throw new Error("هذا المورد غير موجود")
        }
        return supplier
    }
}
