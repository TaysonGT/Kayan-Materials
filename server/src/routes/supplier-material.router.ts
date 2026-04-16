import express from 'express';
import { addSupplierMaterial, removeSupplierMaterial } from '../controllers/supplier-materials.controller';
const supplierMaterialRouter = express.Router()

supplierMaterialRouter.post('/:supplierId/:materialId', addSupplierMaterial)
supplierMaterialRouter.delete('/:supplierId/:materialId', removeSupplierMaterial)

export default supplierMaterialRouter