export class addTransactionDTO {
  invoiceId: string
  materialId: string
  quantity: number
  unitPrice: number
  status: TRANSACTION_STATUS;
  received_date: Date;
}

export enum TRANSACTION_STATUS { RECEIVED = 'received', PENDING = 'pending'}

export const checkStatus = (status: TRANSACTION_STATUS)=>{
  return Object.values(TRANSACTION_STATUS).includes(status)
}