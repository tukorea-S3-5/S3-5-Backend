import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertExerciseMasterData1773125905312 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        // 운동 마스터 데이터 삽입
        await queryRunner.query(`
            INSERT INTO exercise
            (exercise_name, category_name, intensity, position_type, fall_risk, allowed_trimesters, description, difficulty_label, video_url)
            VALUES
            ('걷기','유산소','LOW','STANDING',0,'[1,2,3]','임산부에게 안전한 기본 유산소 운동','초급','https://youtu.be/bX7dhZH_U4E?si=Hrgk7uvNUNyyOyEy'),
            ('실내 자전거','유산소','LOW','SITTING',0,'[2,3]','무릎 부담이 적은 저충격 유산소 운동','초급',NULL),
            ('수영','유산소','LOW','WATER',0,'[2,3]','관절 부담이 적은 전신 운동','중급',NULL),
            ('임산부 요가','요가','MEDIUM','MIXED',0,'[2,3]','유연성과 안정성을 위한 요가','중급','https://youtu.be/t7j3p188jr4?si=zcbi67lcfff-RTQr'),
            ('플랭크 변형','근력','MEDIUM','PRONE',1,'[2,3]','코어 안정성 강화 운동','중급',NULL),
            ('벽 스쿼트','근력','MEDIUM','STANDING',1,'[2,3]','하체 안정성 강화 운동','중급',NULL),
            ('케겔 운동','근력','LOW','SITTING',0,'[1,2,3]','골반저근 강화 운동','초급','https://youtu.be/pxjSZ-B8-5Y?si=ffuQRIJL6X74Riln'),
            ('호흡 명상','기능성/이완','LOW','SITTING',0,'[1,2,3]','심박 안정과 스트레스 완화','초급',NULL),

            ('사이드 워킹','유산소','LOW','STANDING',0,'[1,2,3]','측면 이동 유산소 운동','초급',NULL),
            ('힐 레이즈','근력','LOW','STANDING',0,'[1,2,3]','종아리 근육 강화','초급',NULL),
            ('팔 스트레칭','요가','LOW','SITTING',0,'[1,2,3]','상체 이완 스트레칭','초급',NULL),
            ('목 스트레칭','요가','LOW','SITTING',0,'[1,2,3]','목 긴장 완화 운동','초급',NULL),
            ('브릿지 변형','근력','MEDIUM','SUPINE',1,'[2,3]','둔근 강화 운동','중급',NULL),
            ('레그 리프트','근력','MEDIUM','SIDE',1,'[2,3]','측면 다리 근육 강화','중급',NULL),
            ('의자 스쿼트','근력','LOW','STANDING',1,'[1,2,3]','의자를 활용한 하체 운동','초급',NULL),
            ('앉은 상태 팔 운동','근력','LOW','SITTING',0,'[1,2,3]','가벼운 상체 근력 운동','초급',NULL),
            ('골반 틸트','기능성/이완','LOW','SUPINE',0,'[1,2,3]','허리 부담 완화 운동','초급',NULL),
            ('벽 기대 스트레칭','요가','LOW','STANDING',0,'[1,2,3]','벽을 활용한 전신 스트레칭','초급',NULL),
            ('가벼운 스텝 운동','유산소','LOW','STANDING',0,'[1,2,3]','리듬감 있는 가벼운 유산소','초급',NULL),
            ('명상 호흡 2단계','기능성/이완','LOW','SITTING',0,'[2,3]','심호흡 중심 명상','초급',NULL);
        `);

        // 증상 매핑 데이터 삽입
        await queryRunner.query(`
            INSERT INTO exercise_tag_map (exercise_id, symptom_name, effect_type)
            VALUES
            (1,'BACK_PAIN','POSITIVE'),
            (1,'SWELLING','POSITIVE'),
            (1,'FATIGUE','POSITIVE'),
            (1,'NAUSEA','POSITIVE'),

            (2,'SWELLING','POSITIVE'),
            (2,'CONSTIPATION','POSITIVE'),

            (3,'BACK_PAIN','POSITIVE'),
            (3,'SWELLING','POSITIVE'),
            (3,'FATIGUE','POSITIVE'),

            (4,'BACK_PAIN','POSITIVE'),
            (4,'PELVIC_PAIN','POSITIVE'),

            (5,'BACK_PAIN','POSITIVE'),
            (6,'PELVIC_PAIN','POSITIVE'),
            (7,'PELVIC_PAIN','POSITIVE'),

            (8,'FATIGUE','POSITIVE'),

            (9,'CONSTIPATION','POSITIVE'),
            (10,'CONSTIPATION','POSITIVE'),

            (11,'FATIGUE','POSITIVE'),
            (12,'FATIGUE','POSITIVE'),

            (13,'BACK_PAIN','POSITIVE'),
            (14,'PELVIC_PAIN','POSITIVE'),
            (15,'PELVIC_PAIN','POSITIVE'),

            (16,'FATIGUE','POSITIVE'),
            (17,'BACK_PAIN','POSITIVE'),
            (18,'BACK_PAIN','POSITIVE'),
            (19,'FATIGUE','POSITIVE'),
            (20,'FATIGUE','POSITIVE');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`DELETE FROM exercise_tag_map;`);

        await queryRunner.query(`
            DELETE FROM exercise
            WHERE exercise_name IN (
                '걷기','실내 자전거','수영','임산부 요가','플랭크 변형','벽 스쿼트','케겔 운동','호흡 명상',
                '사이드 워킹','힐 레이즈','팔 스트레칭','목 스트레칭','브릿지 변형','레그 리프트',
                '의자 스쿼트','앉은 상태 팔 운동','골반 틸트','벽 기대 스트레칭','가벼운 스텝 운동','명상 호흡 2단계'
            );
        `);
    }
}