import { Entity, PrimaryGeneratedColumn, OneToMany, Column, ManyToOne} from "typeorm";
import { Transaction } from "./transaction.entity";
import { Supplier } from "./supplier.entity";

@Entity('invoices')
export class Invoice{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({nullable: true})
    description?: string;

    @Column({default:0})
    paid?: number

    @Column({default: 0})
    freight?: number;
    
    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @OneToMany(()=>Transaction, (transaction)=>transaction.invoice, {
        cascade: true,  // Auto saves/deletes
        onDelete: 'CASCADE'  // Database level
    })

    transactions: Transaction[];
    
    @ManyToOne(()=>Supplier, (supplier)=>supplier.invoices)
    supplier: Supplier;

} 