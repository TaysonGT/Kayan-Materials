import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Transaction } from "./transaction.entity";
import { Material } from "./material.entity";

@Entity('suppliers')
export class Supplier{
    @PrimaryGeneratedColumn('uuid')
    id:string;
    
    @Column()
    name: string;
        
    @Column({nullable:true})
    phone1?: string;

    @Column({nullable:true})
    phone2?: string;
    
    @Column({nullable:true})
    address?: string
    
    @OneToMany(()=>Transaction, (transaction)=>transaction.supplier)
    transactions: Transaction[];

    @ManyToMany(()=>Material, (material)=>material.suppliers)
    @JoinTable({
        name: "supplier_materials"
    })
    materials: Material[];
    
}