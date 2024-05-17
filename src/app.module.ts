import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocioModule } from './socio/socio.module';
import { ClubModule } from './club/club.module';
import { ClubSocioModule } from './club-socio/club-socio.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocioEntity } from './socio/socio.entity';
import { ClubEntity } from './club/club.entity';

@Module({
  imports: [SocioModule, ClubModule, ClubSocioModule, TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5433,
    username: 'postgres',
    password: 'postgres',
    database: 'parcial2',
    entities: [ClubEntity, SocioEntity],
    dropSchema: true,
    synchronize: true,
    keepConnectionAlive: true
  }), ClubSocioModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
