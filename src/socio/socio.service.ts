/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SocioEntity } from './socio.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class SocioService {

    //Constructor
    constructor(
        @InjectRepository(SocioEntity)
        private readonly socioRepository: Repository<SocioEntity>
    ){}

    //Crear socio 
    async create(socio: SocioEntity): Promise<SocioEntity>{
        if (!socio.correo.includes('@')){
            throw new BusinessLogicException("The email from socio with the given id was not valid", BusinessError.PRECONDITION_FAILED);
        }
        return await this.socioRepository.save(socio);
    }

    //Delete socio
    async delete(id: string){
        const socio: SocioEntity = await this.socioRepository.findOne({where:{id}});

        if(!socio)
            throw new BusinessLogicException("The socio with the given id was not found", BusinessError.NOT_FOUND)

        await this.socioRepository.remove(socio)
    }

    //Update socio

    async update(id: string, socio: SocioEntity): Promise<SocioEntity>{
        if (!socio.correo.includes('@')){
            throw new BusinessLogicException("The email from socio with the given id was not valid", BusinessError.PRECONDITION_FAILED);
        }
        const socioPersisted: SocioEntity = await this.socioRepository.findOne({where:{id}});
        if(!socioPersisted)
            throw new BusinessLogicException("The socio with the given id was not found", BusinessError.NOT_FOUND)

        return await this.socioRepository.save({...socioPersisted, ...socio})
    }

    //Find all socios

    async findAll(): Promise<SocioEntity[]>{
        return await this.socioRepository.find({relations: ["clubs"]})

    }


    //Find one socio

    async findOne(id: string): Promise<SocioEntity>{
        const socio: SocioEntity = await this.socioRepository.findOne({where:{id}, relations: ["clubs"]});
        if(!socio)
            throw new BusinessLogicException("The socio with the given id was not found", BusinessError.NOT_FOUND)
        return socio
    }


}
