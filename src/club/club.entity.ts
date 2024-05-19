/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SocioEntity } from "../socio/socio.entity";

@Entity()
export class ClubEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    fechaFundacion: Date;

    @Column()
    imagen: string;

    @Column()
    descripcion: string;

    //Relacion con torneo
    @ManyToMany(() => SocioEntity, socio=> socio.clubs)
    @JoinTable()
    socios: SocioEntity[];
}
