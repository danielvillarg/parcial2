/* eslint-disable prettier/prettier */
import {IsNotEmpty, IsNumber, IsString} from 'class-validator';

export class ClubDto {

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
