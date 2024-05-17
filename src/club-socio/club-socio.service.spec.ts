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
          correo: faker.lorem.sentence(), 
          fechaNacimiento: faker.lorem.sentence(), 
        })
        socioList.push(socio);
    }

    club = await clubRepository.save({
      fechaFundacion: faker.lorem.sentence(), 
      imagen: faker.company.name(), 
      descripcion: faker.lorem.sentence(),
      socios: socioList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //Prueba addSocioClub
  it('addSocioClub should add an artwork to a club', async () =>{

    const newSocio: SocioEntity = await socioRepository.save({
      usuario: faker.lorem.sentence(), 
      correo: faker.lorem.sentence(), 
      fechaNacimiento: faker.lorem.sentence(), 
    })

    const newClub: ClubEntity = await clubRepository.save({
      fechaFundacion: faker.lorem.sentence(), 
      imagen: faker.company.name(), 
      descripcion: faker.lorem.sentence()
    })

    const result: ClubEntity = await service.addMemberToClub(newClub.id, newSocio.id)

    expect(result.socios.length).toBe(1)
    expect(result.socios[0]).not.toBeNull()
    expect(result.socios[0].usuario).toBe(newSocio.usuario)
    expect(result.socios[0].correo).toBe(newSocio.correo)
    expect(result.socios[0].fechaNacimiento).toBe(newSocio.fechaNacimiento)

  })

  //Prueba addSocioClub club invalido
  it('addSocioClub should throw an exception for invalid club', async () => {
    
    const newSocio: SocioEntity = await socioRepository.save({
      usuario: faker.lorem.sentence(), 
      correo: faker.lorem.sentence(), 
      fechaNacimiento: faker.lorem.sentence(), 
    })

    await expect(() => service.addMemberToClub("0", newSocio.id)).rejects.toHaveProperty("message", "The club with the given id was not found")

  })

  //Prueba addSocioClub Socio invalido 

  it('addSocioClub should throw an exception for invalid socio', async () => {

    const newClub: ClubEntity = await clubRepository.save({
      fechaFundacion: faker.lorem.sentence(), 
      imagen: faker.company.name(), 
      descripcion: faker.lorem.sentence()
    })

    await expect(() => service.addMemberToClub(newClub.id, "0")).rejects.toHaveProperty("message", "The club with the given id was not found")

  })


  //Prueba findSocioByClubIdBySocioID
  it('findSocioByClubIdBySocioID should return a socio', async () => {

    const socio: SocioEntity = socioList[0]
    const storedSocio: SocioEntity = await service.findSocioByClubIdSocioId(socio.id, club.id)

    expect(storedSocio).not.toBeNull();
    expect(storedSocio.descripcion).toBe(socio.descripcion);
    expect(storedSocio.valor).toBe(socio.valor);
  })

  //Prueba findSocioByClubIdSocioId club invalido
  it('findSocioByClubIdSocioId shoud throw an exception for invalid club', async () =>{
    const socio: SocioEntity = socioList[0]
    await expect(() => service.findSocioByClubIdSocioId(socio.id, "0")).rejects.toHaveProperty("message", "The club with the given id was not found")
  })

  //Prueba findSocioByClubIdSocioId socio invalido
  it('findSocioByClubIdSocioId shoud throw an exception for invalid socio', async () => {

    await expect(()=> service.findSocioByClubIdSocioId("0",club.id)).rejects.toHaveProperty("message", "The club with the given id was not found")
  })

  //Prueba findSocioByClubIdSocioId socio no asociado a club
  it('findSocioByClubIdSocioId shoud throw an exception for socio not associated to club', async () => {

    const newSocio: SocioEntity = await socioRepository.save({
      descripcion: faker.lorem.sentence(),
      valor: faker.number.int() * (5 - 1) + 1,
    })

    await expect(() => service.findSocioByClubIdSocioId(newSocio.id, club.id)).rejects.toHaveProperty("message", "The socio with the given id is not associated to the club")

  })


  //Prueba findSociosByClubsId
  it("findSociosByClubsId should return socios by club", async () => {

    const socios: SocioEntity[] = await service.findSociosByClubId(club.id)

    expect(socios).not.toBeNull()
    expect(socios.length).toBe(socioList.length)

  })

  //Prueba findSociosByClubsId con club invalido
  it("findSociosByClubsId should throw an exception for invalid club", async () => {

    await expect(()=> service.findSociosByClubId("0")).rejects.toHaveProperty("message", "The club with the given id was not found")

  })

  //Prueba associateSociosClub 
  it("associateSociosClub should update socio list for a club", async () => {
    
    const newSocio: SocioEntity = await socioRepository.save({
      descripcion: faker.lorem.sentence(),
      valor: faker.number.int() * (5 - 1) + 1,
    })

    const updatedClub: ClubEntity = await service.associateSociosClub(club.id, [newSocio])

    expect(updatedClub).not.toBeNull()
    expect(updatedClub.socios.length).toBe(1)
    expect(updatedClub.socios[0].descripcion).toBe(newSocio.descripcion)
    expect(updatedClub.socios[0].valor).toBe(newSocio.valor)

  })

  //Prueba associateSociosClub invalid club
  it('associateSociosClub should throw an exception for invalid club', async () => {

    const newSocio: SocioEntity = await socioRepository.save({
      descripcion: faker.lorem.sentence(),
      valor: faker.number.int() * (5 - 1) + 1,
    })

    await expect(() => service.associateSociosClub("0", [newSocio])).rejects.toHaveProperty("message", "The club with the given id was not found")

  })


  //Prueba associateSociosClub invalid socio
  it('associateSociosClub should throw an exception for invalid socio', async () => {

    const newSocio: SocioEntity = socioList[0]
    newSocio.id = "0"

    await expect(() => service.associateSociosClub(club.id, [newSocio])).rejects.toHaveProperty("message", "The socio with the given id was not found")
    
  })

  //Prueba deleteSocioClub
  it("deleteSocioClub shuold remove socio form a club", async () => {

    const socio: SocioEntity = socioList[0]

    await service.deleteSocioClub(club.id, socio.id)
    const storedClub: ClubEntity = await clubRepository.findOne({where: {id: club.id}, relations: ["socios"]});
   const deletedSocio: SocioEntity = storedClub.socios.find(a => a.id === socio.id);

   expect(deletedSocio).toBeUndefined();

  })

  //Preuba deleteSocioClub invalid club
  it("deleteSocioClub should throw an exception for invalid club", async () => {

    const socio:SocioEntity = socioList[0]

    await expect(() => service.deleteSocioClub("0", socio.id)).rejects.toHaveProperty("message", "The club with the given id was not found")


  })

  //Prueba deleteSocioClub invalid socio
  it("deleteSocioClub should throw an exception for invalid socio", async () => {

    await expect(() => service.deleteSocioClub(club.id, "0")).rejects.toHaveProperty("message", "The socio with the given id was not found")
    
  })

  //Prueba deleteSocioClub socio no asociado a club
  it("deleteSocioClub should throw an exception for socio not associated to club", async () => {

    const newSocio: SocioEntity = await socioRepository.save({
      descripcion: faker.lorem.sentence(),
      valor: faker.number.int() * (5 - 1) + 1,
    })
    
    await expect(() => service.deleteSocioClub(club.id, newSocio.id)).rejects.toHaveProperty("message", "The socio with the given id is not associated to the club")

  })

});
