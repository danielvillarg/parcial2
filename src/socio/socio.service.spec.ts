/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { SocioEntity } from './socio.entity';
import { SocioService } from './socio.service';

describe('SocioService', () => {
 let service: SocioService;
 let repository: Repository<SocioEntity>;
 let socioList : SocioEntity[];

 beforeEach(async () => {
   const module: TestingModule = await Test.createTestingModule({
     imports: [...TypeOrmTestingConfig()],
     providers: [SocioService],
   }).compile();

   service = module.get<SocioService>(SocioService);
   repository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));

   await seedDatabase();
 });


 //Poblar base de datos para pruebas
 const seedDatabase = async () => {
  repository.clear();
  socioList = [];
    for(let i = 0; i < 5; i++){
        const socio: SocioEntity = await repository.save({
          usuario: faker.lorem.sentence(), 
          correo: faker.lorem.sentence(),
          fechaNacimiento: faker.lorem.sentence()
        })
        socioList.push(socio);
    }
}
  
 //Prueba que este definido
 it('should be defined', () => {
   expect(service).toBeDefined();
 });

 //Prueba Create socio
 it('create should return a new socio', async () => {

  const socio: SocioEntity = {
    id: '',
    usuario: faker.lorem.sentence(), 
    correo: faker.lorem.sentence(),
    fechaNacimiento: faker.lorem.sentence(),
    clubs: null
  }

  const newSocio: SocioEntity = await service.create(socio);

  expect(newSocio).not.toBeNull();

  const storedSocio: SocioEntity = await repository.findOne({where: {id: newSocio.id}})
  expect(storedSocio).not.toBeNull();
  expect(storedSocio.usuario).toEqual(newSocio.usuario)
  expect(storedSocio.correo).toEqual(newSocio.correo)
  expect(storedSocio.fechaNacimiento).toEqual(newSocio.fechaNacimiento)
 });

 //Prueba Delete socio
 it('delete should remove a socio', async ()=> {
  const socio: SocioEntity = socioList[0];
  await service.delete(socio.id);
  const deletedSocio: SocioEntity = await repository.findOne({ where: { id: socio.id } })

  expect(deletedSocio).toBeNull();

 })


 //Prueba Delete socio que no existe

 it('delete should throw an exception for an invalid socio', async () => {

  await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The socio with the given id was not found");

 })


 //Prueba Update socio

 it('update should return a updated socio', async () => {

  const socio: SocioEntity = socioList[0];
  socio.usuario = "Usuario1"
  socio.correo = "usuario1@hotmail.com"
  socio.fechaNacimiento = "04/04/2001"

  const updatedSocio: SocioEntity = await service.update(socio.id, socio);
  expect(updatedSocio).not.toBeNull();
  
  const storedSocio: SocioEntity = await repository.findOne({where: {id: socio.id}})
  expect(storedSocio).not.toBeNull();  
  expect(storedSocio.usuario).toEqual(socio.usuario)
  expect(storedSocio.correo).toEqual(socio.correo)
  expect(storedSocio.fechaNacimiento).toEqual(socio.fechaNacimiento)

 })

 //Prueba Update socio que no existe
 it('update should throw an exception for an invalid socio', async ()=> {
  const socio: SocioEntity = socioList[0];
  socio.usuario = "Usuario nuevo"
  socio.correo = "usuarionuevo@hotmail.com"
  socio.fechaNacimiento = "05/05/2001"

  await expect(() => service.update("0", socio)).rejects.toHaveProperty("message", "The socio with the given id was not found")
 })

 //Prueba Find all socios

 it('findall should return all socios', async () => {
  const socios: SocioEntity[] = await service.findAll()
  expect(socios).not.toBeNull();
  expect(socios).toHaveLength(socioList.length);
 })

 //Prueba Find one socio

 it('findone should return a socio by id', async () => {
  const socio: SocioEntity = socioList[0];
  const storedSocio: SocioEntity = await service.findOne(socio.id) ;
  expect(storedSocio).not.toBeNull();
  expect(storedSocio.usuario).toEqual(socio.usuario)
  expect(storedSocio.correo).toEqual(socio.correo)
  expect(storedSocio.fechaNacimiento).toEqual(socio.fechaNacimiento)
 })

 //Prueba Finf one socio que no existe

 it('findone should throw an exception for an invalid socio', async () =>{

  await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The socio with the given id was not found")
 })
});
