import express from 'express';
import { createInvoice, getInvoices, deleteInvoice, getInvoice, updateInvoice, getInvoicesBySupplier, getInvoicesByMaterial, addTransactionToInvoice } from '../controllers/invoices.controller';
const invoiceRouter = express.Router()

invoiceRouter.get('/', getInvoices)
invoiceRouter.post('/', createInvoice)
invoiceRouter.post('/transaction/:id', addTransactionToInvoice)
invoiceRouter.get('/:id', getInvoice)
invoiceRouter.put('/:id', updateInvoice)
invoiceRouter.delete('/:id', deleteInvoice)
invoiceRouter.get('/supplier/:supplierId', getInvoicesBySupplier)
invoiceRouter.get('/material/:materialId', getInvoicesByMaterial)

export default invoiceRouter