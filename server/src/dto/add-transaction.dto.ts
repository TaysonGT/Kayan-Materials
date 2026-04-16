export class addTransactionDTO {
  supplierId: string
  materialId: string
  quantity?: number
  unitPrice: number
  date: string
  received: TRANSACTION_STATUS;
}

export enum TRANSACTION_STATUS { 'received', 'pending'}