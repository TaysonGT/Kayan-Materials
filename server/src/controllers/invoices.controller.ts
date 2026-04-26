import { Response, Request } from "express"
import { myDataSource } from "../app-data-source";
import { Invoice } from "../entity/invoice.entity";
import { addInvoiceDTO } from "../dto/add-invoice.dto";
import { SupplierService } from "../services/supplier.service";
import { TransactionService } from "../services/transaction.service";
import { addTransactionDTO } from "../dto/add-transaction.dto";
import { Transaction } from "../entity/transaction.entity";
import { Material } from "../entity/material.entity";
import { transactionWithTotal } from "./transactions.controller";

const invoiceRepo = myDataSource.getRepository(Invoice)
const materialRepo = myDataSource.getRepository(Material)
const transactionRepo = myDataSource.getRepository(Transaction)
const supplierService = new SupplierService()
const transactionSerivce = new TransactionService()

const invoiceWithTotal = (invoice: Invoice)=> {
    return {
        ...invoice, 
        transactions: invoice.transactions.map(t=>transactionWithTotal(t)),
        total: invoice.transactions.flatMap(t=>t.quantity*t.unitPrice).reduce((acc, t)=>{return t+=acc},0)+(invoice.freight||0)
    }
}

const getInvoice = async (req:Request, res:Response)=>{
    const {id} = req.params
    const invoice = await invoiceRepo.createQueryBuilder('invoice')
    .where('invoice.id=:id',{id})
    .leftJoinAndSelect('invoice.supplier', 'supplier')
    .leftJoinAndSelect('invoice.transactions', 'transactions')
    .leftJoinAndSelect('transactions.material', 'material')
    .getOne()

    if(!invoice) {
        res.json({message: "هذه الفاتورة غير موجودة", success: false})
        return
    }

    res.json({invoice: invoiceWithTotal(invoice), success: true}) 
}

const getInvoices = async (req:Request, res:Response)=>{
    const {page = 1, limit = 10, materialId, supplierId} = req.query
    
    const query = invoiceRepo.createQueryBuilder('invoices')
    .leftJoinAndSelect('invoices.supplier', 'supplier')
    .leftJoinAndSelect('invoices.transactions', 'transactions')
    .leftJoinAndSelect('transactions.material', 'material')

    materialId&& query.andWhere('material.id = :materialId', {materialId})
    supplierId&& query.andWhere('supplier.id = :supplierId', {supplierId})

    const [invoices, total] = await query
    .skip((parseInt(page as string) - 1) * parseInt(limit as string))
    .take(parseInt(limit as string))
    .orderBy('invoices.createdAt', 'ASC')
    .getManyAndCount()
    
    res.json({invoices: invoices.map(i=>invoiceWithTotal(i)), total, page, limit, success: true})
}

const getInvoicesBySupplier = async (req:Request, res:Response)=>{
    const {page = 1, limit = 10} = req.query
    const {supplierId} = req.params

    const [invoices, total] = await invoiceRepo.createQueryBuilder('invoices')
    .leftJoinAndSelect('invoices.supplier', 'supplier')
    .leftJoinAndSelect('invoices.transactions', 'transactions')
    .where('supplier.id=:supplierId', {supplierId})
    .skip((parseInt(page as string) - 1) * parseInt(limit as string))
    .take(parseInt(limit as string))
    .orderBy('invoices.createdAt', 'ASC')
    .getManyAndCount()

    if(!invoices||invoices.length<1){
        res.json({message: 'لا توجد فواتير لهذا المورد', success: false})
        return
    }
    
    res.json({invoices: invoices.map(i=>invoiceWithTotal(i)), total, page, limit, success: true})
}

const getInvoicesByMaterial = async (req:Request, res:Response)=>{
    const {page = 1, limit = 10} = req.query
    const {materialId} = req.params

    const [invoices, total] = await invoiceRepo.createQueryBuilder('invoices')
    .leftJoinAndSelect('invoices.supplier', 'supplier')
    .leftJoinAndSelect('invoices.transactions', 'transactions')
    .leftJoinAndSelect('transactions.material', 'material')
    .where('material.id=:materialId', {materialId})
    .skip((parseInt(page as string) - 1) * parseInt(limit as string))
    .take(parseInt(limit as string))
    .orderBy('invoices.createdAt', 'ASC')
    .getManyAndCount()

    if(!invoices||invoices.length<1){
        res.json({message: 'لا توجد فواتير لهذا الخام', success: false})
        return
    }
    
    res.json({invoices: invoices.map(i=>invoiceWithTotal(i)), total, page, limit, success: true})
}

const createInvoice = async(req: Request, res: Response)=>{
    const { freight, description, paid, transactions, supplierId, createdAt }:addInvoiceDTO= req.body;
    try{
        const invoice = new Invoice()
        const newTransactions = []
        
        for(const t of (transactions||[])){
            const transaction = await transactionSerivce.createTransaction({...t, supplierId})
            newTransactions.push(transaction)
        }
        
        if(supplierId){
            const supplier = await supplierService.getSupplier(supplierId)
            invoice.supplier = supplier
        }
        
        invoice.freight = freight
        invoice.paid = paid 
        invoice.description = description 
        invoice.createdAt = createdAt
        invoice.transactions = newTransactions

        await invoiceRepo.save(invoice)

        res.json({invoice: invoiceWithTotal(invoice), message: "تمت إضافة فاتورة جديدة بنجاح", success: true})

    } catch(error){
        res.json({message: error.message, success: false})  
    }
}

const addTransactionToInvoice = async (req: Request, res:Response) =>{
    const {id} = req.params
    const {unitPrice, quantity, received_date, status, materialId}:addTransactionDTO = req.body;
    try{
        const invoice = await invoiceRepo.createQueryBuilder('invoice')
        .leftJoinAndSelect('invoice.transactions','transactions')
        .leftJoinAndSelect('transactions.material', 'material')
        .where('invoice.id=:id',{id})
        .getOne()

        if(!invoice){
            throw new Error("هذه الفاتورة غير موجودة")
        }
        
        if(!unitPrice||!quantity||!received_date||!status||!materialId){
            throw new Error("برجاء ملء جميع البيانات")
        }
        
        const material = await materialRepo.findOne({where:{id:materialId}})

        if(!material){
            throw new Error("هذه الخامة غير موجودة")
        }

        const materialExistsInTransactions = invoice.transactions.some(t=>t.material?.id === material.id)
        
        if(materialExistsInTransactions){
            res.json({ message: "هذه المادة موجودة بالفعل في الفاتورة", success: false })
            return
        }

        const transaction = new Transaction()
        transaction.material = material
        transaction.unitPrice = unitPrice
        transaction.quantity = quantity
        transaction.received_date = received_date
        transaction.status = status

        invoice.transactions = [...invoice.transactions||[], transaction]
        
        await invoiceRepo.save(invoice)

        res.json({message: "تمت إضافة عنصر إلى الفاتورة بنجاح", success: true})

    }catch(error){
        res.json({message: error.message, success: false})
    }
}

const updateInvoice = async (req: Request, res:Response) =>{
    const {id} = req.params
    const {supplierId, createdAt, paid, description}:addInvoiceDTO = req.body;
    try{
        const invoice = await invoiceRepo.findOne({where: {id: id as string}})

        if(!invoice){
            throw new Error("هذه الفاتورة غير موجودة")
        }

        if(supplierId){
            const supplier = await supplierService.getSupplier(supplierId)
            invoice.supplier = supplier
        }

        if (createdAt !== undefined) invoice.createdAt = createdAt;
        if (paid !== undefined) invoice.paid = paid;
        if (description !== undefined) invoice.description = description;
        
        const updated = await invoiceRepo.save(invoice)

        res.json({updated, message: "تم تحديث الفاتورة بنجاح", success: true})

    }catch(error){
        res.json({message: error.message, success: false})
    }
}

const deleteInvoice = async (req:Request, res:Response) =>{
    const {id} = req.params
    const invoice = await invoiceRepo.findOne({where: {id: id as string}})

    if(!invoice){
        res.json({message: "هذه الفاتورة غير موجودة", success: false})
        return
    }

    const deleted = await invoiceRepo.remove(invoice)
    res.json({deleted, message: "تمت إزالة الفاتورة بنجاح", success:true})
}

export {
    getInvoice,
    getInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    addTransactionToInvoice,
    getInvoicesBySupplier,
    getInvoicesByMaterial
}