/* eslint-disable prettier/prettier */
import {IsDate, IsNotEmpty, IsNumber, IsString} from 'class-validator';

export class ClubDto {

    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    fechaFundacion: string;

    @IsString()
    @IsNotEmpty()
    imagen: string;


    @IsString()
    @IsNotEmpty()
    descripcion: string;
}
