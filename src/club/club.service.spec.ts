/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { ClubEntity } from './club.entity';
import { ClubService } from './club.service';

describe('ClubService', () => {
 let service: ClubService;
 let repository: Repository<ClubEntity>;
 let clubList : ClubEntity[];

 beforeEach(async () => {
   const module: TestingModule = await Test.createTestingModule({
     imports: [...TypeOrmTestingConfig()],
     providers: [ClubService],
   }).compile();

   service = module.get<ClubService>(ClubService);
   repository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));

   await seedDatabase();
 });


 //Poblar base de datos para pruebas
 const seedDatabase = async () => {
  repository.clear();
  clubList = [];
    for(let i = 0; i < 5; i++){
        const club: ClubEntity = await repository.save({
          nombre: faker.company.name(),
          fechaFundacion: faker.date.past({years: 3}), 
          imagen: faker.internet.url(),
          descripcion: faker.lorem.sentence()
        })
        clubList.push(club);
    }
}
  
 //Prueba que este definido
 it('should be defined', () => {
   expect(service).toBeDefined();
 });

 //Prueba Create club
 it('create should return a new club', async () => {

  const club: ClubEntity = {
    id: '',
    nombre: faker.company.name(),
    fechaFundacion: faker.date.past({years: 3}), 
    imagen: faker.internet.url(),
    descripcion: faker.lorem.sentence(),
    socios: null,
  }

  const newClub: ClubEntity = await service.create(club);

  expect(newClub).not.toBeNull();

  const storedClub: ClubEntity = await repository.findOne({where: {id: newClub.id}})
  expect(storedClub).not.toBeNull();
  expect(storedClub.nombre).toEqual(newClub.nombre)
  expect(storedClub.fechaFundacion).toEqual(newClub.fechaFundacion)
  expect(storedClub.imagen).toEqual(newClub.imagen)
  expect(storedClub.descripcion).toEqual(newClub.descripcion)

 });

 it('create should throw an exception for an invalid description from club', async () => {
  const club: ClubEntity = {
    id: '',
    nombre: faker.company.name(),
    fechaFundacion: faker.date.past({years: 3}),
    imagen: faker.internet.url(),
    descripcion: 'a'.repeat(101),
    socios: null,
  };

  await expect(service.create(club)).rejects.toHaveProperty("message", "The description from club with the given id was not valid");
});


 //Prueba Update club

 it('update should return a updated club', async () => {
  const club: ClubEntity = clubList[0];
  club.nombre = "Los Lagartos"
  club.fechaFundacion = new Date('2016-11-05')
  club.imagen = "www.imagen2.com"
  club.descripcion = "Este es el club 2"
  const updatedClub: ClubEntity = await service.update(club.id, club);
  expect(updatedClub).not.toBeNull();
  
  const storedClub: ClubEntity = await repository.findOne({where: {id: club.id}})
  expect(storedClub).not.toBeNull();  
  expect(storedClub.nombre).toEqual(club.nombre)
  expect(storedClub.fechaFundacion).toEqual(club.fechaFundacion)
  expect(storedClub.imagen).toEqual(club.imagen)
  expect(storedClub.descripcion).toEqual(club.descripcion)

 })

 //Prueba Update club que no existe
 it('update should throw an exception for an invalid club', async ()=> {
  const club: ClubEntity = clubList[0];
  club.nombre = "Arrayanes"
  club.fechaFundacion = new Date('2016-01-01')
  club.imagen = "www.imagennueva.com"
  club.descripcion = "Nuevo club"

  await expect(() => service.update("0", club)).rejects.toHaveProperty("message", "The club with the given id was not found")
 })

 it('update should throw an exception for an invalid description from club', async () => {
  const club: ClubEntity = clubList[0];
  club.nombre = "Arrayanes"
  club.fechaFundacion = new Date('2016-01-01')
  club.imagen = "www.imagennueva.com"
  club.descripcion = 'a'.repeat(101); 

  await expect(() => service.update("0", club)).rejects.toHaveProperty("message", "The description from club with the given id was not valid")
});

 //Prueba Find all clubs

 it('findall should return all clubs', async () => {
  const clubs: ClubEntity[] = await service.findAll()
  expect(clubs).not.toBeNull();
  expect(clubs).toHaveLength(clubList.length);
 })

 //Prueba Find one club

 it('findone should return a club by id', async () => {
  const club: ClubEntity = clubList[0];
  const storedClub: ClubEntity = await service.findOne(club.id) ;
  expect(storedClub).not.toBeNull();
  expect(storedClub.nombre).toEqual(club.nombre)
  expect(storedClub.fechaFundacion).toEqual(club.fechaFundacion)
  expect(storedClub.imagen).toEqual(club.imagen)
  expect(storedClub.descripcion).toEqual(club.descripcion)

 })

 //Prueba Finf one club que no existe

 it('findone should throw an exception for an invalid club', async () =>{

  await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The club with the given id was not found")
 })



 //Prueba Delete club
 it('delete should remove a club', async ()=> {
  const club: ClubEntity = clubList[0];
  await service.delete(club.id);
  const deletedClub: ClubEntity = await repository.findOne({ where: { id: club.id } })

  expect(deletedClub).toBeNull();

 })


 //Prueba Delete club que no existe

 it('delete should throw an exception for an invalid club', async () => {

  await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The club with the given id was not found");

 })
});
