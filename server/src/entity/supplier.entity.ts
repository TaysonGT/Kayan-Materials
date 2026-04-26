import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Transaction } from "./transaction.entity";
import { Material } from "./material.entity";
import { Invoice } from "./invoice.entity";

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
    
    @OneToMany(()=>Invoice, (invoice)=>invoice.supplier)
    invoices: Invoice[];

    @ManyToMany(()=>Material, (material)=>material.suppliers)
    @JoinTable({
        name: "supplier_materials"
    })
    materials: Material[];
    
}