/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClubEntity } from './club.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from 'src/shared/errors/business-errors';

const MAX_DESCRIPTION_LENGTH = 100;

@Injectable()
export class ClubService {

    //Constructor
    constructor(
        @InjectRepository(ClubEntity)
        private readonly clubRepository: Repository<ClubEntity>
    ){}
    //Crear club 
    async create(club: ClubEntity): Promise<ClubEntity>{
        if (club.descripcion.length > MAX_DESCRIPTION_LENGTH) {
            throw new BusinessLogicException(
                `La descripción no puede superar los ${MAX_DESCRIPTION_LENGTH} caracteres`,
                BusinessError.PRECONDITION_FAILED
            );
        }
        return await this.clubRepository.save(club);
    }

    //Delete club
    async delete(id: string){
        const club: ClubEntity = await this.clubRepository.findOne({where:{id}});

        if(!club)
            throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND)

        await this.clubRepository.remove(club)
    }

    //Update club

    async update(id: string, club: ClubEntity): Promise<ClubEntity>{
        if (club.descripcion.length > MAX_DESCRIPTION_LENGTH) {
            throw new BusinessLogicException(
                `La descripción no puede superar los ${MAX_DESCRIPTION_LENGTH} caracteres`,
                BusinessError.PRECONDITION_FAILED
            );
        }
        const clubPersisted: ClubEntity = await this.clubRepository.findOne({where:{id}});
        if(!clubPersisted)
            throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND)

        return await this.clubRepository.save({...clubPersisted, ...club})
    }

    //Find all clubs

    async findAll(): Promise<ClubEntity[]>{

        return await this.clubRepository.find({relations: ["socios"]})

    }


    //Find one club

    async findOne(id: string): Promise<ClubEntity>{

        const club: ClubEntity = await this.clubRepository.findOne({where:{id}, relations: ["socios"]});

        if(!club)
            throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND)

        return club

    }


}
