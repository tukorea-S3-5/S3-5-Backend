import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EntitiesModule } from './entities/entities.module';
import { PregnancyModule } from './pregnancy/pregnancy.module';
import { ExerciseModule } from './exercise/exercise.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt.guard';
import { PregnancyWeightModule } from './pregnancy-weight/pregnancy-weight.module';
import { SymptomModule } from './symptom/symptom.module';

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

    EntitiesModule,
    PregnancyModule,
    ExerciseModule,
    AuthModule,
    UserModule,
    PregnancyWeightModule,
    SymptomModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD, // 앱에 전역 문지기(APP_GUARD) 등록
      useClass: JwtAuthGuard, // 문지기 역할 JwtAuthGuard 클래스
    },
  ],
})
export class AppModule {}
