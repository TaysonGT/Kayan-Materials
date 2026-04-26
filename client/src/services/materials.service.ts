import { getMaterialsBySupplierId } from "../api/suppliers";

export const getSupplierAssociatedMaterials = async (id:string)=>{
    const {success, message, materials} = await getMaterialsBySupplierId(id)
    if(!success){
        throw new Error(message || 'فشل في جلب المواد الخام الخاصة بالمورد')
    }

    return materials||[]
}