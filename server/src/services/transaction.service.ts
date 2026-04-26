import { myDataSource } from "../app-data-source";
import { Supplier } from "../entity/supplier.entity";
import { TRANSACTION_STATUS } from "../dto/add-transaction.dto";
import { Material } from "../entity/material.entity";
import { Transaction } from "../entity/transaction.entity";

const materialRepo = myDataSource.getRepository(Material)
const supplierRepo = myDataSource.getRepository(Supplier)
const transactionRepo = myDataSource.getRepository(Transaction)

export class TransactionService{
    async createTransaction({ materialId, supplierId, unitPrice, received_date, status, quantity }:{ materialId: string, supplierId:string, unitPrice: number, status: TRANSACTION_STATUS, quantity: number, received_date: Date }){
        if (!materialId || !unitPrice || !quantity) {
            throw new Error("بيانات الحركة غير كاملة");
        }

        const supplier = await supplierRepo.findOne({ where: { id: supplierId }, relations: {materials: true} });
        const material = await materialRepo.findOne({ where: { id: materialId } });

        if (!supplier || !material) {
            throw new Error("لم يتمكن العثور على المورد أو المادة")
        }
        
        if (!supplier.materials || !supplier.materials.some(m => m.id === materialId)) {
            throw new Error("هذه المادة غير موجودة في قائمة المورد")
        }

        const transaction = new Transaction();
        transaction.material = material;
        transaction.quantity = quantity;
        transaction.unitPrice = unitPrice;
        transaction.received_date = new Date(received_date);

        return transaction
    }
}