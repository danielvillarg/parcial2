/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { ClubService } from './club.service';
import { ClubDto } from './club.dto';
import { ClubEntity } from './club.entity';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';

@Controller('clubs')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClubController {

    constructor(private readonly clubService: ClubService) {}

    //Metodo Create club
    @Post()
    async create(@Body() clubDto: ClubDto){

        const club: ClubEntity = plainToInstance(ClubEntity, clubDto);
        return await this.clubService.create(club)
    }

    //Metodo Delete cometnario
    @Delete(':clubId')
    @HttpCode(204)
    async delete(@Param("clubId") clubId: string){
        return await this.clubService.delete(clubId)
    }

    //Metodo Update club
    @Put(':clubId')
    async update(@Body() clubDto: ClubDto, @Param('clubId') clubId: string){
        
        const club: ClubEntity = plainToInstance(ClubEntity, clubDto);

        return await this.clubService.update(clubId, club)
    }

    //Metodo find all
    @Get()
    async findAll(){
        return await this.clubService.findAll()
    }


    //Metodo find one 
    @Get(':clubId')
    async findOne(@Param('clubId') clubId: string){
        return await this.clubService.findOne(clubId)
    }





}
