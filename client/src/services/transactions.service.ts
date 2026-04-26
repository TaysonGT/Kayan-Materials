import { removeTransaction } from "../api/transactions";

export const deleteTransaction = async (id:string)=>{
    const {success, message} = await removeTransaction(id)
    if(!success){
        throw new Error(message || 'فشل في جلب المواد الخام الخاصة بالمورد')
    }

    return {message, success}
}