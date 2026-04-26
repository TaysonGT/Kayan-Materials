import express from 'express';
import { addMaterial, allMaterials, deleteMaterial, findMaterial, updateMaterial } from '../controllers/materials.controller';
import { getMaterialSuppliers } from '../controllers/supplier-materials.controller';
const materialRouter = express.Router()

materialRouter.get('/', allMaterials)
materialRouter.post('/', addMaterial)
materialRouter.get('/:id', findMaterial)
materialRouter.put('/:id', updateMaterial)
materialRouter.delete('/:id', deleteMaterial)
materialRouter.get('/:id/suppliers', getMaterialSuppliers)

export default materialRouter