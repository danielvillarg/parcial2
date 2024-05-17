/* eslint-disable prettier/prettier */
import {IsNotEmpty, IsNumber, IsString} from 'class-validator';

export class SocioDto {

    @IsString()
    @IsNotEmpty()
    usuario: string;

    @IsString()
    @IsNotEmpty()
    correo: string;


    @IsString()
    @IsNotEmpty()
    fecha: string;


}
