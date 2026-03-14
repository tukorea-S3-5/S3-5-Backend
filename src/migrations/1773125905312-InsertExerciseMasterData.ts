import { MigrationInterface, QueryRunner } from 'typeorm';

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
            -- 1. 걷기: 전신 순환을 돕는 운동이나 특정 부위 타겟팅은 아니므로 WEAK
            (1,'BACK_PAIN','POSITIVE_WEAK'),
            (1,'SWELLING','POSITIVE_WEAK'),
            (1,'FATIGUE','POSITIVE_WEAK'),
            (1,'CONSTIPATION','POSITIVE_WEAK'),

            -- 2. 실내 자전거: 하체 근육 펌핑으로 붓기 제거에 직접적(STRONG), 장운동 촉진은 보조적(WEAK)
            (2,'SWELLING','POSITIVE_STRONG'),
            (2,'CONSTIPATION','POSITIVE_WEAK'),

            -- 3. 수영: 물의 부력이 척추 부담을 덜고(STRONG), 수압이 부종을 뺌(STRONG)
            (3,'BACK_PAIN','POSITIVE_STRONG'),
            (3,'SWELLING','POSITIVE_STRONG'),
            (3,'FATIGUE','POSITIVE_WEAK'),
            (3,'CONSTIPATION','POSITIVE_WEAK'),

            -- 4. 임산부 요가: 요통 및 골반 이완에 특화된 동작들 (PELVIC_PAIN 골반통은 컨텐츠에 따라 다름!! 영상보고 없애든지 weak로 변경해야함!)
            (4,'BACK_PAIN','POSITIVE_STRONG'),
            (4,'PELVIC_PAIN','POSITIVE_WEAK'),

            -- 5. 플랭크 변형: 코어(복횡근)를 직접 강화하여 요통을 방지하므로 STRONG
            (5,'BACK_PAIN','POSITIVE_STRONG'),
            
            -- 6 & 7. 골반/하체 강화: 환도선다(골반통) 및 골반 기저근 타겟팅
            (6,'PELVIC_PAIN','POSITIVE_WEAK'), -- 벽 스쿼트
            (7,'PELVIC_PAIN','POSITIVE_STRONG'), -- 케겔 운동

            -- 8. 호흡 명상: 스트레스 호르몬을 낮추어 피로도 개선
            (8,'FATIGUE','POSITIVE_WEAK'),

            -- 9 & 10. 가벼운 하체 움직임: 장 운동을 간접적으로 돕는 WEAK
            (9,'CONSTIPATION','POSITIVE_WEAK'), -- 사이드 워킹
            (10,'CONSTIPATION','POSITIVE_WEAK'), -- 힐 레이즈

            -- 11 & 12. 상체 스트레칭: 목 긴장 완화는 두통/피로, 팔은 보조적
            (11,'FATIGUE','POSITIVE_WEAK'), -- 팔 스트레칭
            (12,'FATIGUE','POSITIVE_WEAK'), -- 목 스트레칭

            -- 13. 코어/둔근 타겟팅: 요통에 의학적으로 가장 추천되는 부위
            (13,'BACK_PAIN','POSITIVE_STRONG'), -- 브릿지 변형 (둔근/허리 강화)

            -- 15 & 16. 가벼운 근력 보조: 전신 활력 증진
            (15,'PELVIC_PAIN','POSITIVE_WEAK'), -- 의자 스쿼트(통증 없는 경우에 한함)
            (16,'FATIGUE','POSITIVE_WEAK'), -- 앉은 상태 팔 운동

            -- 17. 골반 틸트: 임산부 요통 처방 물리치료 동작
            (17,'BACK_PAIN','POSITIVE_STRONG'),

            -- 18 & 19. 가벼운 전신 움직임
            (18,'BACK_PAIN','POSITIVE_WEAK'), -- 벽 기대 스트레칭
            (18,'FATIGUE','POSITIVE_WEAK'), -- 벽 기대 스트레칭
            (19,'FATIGUE','POSITIVE_WEAK'), -- 가벼운 스텝 운동

            -- 20. 명상/전신 스트레칭: 피로 해소 및 수면 질 향상
            (20,'FATIGUE','POSITIVE_WEAK'),

            -- NEGATIVE: 해당 증상 시 절대 금지 (악화 위험)
            -- 의학적 근거: 환도선다(골반통) 산모는 비대칭 하중 및 한 발 지지 운동 시 골반 불안정성 증가로 통증 악화
            (9, 'PELVIC_PAIN', 'NEGATIVE'),  -- 사이드 워킹 (비대칭 체중 이동)
            (14, 'PELVIC_PAIN', 'NEGATIVE'), -- 레그 리프트 (한쪽 다리 들기)
            (19, 'PELVIC_PAIN', 'NEGATIVE'); -- 가벼운 스텝 운동 (한 발씩 뛰기/걷기)
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
