import {Response, Request} from "express"
import { myDataSource } from "../app-data-source";
import { Material } from "../entity/material.entity";
import { Transaction } from "../entity/transaction.entity";
import { addTransactionDTO, checkStatus } from "../dto/add-transaction.dto";
import { Invoice } from "../entity/invoice.entity";

const materialRepo = myDataSource.getRepository(Material)
const transactionRepo = myDataSource.getRepository(Transaction)
const invoiceRepo = myDataSource.getRepository(Invoice)

export const transactionWithTotal = (transaction: Transaction)=>{
    return {...transaction, total: transaction.quantity*transaction.unitPrice}
}

const allTransactions = async (req: Request, res: Response) => {
    const {page = '1', limit = '10', status, materialId, supplierId}: {page?:string, limit?:string, status?:string, supplierId?:string, materialId?: string} = req.query;

    const query = transactionRepo.createQueryBuilder('transactions')
    .leftJoinAndSelect('transactions.material', 'material')
    .leftJoinAndSelect('transactions.invoice', 'invoice')
    .leftJoinAndSelect('invoice.supplier', 'supplier')
    .orderBy('transactions.received_date', 'DESC')

    if(status==='received'||status==='pending') query.where('status = :status', {status});
    materialId&& query.andWhere('material.id = :materialId', {materialId})
    supplierId&& query.andWhere('supplier.id = :supplierId', {supplierId})
    
    const [transactions, total] = await query
    .skip((parseInt(page as string) - 1) * parseInt(limit as string))
    .take(parseInt(limit as string))
    .getManyAndCount();

    res.json({ transactions: transactions.map(t=>transactionWithTotal(t)), total, page, limit, message: "تم جلب الحركات بنجاح", success: true });
}

const updateTransaction = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { materialId, quantity, unitPrice, received_date, status }:addTransactionDTO = req.body;

    const transaction = await transactionRepo.createQueryBuilder('transaction')
    .leftJoinAndSelect('transaction.invoice','invoice')
    .leftJoinAndSelect('transaction.material', 'material1')
    .leftJoinAndSelect('invoice.transactions', 'transactions')
    .leftJoinAndSelect('transactions.material', 'material2')
    .where('transaction.id=:id',{id})
    .getOne()
    
    if (!transaction) {
        res.json({ message: "الحركة غير موجودة", success: false });
        return;
    }
    
    if(!materialId){
        res.json({ message: "برجاء إدخال الخام", success: false });
        return;
    }
    
    const material = await materialRepo.findOne({ where: { id: materialId } });
    
    if (!material) {
        res.json({ message: "المادة غير موجودة", success: false })
        return
    }
    
    const invoiceTransactionsExceptCurrent = transaction.invoice.transactions.filter(t=>t.id!==transaction.id) 
    const materialExistsInTransactions = invoiceTransactionsExceptCurrent.some(t=>t.material?.id === transaction.material?.id)
    
    if(materialExistsInTransactions){
        res.json({ message: "هذه المادة موجودة بالفعل في الفاتورة", success: false })
        return
    }

    transaction.material = material;

    transaction.unitPrice = unitPrice||transaction.unitPrice;
    transaction.quantity = quantity||transaction.quantity;
    transaction.received_date = received_date? new Date(received_date): transaction.received_date;
    transaction.status = checkStatus(status)? status : transaction.status;

    await transactionRepo.save(transaction);
    res.json({ transaction: transactionWithTotal(transaction), message: "تم تحديث الحركة بنجاح", success: true });
}

const getTransaction = async (req: Request, res: Response) => {
    const { id } = req.params;
    const transaction = await transactionRepo.createQueryBuilder('transaction')
    .leftJoinAndSelect('transaction.material', 'material')
    .leftJoinAndSelect('transaction.invoice', 'invoice')
    .leftJoinAndSelect('invoice.supplier', 'supplier')
    .where('transaction.id=:id', {id})
    .getOne()

    if (!transaction) {
        res.json({ message: "الحركة غير موجودة", success: false });
        return;
    }
    res.json({ transaction: transactionWithTotal(transaction), message: "تم جلب الحركة بنجاح", success: true });
}

const deleteTransaction = async (req: Request, res: Response) => {
    const { id } = req.params;
    const transaction = await transactionRepo.createQueryBuilder('transaction')
    .leftJoinAndSelect('transaction.material', 'material')
    .leftJoinAndSelect('transaction.invoice', 'invoice')
    .leftJoinAndSelect('invoice.supplier', 'supplier')
    .getOne()

    if (!transaction) {
        res.json({ message: "الحركة غير موجودة", success: false });
        return;
    }

    await transactionRepo.remove(transaction);
    res.json({ message: "تم حذف الحركة بنجاح", success: true });
}

const allSupplierMaterialTransactions = async (req: Request, res: Response) => {
    const {page = '1', limit = '10', status, materialId, supplierId}: {page?:string, limit?:string, status?:string, supplierId?:string, materialId?: string} = req.query;

    if(!supplierId||!materialId){
        res.json({ message: "برجاء إدخال المورد والخام", success: false });
    }

    const query = transactionRepo.createQueryBuilder('transactions')
    .innerJoinAndSelect('transactions.material', 'material', 'material.id=:materialId', {materialId})
    .innerJoinAndSelect('transactions.invoice', 'invoice')
    .innerJoinAndSelect('invoice.supplier', 'supplier', 'supplier.id=:supplierId', {supplierId})
    .orderBy('transactions.received_date', 'DESC')

    if(status==='received'||status==='pending') query.where('transactions.status = :status', {status});
    
    const [transactions, total] = await query
    .skip((parseInt(page as string) - 1) * parseInt(limit as string))
    .take(parseInt(limit as string))
    .getManyAndCount();

    res.json({ transactions: transactions.map(t=>transactionWithTotal(t)), total, page, limit, message: "تم جلب الحركات بنجاح", success: true });
}

const getTransactionsBySupplierId = async (req: Request, res: Response) => {
    const { supplierId } = req.params;
    const transactions = await transactionRepo.createQueryBuilder('transactions')
    .leftJoinAndSelect('transactions.material', 'material')
    .leftJoinAndSelect('transactions.invoice', 'invoice')
    .leftJoinAndSelect('invoice.supplier', 'supplier')
    .where('supplier.id=:supplierId', {supplierId})
    .orderBy('transactions.received_date', 'DESC')
    .getMany()
    
    res.json({ transactions: transactions.map(t=>transactionWithTotal(t)), message: "تم جلب الحركات بنجاح", success: true });
}

const getTransactionsByMaterialId = async (req: Request, res: Response) => {
    const { materialId } = req.params;
    const transactions = await transactionRepo.createQueryBuilder('transactions')
    .leftJoinAndSelect('transactions.material', 'material')
    .leftJoinAndSelect('transactions.invoice', 'invoice')
    .leftJoinAndSelect('invoice.supplier', 'supplier')
    .where('material.id=:materialId', {materialId})
    .orderBy('transactions.received_date', 'DESC')
    .getMany()

    res.json({ transactions: transactions.map(t=>transactionWithTotal(t)), message: "تم جلب الحركات بنجاح", success: true });
}

const calculateMaterialSupplier = async (req: Request, res: Response) => {
    const {material, supplier}: {supplier?:string, material?: string} = req.query;

    if(!material||!supplier){
        res.json({ message:  "برجاء ملء كل البيانات", success: false });
        return;
    }

    const invoices = await invoiceRepo.createQueryBuilder('invoices')
    .innerJoinAndSelect('invoices.transactions', 'transactions')
    .innerJoinAndSelect('invoices.supplier', 'supplier')
    .innerJoinAndSelect('transactions.material', 'material')
    .where('material.id = :material', {material})
    .andWhere('supplier.id = :supplier', {supplier})
    .orderBy('transactions.received_date', 'DESC')
    .getMany()

    const freightTotal = invoices.reduce((acc, invoice)=>{
        const totalInvoiceUnits = invoice.transactions.reduce((sum, t)=>sum+(t.quantity||0), 0)
        const freightPerUnit = (invoice.freight || 0) / (totalInvoiceUnits || 1)
        const transaction = invoice.transactions.find(t=>t.material?.id === material)
        if(transaction) {
            acc+= freightPerUnit*(transaction.quantity||0)
            return acc;
        }

        return acc
    },0)

    const transactions = invoices.flatMap(i=>i.transactions.filter(t=>t.material?.id===material))

    const { materialTotal, materialUnitCount } = transactions.reduce((acc, transaction) => {
        const cost = transaction.unitPrice * (transaction.quantity || 1);
        
        acc.materialTotal = (acc.materialTotal || 0) + cost;
        acc.materialUnitCount = (acc.materialUnitCount || 0) + (transaction.quantity || 0)

        return acc;
    }, { materialTotal: 0, materialUnitCount:0 });

    const averageCost = ((materialTotal+freightTotal)||0)/(materialUnitCount||1)

    res.json({averageCost, materialUnitCount, freightTotal, materialTotal, message: "تم حساب المتوسط", success: true });
}


const getDetailedCosts = async (req: Request, res: Response) => {
    const {status, materialId, supplierId} = req.query
    
    const query = invoiceRepo.createQueryBuilder('invoice')
        .innerJoinAndSelect('invoice.transactions', 'transactions')
        .innerJoinAndSelect('invoice.supplier', 'supplier');
        
    if (!!materialId) {
        query.innerJoinAndSelect('transactions.material', 'material')
            .andWhere('material.id = :materialId', { materialId });
    } else {
        query.leftJoinAndSelect('transactions.material', 'material');
    }
    
    if (supplierId) {
        query.andWhere('supplier.id = :supplierId', { supplierId });
    }
    
    const invoices = await query.getMany()

    const materialCosts: Record<string, number> = {};
    const supplierCosts: Record<string, number> = {};
    
    const { freightTotal, plainReceivedCosts, plainNotReceivedCosts, receivedUnits, notReceivedUnits } = invoices.reduce((acc, invoice) => {
        const supplierName = invoice.supplier?.name||'unknown';
        acc.freightTotal+= invoice.freight||0;

        invoice.transactions?.forEach(transaction=>{
            const materialName = transaction.material?.name||'unknown';
            const quantity = transaction.quantity||1;
            const cost = transaction.unitPrice * quantity;
            
            if(transaction.status==='received') {
                acc.plainReceivedCosts += cost
                acc.receivedUnits += quantity
            } else {
                acc.plainNotReceivedCosts += cost;
                acc.notReceivedUnits += quantity
            }
    
            materialCosts[materialName] = (materialCosts[materialName] || 0) + cost;
            supplierCosts[supplierName] = (supplierCosts[supplierName] || 0) + cost;

        })

        return acc;
    }, { freightTotal: 0, plainReceivedCosts: 0, plainNotReceivedCosts: 0, receivedUnits: 0, notReceivedUnits: 0 });

    const totalUnits = receivedUnits+notReceivedUnits
    const freightPerUnit = freightTotal/(totalUnits||1)

    const receivedCosts = plainReceivedCosts+(freightPerUnit*receivedUnits)
    const notReceivedCosts = plainNotReceivedCosts+(freightPerUnit*notReceivedUnits)

    const materialCost = Object.entries(materialCosts).map(([name, total]) => ({ name, total }));
    const supplierCost = Object.entries(supplierCosts).map(([name, total]) => ({ name, total }));

    res.json({ total: receivedCosts + notReceivedCosts, receivedCosts, notReceivedCosts, materialCost, supplierCost, message: "تم جلب التكاليف بنجاح", success: true });
}

export {
    updateTransaction,
    getTransaction,
    deleteTransaction,
    allTransactions,
    allSupplierMaterialTransactions,
    calculateMaterialSupplier,
    getTransactionsByMaterialId,
    getTransactionsBySupplierId,
    getDetailedCosts
}