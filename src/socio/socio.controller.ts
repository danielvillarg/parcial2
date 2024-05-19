/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { SocioService } from './socio.service';
import { SocioDto } from './socio.dto';
import { SocioEntity } from './socio.entity';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';

@Controller('members')
@UseInterceptors(BusinessErrorsInterceptor)
export class SocioController {

    constructor(private readonly socioService: SocioService) {}

    //Metodo Create socio
    @Post()
    async create(@Body() socioDto: SocioDto){

        const socio: SocioEntity = plainToInstance(SocioEntity, socioDto);
        return await this.socioService.create(socio)
    }

    //Metodo Delete cometnario
    @Delete(':socioId')
    @HttpCode(204)
    async delete(@Param("socioId") socioId: string){
        return await this.socioService.delete(socioId)
    }

    //Metodo Update socio
    @Put(':socioId')
    async update(@Body() socioDto: SocioDto, @Param('socioId') socioId: string){
        
        const socio: SocioEntity = plainToInstance(SocioEntity, socioDto);

        return await this.socioService.update(socioId, socio)
    }

    //Metodo find all
    @Get()
    async findAll(){
        return await this.socioService.findAll()
    }


    //Metodo find one 
    @Get(':socioId')
    async findOne(@Param('socioId') socioId: string){
        return await this.socioService.findOne(socioId)
    }





}
