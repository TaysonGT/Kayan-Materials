
import express from 'express';
import { addSupplier, allSuppliers, deleteSupplier, findSupplier, getSupplierTransactions, updateSupplier } from '../controllers/supplier.controller';
import { getSupplierMaterials } from '../controllers/supplier-materials.controller';
const supplierRouter = express.Router()

supplierRouter.post('/', addSupplier)
supplierRouter.put('/:id', updateSupplier)
supplierRouter.delete('/:id', deleteSupplier)
supplierRouter.get('/', allSuppliers)
supplierRouter.get('/:id', findSupplier)
supplierRouter.get('/:id/transactions', getSupplierTransactions)
supplierRouter.get('/:id/materials', getSupplierMaterials)

export default supplierRouter