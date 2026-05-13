import { DataSource } from 'typeorm';
import { Exercise } from '../../entities/exercise.entity';
import { ExerciseTagMap } from '../../entities/exercise-tag-map.entity';
import { exerciseSeed } from './exercise.seed';
import { exerciseTagSeed } from './exercise-tag.seed';
import * as dotenv from 'dotenv';

dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'local'}`,
});

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['src/**/*.entity.ts'],
  synchronize: false,
});

async function runSeed() {
  await dataSource.initialize();

  const exerciseRepo = dataSource.getRepository(Exercise);
  const tagRepo = dataSource.getRepository(ExerciseTagMap);

  // FK 체크 비활성화
  await dataSource.query('SET FOREIGN_KEY_CHECKS = 0');

  await tagRepo.clear();
  await exerciseRepo.clear();

  // FK 체크 다시 활성화
  await dataSource.query('SET FOREIGN_KEY_CHECKS = 1');

  await exerciseRepo.save(exerciseSeed);
  await tagRepo.save(exerciseTagSeed);

  console.log('Seed 완료');

  await dataSource.destroy();
}

runSeed();