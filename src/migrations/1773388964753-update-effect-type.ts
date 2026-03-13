import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEffectType1773388964753 implements MigrationInterface {
    name = 'UpdateEffectType1773388964753'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`exercise_tag_map\` CHANGE \`effect_type\` \`effect_type\` enum ('POSITIVE_STRONG', 'POSITIVE_WEAK', 'NEGATIVE') NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`exercise_tag_map\` CHANGE \`effect_type\` \`effect_type\` enum ('POSITIVE', 'NEGATIVE') NOT NULL`);
    }

}
