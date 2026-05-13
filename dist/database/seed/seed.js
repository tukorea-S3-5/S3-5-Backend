"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const exercise_entity_1 = require("../../entities/exercise.entity");
const exercise_tag_map_entity_1 = require("../../entities/exercise-tag-map.entity");
const exercise_seed_1 = require("./exercise.seed");
const exercise_tag_seed_1 = require("./exercise-tag.seed");
const dotenv = __importStar(require("dotenv"));
dotenv.config({
    path: `.env.${process.env.NODE_ENV || 'local'}`,
});
const dataSource = new typeorm_1.DataSource({
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
    const exerciseRepo = dataSource.getRepository(exercise_entity_1.Exercise);
    const tagRepo = dataSource.getRepository(exercise_tag_map_entity_1.ExerciseTagMap);
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 0');
    await tagRepo.clear();
    await exerciseRepo.clear();
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 1');
    await exerciseRepo.save(exercise_seed_1.exerciseSeed);
    await tagRepo.save(exercise_tag_seed_1.exerciseTagSeed);
    console.log('Seed 완료');
    await dataSource.destroy();
}
runSeed();
//# sourceMappingURL=seed.js.map