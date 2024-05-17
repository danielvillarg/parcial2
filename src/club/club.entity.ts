/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SocioEntity } from "src/socio/socio.entity";

@Entity()
export class ClubEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    fechaFundacion: string;

    @Column()
    imagen: string;

    @Column()
    descripcion: string;

    //Relacion con torneo
    @ManyToMany(() => SocioEntity, socio=> socio.clubs)
    @JoinTable()
    socios: SocioEntity[];
}
