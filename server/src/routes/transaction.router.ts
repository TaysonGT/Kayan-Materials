import { 
    allTransactions, 
    allٍSupplierMaterialTransactions, 
    calculateMaterialSupplier, 
    createTransaction, 
    deleteTransaction, 
    getDetailedCosts, 
    getTransaction,
    updateTransaction
} from '../controllers/transactions.controller'
import express from 'express';

const transactionRouter = express.Router()

transactionRouter.get('/', allTransactions)
transactionRouter.get('/supplier-material', allٍSupplierMaterialTransactions)
transactionRouter.get('/detailed', getDetailedCosts);
transactionRouter.get('/calculate', calculateMaterialSupplier);
transactionRouter.get('/:id', getTransaction);

transactionRouter.post('/', createTransaction);
transactionRouter.put('/:id', updateTransaction);
transactionRouter.delete('/:id', deleteTransaction);

export default transactionRouter