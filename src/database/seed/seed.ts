import { DataSource } from 'typeorm';
import { Exercise } from '../../entities/exercise.entity';
import { ExerciseTagMap } from '../../entities/exercise-tag-map.entity';
import { exerciseSeed } from './exercise.seed';
import { exerciseTagSeed } from './exercise-tag.seed';

export const runSeed = async (dataSource: DataSource) => {
  const exerciseRepo = dataSource.getRepository(Exercise);
  const tagRepo = dataSource.getRepository(ExerciseTagMap);

  await tagRepo.clear();
  await exerciseRepo.clear();

  await exerciseRepo.save(exerciseSeed);
  await tagRepo.save(exerciseTagSeed);

  console.log('Seed 완료');
};