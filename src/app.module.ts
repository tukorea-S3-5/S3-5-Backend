import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { EntitiesModule } from './entities/entities.module';
import { PregnancyModule } from './pregnancy/pregnancy.module';

@Module({
  imports: [
    // 환경변수
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // MySQL 연결
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,

      autoLoadEntities: true,
      synchronize: true, // 개발 단계에서만 true
      timezone: '+09:00',
      charset: 'utf8mb4',
    }),

    UsersModule,
    EntitiesModule,
    PregnancyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
