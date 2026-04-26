import { 
    allTransactions, 
    allSupplierMaterialTransactions, 
    calculateMaterialSupplier, 
    deleteTransaction, 
    getTransaction,
    updateTransaction,
    getTransactionsByMaterialId,
    getTransactionsBySupplierId,
    getDetailedCosts
} from '../controllers/transactions.controller'
import express from 'express';

const transactionRouter = express.Router()

transactionRouter.get('/', allTransactions)
transactionRouter.get('/supplier-material', allSupplierMaterialTransactions)
transactionRouter.get('/calculate', calculateMaterialSupplier);
transactionRouter.get('/detailed-costs', getDetailedCosts)
transactionRouter.get('/material/:id', getTransactionsByMaterialId);
transactionRouter.get('/supplier/:id', getTransactionsBySupplierId);
transactionRouter.get('/:id', getTransaction);
transactionRouter.put('/:id', updateTransaction);
transactionRouter.delete('/:id', deleteTransaction);

export default transactionRouter