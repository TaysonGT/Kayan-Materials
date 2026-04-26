import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from "typeorm";
import { Material } from "./material.entity";
import { Supplier } from "./supplier.entity";
import { Invoice } from "./invoice.entity";
import { TRANSACTION_STATUS } from "../dto/add-transaction.dto";

@Entity('transactions')
export class Transaction{
    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(()=>Material, (material)=>material.transactions)
    material: Material;

    @ManyToOne(()=>Invoice, (invoice)=>invoice.transactions, {
        onDelete: 'CASCADE'   // ✅ Correct placement
    })
    invoice: Invoice;
    
    @Column()
    unitPrice: number;

    @Column({default: 1})
    quantity: number;

    @Column({default: 'received'})
    status: TRANSACTION_STATUS;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    received_date: Date;

    @CreateDateColumn()
    createdAt: Date;
} 