/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { ClubSocioService } from './club-socio.service';
import { plainToInstance } from 'class-transformer';
import { SocioEntity } from '../socio/socio.entity';
import { SocioDto } from '../socio/socio.dto';

@Controller('club')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClubSocioController {

    //Constructor
    constructor(private readonly clubSocioService: ClubSocioService){}

    //Add socio a club
    @Post(':clubId/socios/:socioId')
   async addArtworkMuseum(@Param('clubId') clubId: string, @Param('socioId') socioId: string){
       return await this.clubSocioService.addMemberToClub(clubId, socioId);
   }

   //Get socio by clubID socioID
   @Get(":clubId/socios/:socioId")
   async getByClubIdBySocioId(@Param('clubId') clubId: string, @Param('socioId') socioId: string){
    return await this.clubSocioService.findMemberFromClub(socioId, clubId);
   }

   //Get socios by clubId
   @Get(":clubId/socios")
   async getSocios(@Param("clubId") clubId: string){
    return await this.clubSocioService.findMembersFromClub(clubId)
   }

   //Associate socios by clubId
   @Put(":clubId/socios")
   async associateCometnariosToreno(@Param("clubId") clubId: string, @Body() SocioDto: SocioDto[]){
    
    const socios = plainToInstance(SocioEntity, SocioDto)
    return await this.clubSocioService.updateMemberFromClub(clubId, socios)
   }

   //Delete Socio from toreno
   @Delete(":clubId/socios/:socioId")
   @HttpCode(204)
   async deleteSocioClub(@Param('clubId') clubId: string, @Param('socioId') socioId: string){
    return await this.clubSocioService.deleteMemberFromClub(clubId, socioId)
   }


}
