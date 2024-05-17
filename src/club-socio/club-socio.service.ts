/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SocioEntity } from '../socio/socio.entity';
import { ClubEntity } from '../club/club.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from 'src/shared/errors/business-errors';

@Injectable()
export class ClubSocioService {

    //Constructor
    constructor(
        @InjectRepository(ClubEntity)
        private readonly clubRepository: Repository<ClubEntity>,
    
        @InjectRepository(SocioEntity)
        private readonly socioRepository: Repository<SocioEntity>
    ) {}

    //addSocioClub
    async addMemberToClub(clubId: string, socioId: string): Promise<ClubEntity>{

        const socio: SocioEntity = await this.socioRepository.findOne({where: {id:socioId}})

        if(!socio)
            throw new BusinessLogicException("The comment with the given id was not found", BusinessError.NOT_FOUND)

        const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations:['socios']})

        if(!club)
            throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND)

        club.socios = [...club.socios, socio]

        return await this.clubRepository.save(club)
    }


    //findSocioByClubIdBySocioID
    async findMemberFromClub(socioId: string, clubId: string): Promise<SocioEntity>{

        const socio: SocioEntity = await this.socioRepository.findOne({where: {id:socioId}})

        if(!socio)
            throw new BusinessLogicException("The comment with the given id was not found", BusinessError.NOT_FOUND)

        const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations:['socios']})

        if(!club)
            throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND)

        const socioClub: SocioEntity = club.socios.find(e=> e.id === socio.id)

        if (!socioClub)
            throw new BusinessLogicException("The socio with the given id is not associated to the club", BusinessError.PRECONDITION_FAILED)

        return socioClub 
    }


    //findSociosByClubsId
    async findMembersFromClub(clubId: string): Promise<SocioEntity[]>{

        const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations:['socios']})

        if(!club)
            throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND)

        return club.socios
    }

    //associateSociosClub
    async updateMemberFromClub(clubId: string, socios: SocioEntity[] ): Promise<ClubEntity>{

        const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations:["socios"]})

        if(!club)
            throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND)

        for(let i=0; i<socios.length; i++){
            const socio: SocioEntity = await this.socioRepository.findOne({where: {id: socios[i].id}})

            if(!socio)
                throw new BusinessLogicException("The comment with the given id was not found", BusinessError.NOT_FOUND)
        }

        club.socios = socios
        return await this.clubRepository.save(club)

    }

    //deleteSocioClub
    async deleteMemberFromClub(clubId: string, socioId: string){

        const socio: SocioEntity = await this.socioRepository.findOne({where: {id:socioId}})

        if(!socio)
            throw new BusinessLogicException("The comment with the given id was not found", BusinessError.NOT_FOUND)

        const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations:['socios']})

        if(!club)
            throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND)

        const socioClub: SocioEntity = club.socios.find(e=> e.id === socio.id)

        if (!socioClub)
            throw new BusinessLogicException("The socio with the given id is not associated to the club", BusinessError.PRECONDITION_FAILED)

        club.socios = club.socios.filter(e=>e.id !== socioId)
        await this.clubRepository.save(club)
    }



}
