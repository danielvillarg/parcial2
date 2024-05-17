/* eslint-disable prettier/prettier */

import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ClubEntity } from "src/club/club.entity";

@Entity()
export class SocioEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    usuario: string;

    @Column()
    correo: string;

    @Column()
    fechaNacimiento: string;

    //Relacion con torneo
    @ManyToMany(() => ClubEntity, club=> club.socios)
    clubs: ClubEntity[];
}
