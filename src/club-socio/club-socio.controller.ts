/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { ClubSocioService } from './club-socio.service';
import { plainToInstance } from 'class-transformer';
import { SocioEntity } from '../socio/socio.entity';
import { SocioDto } from '../socio/socio.dto';

@Controller('clubs')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClubSocioController {

    //Constructor
    constructor(private readonly clubSocioService: ClubSocioService){}

    //Add socio a club
    @Post(':clubId/members/:socioId')
   async addMemberToClub(@Param('clubId') clubId: string, @Param('socioId') socioId: string){
       return await this.clubSocioService.addMemberToClub(clubId, socioId);
   }

   //Get socio by clubID socioID
   @Get(":clubId/members/:socioId")
   async findMemberFromClub(@Param('clubId') clubId: string, @Param('socioId') socioId: string){
    return await this.clubSocioService.findMemberFromClub(socioId, clubId);
   }

   //Get socios by clubId
   @Get(":clubId/members")
   async findMembersFromClub(@Param("clubId") clubId: string){
    return await this.clubSocioService.findMembersFromClub(clubId)
   }

   //Associate socios by clubId
   @Put(":clubId/members")
   async updateMembersFromClub(@Param("clubId") clubId: string, @Body() SocioDto: SocioDto[]){
    
    const socios = plainToInstance(SocioEntity, SocioDto)
    return await this.clubSocioService.updateMembersFromClub(clubId, socios)
   }

   //Delete Socio from toreno
   @Delete(":clubId/members/:socioId")
   @HttpCode(204)
   async deleteMemberFromClub(@Param('clubId') clubId: string, @Param('socioId') socioId: string){
    return await this.clubSocioService.deleteMemberFromClub(clubId, socioId)
   }


}
