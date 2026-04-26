import { createInvoice, patchInvoice } from "../api/invoices"

export const newInvoice = async (invoicePayload: any) => {
    const {success, message, invoice} = await createInvoice(invoicePayload)
    if(!success){
      throw new Error(message || 'Failed to create invoice')
    }
    return {invoice, message}
}

export const modifyInvoice = async (id:string, invoicePayload: any) => {
    const {success, message, invoice} = await patchInvoice(id, invoicePayload)
    if(!success){
      throw new Error(message || 'Failed to modify invoice')
    }
    return {invoice, message}
}