import { addTransactionDTO } from "./add-transaction.dto";

export type addInvoiceDTO = {
    supplierId: string
    description?: string;
    paid?: number
    freight?: number;
    createdAt: Date;
    transactions: addTransactionDTO[];
}