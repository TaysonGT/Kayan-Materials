import {Response, Request} from "express"
import { myDataSource } from "../app-data-source";
import { Material } from "../entity/material.entity";
import { Supplier } from "../entity/supplier.entity";
import { Transaction } from "../entity/transaction.entity";
import { TRANSACTION_STATUS } from "../dto/add-transaction.dto";

const materialRepo = myDataSource.getRepository(Material)
const supplierRepo = myDataSource.getRepository(Supplier)
const transactionRepo = myDataSource.getRepository(Transaction)

const createTransaction = async (req: Request, res: Response) => {
    const { materialId, supplierId, unitPrice, type, date, status, quantity } = req.body;

    if (!materialId || !supplierId || !unitPrice || !date || !type) {
        res.json({ message: "برجاء ادخال كل البيانات", success: false });
        return;
    }

    if (type === 'material' && !quantity) {
        res.json({ message: "برجاء ادخال الكمية", success: false });
        return;
    }

    const supplier = await supplierRepo.findOne({ where: { id: supplierId }, relations: {materials: true} });
    const material = await materialRepo.findOne({ where: { id: materialId } });

    if (!supplier || !material) {
        res.json({ message: "لم يتمكن العثور على المورد أو المادة", success: false });
        return;
    }
    
    if (!supplier.materials || !supplier.materials.some(m => m.id === materialId)) {
        res.json({ message: "هذه المادة غير موجودة في قائمة المورد", success: false });
        return;
    }

    const transaction = new Transaction();
    transaction.material = material;
    transaction.supplier = supplier;
    transaction.quantity = quantity;
    transaction.type = type;
    transaction.unitPrice = unitPrice;
    transaction.status = status || 'received';
    transaction.date = new Date(date);
    
    if(type==='freight') {
        transaction.quantity = 1;
    }

    await transactionRepo.save(transaction);
    res.json({ transaction, message: "تم إنشاء الحركة بنجاح", success: true });
}

const updateTransaction = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { materialId, supplierId, quantity, unitPrice, type, date, status } = req.body;

    const transaction = await transactionRepo.findOne({ where: { id: parseInt(id as string) } });

    if (!transaction) {
        res.json({ message: "الحركة غير موجودة", success: false });
        return;
    }

    if(materialId){
        const material = await materialRepo.findOne({ where: { id: materialId } });
        if (!material) {
            res.json({ message: "المادة غير موجودة", success: false })
            return
        }
        transaction.material = material;
    }

    if(supplierId){
        const supplier = await supplierRepo.findOne({ where: { id: supplierId } });
        if (!supplier) {
            res.json({ message: "المورد غير موجود", success: false })
            return
        }
        transaction.supplier = supplier;
    }

    transaction.unitPrice = unitPrice||transaction.unitPrice;
    transaction.quantity = quantity||transaction.quantity;
    transaction.type = type || transaction.type;
    transaction.date = date? new Date(date): transaction.date;
    transaction.status = Object.entries(TRANSACTION_STATUS).includes(status)? status : 'received';
    

    await transactionRepo.save(transaction);
    res.json({ transaction, message: "تم تحديث الحركة بنجاح", success: true });
}

const getTransaction = async (req: Request, res: Response) => {
    const { id } = req.params;
    const transaction = await transactionRepo.findOne({ where: { id: parseInt(id as string) }, relations: ['material', 'supplier'] });

    if (!transaction) {
        res.json({ message: "الحركة غير موجودة", success: false });
        return;
    }
    res.json({ transaction, message: "تم جلب الحركة بنجاح", success: true });
}

const deleteTransaction = async (req: Request, res: Response) => {
    const { id } = req.params;
    const transaction = await transactionRepo.findOne({ where: { id: parseInt(id as string) } });
    if (!transaction) {
        res.json({ message: "الحركة غير موجودة", success: false });
        return;
    }
    await transactionRepo.remove(transaction);
    res.json({ message: "تم حذف الحركة بنجاح", success: true });
}

const allTransactions = async (req: Request, res: Response) => {
    const {page = '1', limit = '10', status, materialId, supplierId}: {page?:string, limit?:string, status?:string, supplierId?:string, materialId?: string} = req.query;

    const query = transactionRepo.createQueryBuilder('transactions')
    .leftJoinAndSelect('transactions.material', 'material')
    .leftJoinAndSelect('transactions.supplier', 'supplier')
    .orderBy('transactions.date', 'DESC')

    if(status==='received'||status==='pending') query.where('transactions.status = :status', {status});
    materialId&& query.andWhere('transactions.material = :materialId', {materialId})
    supplierId&& query.andWhere('transactions.supplier.id = :supplierId', {supplierId})
    
    const [transactions, total] = await query
    .skip((parseInt(page as string) - 1) * parseInt(limit as string))
    .take(parseInt(limit as string))
    .getManyAndCount();

    res.json({ transactions, total, page, limit, message: "تم جلب الحركات بنجاح", success: true });
}

const allٍSupplierMaterialTransactions = async (req: Request, res: Response) => {
    const {page = '1', limit = '10', status, materialId, supplierId}: {page?:string, limit?:string, status?:string, supplierId?:string, materialId?: string} = req.query;

    if(!supplierId||!materialId){
        res.json({ message: "برجاء إدخال المورد والخام", success: false });
    }

    const query = transactionRepo.createQueryBuilder('transactions')
    .innerJoinAndSelect('transactions.material', 'material', 'material.id=:materialId', {materialId})
    .innerJoinAndSelect('transactions.supplier', 'supplier', 'supplier.id=:supplierId', {supplierId})
    .orderBy('transactions.date', 'DESC')

    if(status==='received'||status==='pending') query.where('transactions.status = :status', {status});
    
    const [transactions, total] = await query
    .skip((parseInt(page as string) - 1) * parseInt(limit as string))
    .take(parseInt(limit as string))
    .getManyAndCount();

    res.json({ transactions, total, page, limit, message: "تم جلب الحركات بنجاح", success: true });
}

const getTransactionsBySupplierId = async (req: Request, res: Response) => {
    const { supplierId } = req.params;
    const transactions = await transactionRepo.createQueryBuilder('transactions')
    .leftJoinAndSelect('transactions.material', 'material')
    .leftJoinAndSelect('transactions.supplier', 'supplier')
    .where('supplier.id=:supplierId', {supplierId})
    .orderBy('transactions.date', 'DESC')
    .getMany()
    
    res.json({ transactions, message: "تم جلب الحركات بنجاح", success: true });
}

const getTransactionsByMaterialId = async (req: Request, res: Response) => {
    const { materialId } = req.params;
    const transactions = await transactionRepo.createQueryBuilder('transactions')
    .leftJoinAndSelect('transactions.material', 'material')
    .leftJoinAndSelect('transactions.supplier', 'supplier')
    .where('material.id=:materialId', {materialId})
    .orderBy('transactions.date', 'DESC')
    .getMany()

    res.json({ transactions, message: "تم جلب الحركات بنجاح", success: true });
}

const getDetailedCosts = async (req: Request, res: Response) => {
    const {status, material, supplier} = req.query
    const query = transactionRepo.createQueryBuilder('transactions')
    .leftJoinAndSelect('transactions.material', 'material')
    .leftJoinAndSelect('transactions.supplier', 'supplier')
    
    if(status==='received'||status==='pending') query.where('transactions.status = :status', {status});
    material&& query.andWhere('transactions.material = :material', {material})
    supplier&& query.andWhere('transactions.supplier.id = :supplier', {supplier})

    const transactions = await query
    .getMany()

    const materialCosts: Record<string, number> = {};
    const supplierCosts: Record<string, number> = {};

    const { receivedCosts, notReceivedCosts } = transactions.reduce((acc, transaction) => {
        const supplierName = transaction.supplier.name;
        const materialName = transaction.material.name;
        const cost = transaction.unitPrice * (transaction.quantity || 1);
        transaction.status==='received'? acc.receivedCosts = (acc.receivedCosts || 0) + cost : acc.notReceivedCosts = (acc.notReceivedCosts || 0) + cost;

        if (!materialCosts[materialName]) {
            materialCosts[materialName] = 0;
        }
        materialCosts[materialName] += cost;

        if (!supplierCosts[supplierName]) {
            supplierCosts[supplierName] = 0;
        }
        supplierCosts[supplierName] += cost;

        return acc;
    }, { receivedCosts: 0, notReceivedCosts: 0 });

    const materialCost = Object.entries(materialCosts).map(([name, total]) => ({ name, total }));
    const supplierCost = Object.entries(supplierCosts).map(([name, total]) => ({ name, total }));

    res.json({ total: receivedCosts+notReceivedCosts, receivedCosts, notReceivedCosts, materialCost, supplierCost, message: "تم جلب التكاليف بنجاح", success: true });
}

const calculateMaterialSupplier = async (req: Request, res: Response) => {
    const {material, supplier}: {supplier?:string, material?: string} = req.query;

    if(!material||!supplier){
        res.json({ message:  "برجاء ملء كل البيانات", success: false });
        return;
    }

    const transactions = await transactionRepo.createQueryBuilder('transactions')
    .innerJoinAndSelect('transactions.material', 'material', 'material.id = :materialId', {materialId: material})
    .innerJoinAndSelect('transactions.supplier', 'supplier', 'supplier.id = :supplierId', {supplierId: supplier})
    .andWhere('transactions.material = :material', {material})
    .andWhere('transactions.supplier.id = :supplier', {supplier})
    .orderBy('transactions.date', 'DESC')
    .getMany()

    const { freightTotal, materialTotal, total, materialUnitCount } = transactions.reduce((acc, transaction) => {
        const cost = transaction.unitPrice * (transaction.quantity || 1);
        if(transaction.type==='freight'){
          acc.freightTotal = (acc.freightTotal || 0) + cost  
        } else{
            acc.materialTotal = (acc.materialTotal || 0) + cost;
            acc.materialUnitCount = (acc.materialUnitCount || 0) + (transaction.quantity || 0)
        }

        acc.total += cost;

        return acc;
    }, { freightTotal: 0, materialTotal: 0, total: 0, materialUnitCount:0 });

    const averageCost = total/materialUnitCount

    res.json({averageCost, materialUnitCount, freightTotal, materialTotal, message: "تم حساب المتوسط", success: true });
}


export {
    createTransaction,
    updateTransaction,
    getTransaction,
    deleteTransaction,
    allTransactions,
    allٍSupplierMaterialTransactions,
    calculateMaterialSupplier,
    getTransactionsByMaterialId,
    getTransactionsBySupplierId,
    getDetailedCosts
}