import { Entity, PrimaryGeneratedColumn, OneToMany, Column, CreateDateColumn, ManyToMany} from "typeorm";
import { Transaction } from "./transaction.entity";
import { Supplier } from "./supplier.entity";

@Entity('materials')
export class Material{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    name: string;

    @Column({nullable: true})
    description?: string;

    @OneToMany(()=>Transaction, (transaction)=>transaction.material)
    transactions: Transaction[];
    
    @ManyToMany(()=>Supplier, (supplier)=>supplier.materials)
    suppliers: Supplier[];

    @CreateDateColumn()
    addedAt: Date;
} 