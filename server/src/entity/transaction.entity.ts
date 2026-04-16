import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from "typeorm";
import { Material } from "./material.entity";
import { Supplier } from "./supplier.entity";

@Entity('transactions')
export class Transaction{
    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(()=>Material, (material)=>material.transactions)
    material: Material;

    @ManyToOne(()=>Supplier, (supplier)=>supplier.transactions)
    supplier: Supplier;
    
    @Column()
    unitPrice: number;

    @Column({nullable: true})
    quantity?: number;

    @Column({default: 'received'})
    status: 'received'|'pending';

    @Column()
    type: 'freight'|'material';

    @Column()
    date: Date;

    @CreateDateColumn()
    createdAt: Date;
} 