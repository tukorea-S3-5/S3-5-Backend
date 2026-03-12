"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitSchema1773000000000 = void 0;
class InitSchema1773000000000 {
    name = 'InitSchema1773000000000';
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE \`user\` (\`user_id\` varchar(36) NOT NULL, \`email\` varchar(100) NOT NULL, \`password\` varchar(255) NOT NULL, \`name\` varchar(50) NOT NULL, \`birth_date\` date NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`currentRefreshToken\` varchar(300) NULL, UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`user_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`symptom_log\` (\`symptom_id\` int NOT NULL AUTO_INCREMENT, \`user_id\` varchar(255) NOT NULL, \`symptoms\` json NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`symptom_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`recommendation\` (\`rec_id\` int NOT NULL AUTO_INCREMENT, \`user_id\` varchar(255) NOT NULL, \`source\` varchar(20) NULL, \`content\` text NOT NULL, \`created_at\` timestamp NOT NULL, PRIMARY KEY (\`rec_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`exercise_record\` (\`record_id\` int NOT NULL AUTO_INCREMENT, \`session_id\` int NULL, \`user_id\` varchar(255) NOT NULL, \`exercise_id\` int NOT NULL, \`exercise_name\` varchar(100) NOT NULL, \`order_index\` int NOT NULL, \`started_at\` timestamp NULL, \`ended_at\` timestamp NULL, \`duration\` int NULL, PRIMARY KEY (\`record_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`exercise_session\` (\`session_id\` int NOT NULL AUTO_INCREMENT, \`user_id\` varchar(255) NOT NULL, \`status\` varchar(20) NOT NULL DEFAULT 'ONGOING', \`started_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`ended_at\` timestamp NULL, \`total_duration\` int NOT NULL DEFAULT '0', PRIMARY KEY (\`session_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`report\` (\`report_id\` int NOT NULL AUTO_INCREMENT, \`user_id\` varchar(255) NOT NULL, \`session_id\` int NULL, \`type\` varchar(20) NOT NULL, \`summary\` text NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`report_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`pregnancy_condition\` (\`id\` int NOT NULL AUTO_INCREMENT, \`pregnancy_id\` int NOT NULL, \`condition_code\` enum ('HYPERTENSION', 'THYROID_DISEASE', 'GESTATIONAL_DIABETES', 'ANEMIA', 'BMI_RISK') NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`pregnancy_info\` (\`pregnancy_id\` int NOT NULL AUTO_INCREMENT, \`user_id\` varchar(255) NOT NULL, \`last_menstrual_period\` date NOT NULL, \`pregnancy_start_date\` date NOT NULL, \`due_date\` date NULL, \`is_multiple\` tinyint NULL, \`height\` float NOT NULL, \`pre_weight\` float NOT NULL, \`bmi\` float NULL, \`fitness_level\` varchar(20) NOT NULL, \`max_allowed_bpm\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`pregnancy_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`pregnancy_weight_log\` (\`weight_log_id\` int NOT NULL AUTO_INCREMENT, \`pregnancy_id\` int NOT NULL, \`week\` int NOT NULL, \`weight\` float NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_fee245cf8be78ffbca91d95d67\` (\`pregnancy_id\`, \`week\`), PRIMARY KEY (\`weight_log_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`health_baseline\` (\`baseline_id\` int NOT NULL AUTO_INCREMENT, \`user_id\` varchar(255) NOT NULL, \`resting_hr\` int NULL, \`risk_flag\` tinyint NULL, \`notes\` text NULL, PRIMARY KEY (\`baseline_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`exercise_tag_map\` (\`map_id\` int NOT NULL AUTO_INCREMENT, \`exercise_id\` int NOT NULL, \`symptom_name\` enum ('BACK_PAIN', 'FATIGUE', 'NAUSEA', 'DIZZINESS', 'SWELLING', 'CONSTIPATION', 'PELVIC_PAIN', 'SHORTNESS_OF_BREATH') NOT NULL, \`effect_type\` enum ('POSITIVE', 'NEGATIVE') NOT NULL, UNIQUE INDEX \`unique_exercise_symptom\` (\`exercise_id\`, \`symptom_name\`), PRIMARY KEY (\`map_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`exercise_step\` (\`step_id\` int NOT NULL AUTO_INCREMENT, \`exercise_id\` int NOT NULL, \`step_order\` int NOT NULL, \`title\` varchar(100) NOT NULL, \`description\` text NOT NULL, PRIMARY KEY (\`step_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`exercise\` (\`exercise_id\` int NOT NULL AUTO_INCREMENT, \`exercise_name\` varchar(100) NOT NULL, \`category_name\` enum ('유산소', '요가', '필라테스', '근력', '기능성/이완') NOT NULL, \`intensity\` varchar(20) NULL, \`position_type\` varchar(50) NULL, \`fall_risk\` tinyint NOT NULL DEFAULT 0, \`allowed_trimesters\` json NULL, \`description\` text NULL, \`difficulty_label\` varchar(20) NULL, \`video_url\` varchar(500) NULL, PRIMARY KEY (\`exercise_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`exercise_record\` ADD CONSTRAINT \`FK_fccea7320a4147afce9d4a9e3e6\` FOREIGN KEY (\`session_id\`) REFERENCES \`exercise_session\`(\`session_id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`report\` ADD CONSTRAINT \`FK_4d8732865a82987388afd16123f\` FOREIGN KEY (\`session_id\`) REFERENCES \`exercise_session\`(\`session_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pregnancy_condition\` ADD CONSTRAINT \`FK_676ee0c83eaab86f60c0901da1a\` FOREIGN KEY (\`pregnancy_id\`) REFERENCES \`pregnancy_info\`(\`pregnancy_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pregnancy_info\` ADD CONSTRAINT \`FK_e8ecac25a84b8653e3f1d0debe5\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`user_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pregnancy_weight_log\` ADD CONSTRAINT \`FK_5e8b9b6a4a20d697b9e3a897e28\` FOREIGN KEY (\`pregnancy_id\`) REFERENCES \`pregnancy_info\`(\`pregnancy_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`exercise_tag_map\` ADD CONSTRAINT \`FK_542768e19ab959dabb05045e9aa\` FOREIGN KEY (\`exercise_id\`) REFERENCES \`exercise\`(\`exercise_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`exercise_step\` ADD CONSTRAINT \`FK_5961e7da89ea639d147dcd3f9b4\` FOREIGN KEY (\`exercise_id\`) REFERENCES \`exercise\`(\`exercise_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`exercise_step\` DROP FOREIGN KEY \`FK_5961e7da89ea639d147dcd3f9b4\``);
        await queryRunner.query(`ALTER TABLE \`exercise_tag_map\` DROP FOREIGN KEY \`FK_542768e19ab959dabb05045e9aa\``);
        await queryRunner.query(`ALTER TABLE \`pregnancy_weight_log\` DROP FOREIGN KEY \`FK_5e8b9b6a4a20d697b9e3a897e28\``);
        await queryRunner.query(`ALTER TABLE \`pregnancy_info\` DROP FOREIGN KEY \`FK_e8ecac25a84b8653e3f1d0debe5\``);
        await queryRunner.query(`ALTER TABLE \`pregnancy_condition\` DROP FOREIGN KEY \`FK_676ee0c83eaab86f60c0901da1a\``);
        await queryRunner.query(`ALTER TABLE \`report\` DROP FOREIGN KEY \`FK_4d8732865a82987388afd16123f\``);
        await queryRunner.query(`ALTER TABLE \`exercise_record\` DROP FOREIGN KEY \`FK_fccea7320a4147afce9d4a9e3e6\``);
        await queryRunner.query(`DROP TABLE \`exercise\``);
        await queryRunner.query(`DROP TABLE \`exercise_step\``);
        await queryRunner.query(`DROP INDEX \`unique_exercise_symptom\` ON \`exercise_tag_map\``);
        await queryRunner.query(`DROP TABLE \`exercise_tag_map\``);
        await queryRunner.query(`DROP TABLE \`health_baseline\``);
        await queryRunner.query(`DROP INDEX \`IDX_fee245cf8be78ffbca91d95d67\` ON \`pregnancy_weight_log\``);
        await queryRunner.query(`DROP TABLE \`pregnancy_weight_log\``);
        await queryRunner.query(`DROP TABLE \`pregnancy_info\``);
        await queryRunner.query(`DROP TABLE \`pregnancy_condition\``);
        await queryRunner.query(`DROP TABLE \`report\``);
        await queryRunner.query(`DROP TABLE \`exercise_session\``);
        await queryRunner.query(`DROP TABLE \`exercise_record\``);
        await queryRunner.query(`DROP TABLE \`recommendation\``);
        await queryRunner.query(`DROP TABLE \`symptom_log\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }
}
exports.InitSchema1773000000000 = InitSchema1773000000000;
//# sourceMappingURL=1773000000000-InitSchema.js.map