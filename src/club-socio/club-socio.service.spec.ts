/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { ClubSocioService } from './club-socio.service';
import { ClubEntity } from '../club/club.entity';
import { Repository } from 'typeorm';
import { SocioEntity } from '../socio/socio.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ClubSocioService', () => {
  let service: ClubSocioService;
  let clubRepository: Repository<ClubEntity>;
  let socioRepository: Repository<SocioEntity>;
  let club: ClubEntity;
  let socioList : SocioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubSocioService],
    }).compile();

    service = module.get<ClubSocioService>(ClubSocioService);
    clubRepository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));
    socioRepository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    clubRepository.clear();
    socioRepository.clear();

    socioList = [];
    for(let i = 0; i < 5; i++){
        const socio: SocioEntity = await socioRepository.save({
          usuario: faker.lorem.sentence(), 
          correo: faker.internet.email(), 
          fechaNacimiento: faker.date.past({years: 18}), 
        })
        socioList.push(socio);
    }

    club = await clubRepository.save({
      nombre: faker.company.name(),
      fechaFundacion: faker.date.past({years: 3}), 
      imagen: faker.internet.url(), 
      descripcion: faker.lorem.sentence(),
      socios: socioList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //Prueba addSocioClub
  it('addMemberToClub should add an artwork to a club', async () =>{

    const newSocio: SocioEntity = await socioRepository.save({
      usuario: faker.lorem.sentence(), 
      correo: faker.internet.email(), 
      fechaNacimiento: faker.date.past({years: 18}), 
    })

    const newClub: ClubEntity = await clubRepository.save({
      nombre: faker.company.name(),
      fechaFundacion: faker.lorem.sentence(), 
      imagen: faker.internet.url(), 
      descripcion: faker.lorem.sentence()
    })

    const result: ClubEntity = await service.addMemberToClub(newClub.id, newSocio.id)

    expect(result.socios.length).toBe(1)
    expect(result.socios[0]).not.toBeNull()
    expect(result.socios[0].usuario).toBe(newSocio.usuario)
    expect(result.socios[0].correo).toBe(newSocio.correo)
    expect(result.socios[0].fechaNacimiento).toEqual(newSocio.fechaNacimiento)

  })

  //Prueba addSocioClub club invalido
  it('addMemberToClub should throw an exception for invalid club', async () => {
    
    const newSocio: SocioEntity = await socioRepository.save({
      usuario: faker.lorem.sentence(), 
      correo: faker.internet.email(), 
      fechaNacimiento: faker.date.past({years: 18}),
    })

    await expect(() => service.addMemberToClub("0", newSocio.id)).rejects.toHaveProperty("message", "The club with the given id was not found")

  })

  //Prueba addSocioClub Socio invalido 

  it('addMemberToClub should throw an exception for invalid socio', async () => {

    const newClub: ClubEntity = await clubRepository.save({
      nombre: faker.company.name(),
      fechaFundacion: faker.lorem.sentence(), 
      imagen: faker.internet.url(), 
      descripcion: faker.lorem.sentence()
    })

    await expect(() => service.addMemberToClub(newClub.id, "0")).rejects.toHaveProperty("message", "The socio with the given id was not found")

  })


  //Prueba findSocioByClubIdBySocioID
  it('findMemberFromClub should return a socio', async () => {

    const socio: SocioEntity = socioList[0]
    const storedSocio: SocioEntity = await service.findMemberFromClub(socio.id, club.id)

    expect(storedSocio).not.toBeNull();
    expect(storedSocio.usuario).toBe(socio.usuario);
    expect(storedSocio.correo).toBe(socio.correo);
    expect(storedSocio.fechaNacimiento).toEqual(socio.fechaNacimiento);
  })

  //Prueba findSocioByClubIdSocioId club invalido
  it('findMemberFromClub shoud throw an exception for invalid club', async () =>{
    const socio: SocioEntity = socioList[0]
    await expect(() => service.findMemberFromClub(socio.id, "0")).rejects.toHaveProperty("message", "The club with the given id was not found")
  })

  //Prueba findSocioByClubIdSocioId socio invalido
  it('findMemberFromClub shoud throw an exception for invalid socio', async () => {

    await expect(()=> service.findMemberFromClub("0",club.id)).rejects.toHaveProperty("message", "The socio with the given id was not found")
  })

  //Prueba findSocioByClubIdSocioId socio no asociado a club
  it('findMemberFromClub shoud throw an exception for socio not associated to club', async () => {

    const newSocio: SocioEntity = await socioRepository.save({
      usuario: faker.lorem.sentence(), 
      correo: faker.internet.email(), 
      fechaNacimiento: faker.date.past({years: 18}),
    })

    await expect(() => service.findMemberFromClub(newSocio.id, club.id)).rejects.toHaveProperty("message", "The socio with the given id is not associated to the club")

  })


  //Prueba findSociosByClubsId
  it("findMembersFromClub should return socios by club", async () => {

    const socios: SocioEntity[] = await service.findMembersFromClub(club.id)

    expect(socios).not.toBeNull()
    expect(socios.length).toBe(socioList.length)

  })

  //Prueba findSociosByClubsId con club invalido
  it("findMembersFromClub should throw an exception for invalid club", async () => {

    await expect(()=> service.findMembersFromClub("0")).rejects.toHaveProperty("message", "The club with the given id was not found")

  })

  //Prueba associateSociosClub 
  it("updateMembersFromClub should update socio list for a club", async () => {
    
    const newSocio: SocioEntity = await socioRepository.save({
      usuario: faker.lorem.sentence(), 
      correo: faker.internet.email(), 
      fechaNacimiento: faker.date.past({years: 18}),
    })

    const updatedClub: ClubEntity = await service.updateMembersFromClub(club.id, [newSocio])

    expect(updatedClub).not.toBeNull()
    expect(updatedClub.socios.length).toBe(1)
    expect(updatedClub.socios[0].usuario).toBe(newSocio.usuario)
    expect(updatedClub.socios[0].correo).toBe(newSocio.correo)
    expect(updatedClub.socios[0].fechaNacimiento).toEqual(newSocio.fechaNacimiento)

  })

  //Prueba associateSociosClub invalid club
  it('updateMembersFromClub should throw an exception for invalid club', async () => {

    const newSocio: SocioEntity = await socioRepository.save({
      usuario: faker.lorem.sentence(), 
      correo: faker.internet.email(), 
      fechaNacimiento: faker.date.past({years: 18}),
    })

    await expect(() => service.updateMembersFromClub("0", [newSocio])).rejects.toHaveProperty("message", "The club with the given id was not found")

  })


  //Prueba associateSociosClub invalid socio
  it('updateMembersFromClub should throw an exception for invalid socio', async () => {

    const newSocio: SocioEntity = socioList[0]
    newSocio.id = "0"

    await expect(() => service.updateMembersFromClub(club.id, [newSocio])).rejects.toHaveProperty("message", "The socio with the given id was not found")
    
  })

  //Prueba deleteSocioClub
  it("deleteMemberFromClub shuold remove socio form a club", async () => {

    const socio: SocioEntity = socioList[0]

    await service.deleteMemberFromClub(club.id, socio.id)
    const storedClub: ClubEntity = await clubRepository.findOne({where: {id: club.id}, relations: ["socios"]});
   const deletedSocio: SocioEntity = storedClub.socios.find(a => a.id === socio.id);

   expect(deletedSocio).toBeUndefined();

  })

  //Preuba deleteSocioClub invalid club
  it("deleteMemberFromClub should throw an exception for invalid club", async () => {

    const socio:SocioEntity = socioList[0]

    await expect(() => service.deleteMemberFromClub("0", socio.id)).rejects.toHaveProperty("message", "The club with the given id was not found")


  })

  //Prueba deleteSocioClub invalid socio
  it("deleteMemberFromClub should throw an exception for invalid socio", async () => {

    await expect(() => service.deleteMemberFromClub(club.id, "0")).rejects.toHaveProperty("message", "The socio with the given id was not found")
    
  })

  //Prueba deleteSocioClub socio no asociado a club
  it("deleteMemberFromClub should throw an exception for socio not associated to club", async () => {

    const newSocio: SocioEntity = await socioRepository.save({
      usuario: faker.lorem.sentence(), 
      correo: faker.internet.email(), 
      fechaNacimiento: faker.date.past({years: 18}),
    })
    
    await expect(() => service.deleteMemberFromClub(club.id, newSocio.id)).rejects.toHaveProperty("message", "The socio with the given id is not associated to the club")

  })

});
