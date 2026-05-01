"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSeed = void 0;
const exercise_entity_1 = require("../../entities/exercise.entity");
const exercise_tag_map_entity_1 = require("../../entities/exercise-tag-map.entity");
const exercise_seed_1 = require("./exercise.seed");
const exercise_tag_seed_1 = require("./exercise-tag.seed");
const runSeed = async (dataSource) => {
    const exerciseRepo = dataSource.getRepository(exercise_entity_1.Exercise);
    const tagRepo = dataSource.getRepository(exercise_tag_map_entity_1.ExerciseTagMap);
    await tagRepo.clear();
    await exerciseRepo.clear();
    await exerciseRepo.save(exercise_seed_1.exerciseSeed);
    await tagRepo.save(exercise_tag_seed_1.exerciseTagSeed);
    console.log('Seed 완료');
};
exports.runSeed = runSeed;
//# sourceMappingURL=seed.js.map