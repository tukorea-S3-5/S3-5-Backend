import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateExerciseVideoUrls1773313730702 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        // 20번 운동 변경
        await queryRunner.query(`
            UPDATE exercise
            SET exercise_name = '임산부 전신 스트레칭',
                category_name = '요가',
                description = '전신 이완과 혈액순환 개선을 위한 저강도 스트레칭',
                video_url = 'https://youtu.be/t7j3p188jr4'
            WHERE exercise_name = '명상 호흡 2단계';
        `);

        // 개별 영상 URL 업데이트
        await queryRunner.query(`
            UPDATE exercise SET video_url = 'https://youtu.be/U9L5AK9gDhk?si=vyemgusw5d0NP-A1'
            WHERE exercise_name = '골반 틸트';
        `);

        await queryRunner.query(`
            UPDATE exercise SET video_url = 'https://youtu.be/bK9hYuNExzs?si=QRR5ZYFAQCShZduc'
            WHERE exercise_name = '목 스트레칭';
        `);

        await queryRunner.query(`
            UPDATE exercise SET video_url = 'https://youtu.be/if1OhB4x9fE?si=eRtEc0_M9TqiGRaH'
            WHERE exercise_name = '팔 스트레칭';
        `);

        await queryRunner.query(`
            UPDATE exercise SET video_url = 'https://youtu.be/ycKWFO7hxGg?si=ekJ-RltwtrEvEcdO'
            WHERE exercise_name = '힐 레이즈';
        `);

        await queryRunner.query(`
            UPDATE exercise SET video_url = 'https://youtu.be/SCCBya5zejQ?si=oqKwhrqpCU7MjMzb'
            WHERE exercise_name = '레그 리프트';
        `);

        await queryRunner.query(`
            UPDATE exercise SET video_url = 'https://youtu.be/27t8ozpwgLU?si=s9hRmb7jwzFh9IkL'
            WHERE exercise_name = '의자 스쿼트';
        `);

        await queryRunner.query(`
            UPDATE exercise SET video_url = 'https://youtu.be/uWaBdcbx7zg?si=_bAJQytDePtwzZSm'
            WHERE exercise_name = '플랭크 변형';
        `);

        await queryRunner.query(`
            UPDATE exercise SET video_url = 'https://youtu.be/40SUH0Iyugs?si=qYirH3x5vxEpXc8w'
            WHERE exercise_name = '실내 자전거';
        `);

        await queryRunner.query(`
            UPDATE exercise SET video_url = 'https://youtu.be/FDdD0BP192k?si=RuEOlB0_7rH1kOJf'
            WHERE exercise_name = '수영';
        `);

        await queryRunner.query(`
            UPDATE exercise SET video_url = 'https://youtu.be/aFfX3DVv6L4?si=dx7TPRfmtvyGk66y'
            WHERE exercise_name = '벽 스쿼트';
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 필요하면 롤백 로직 작성
    }
}