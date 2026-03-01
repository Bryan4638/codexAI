import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBestExecutionTime1772299197850 implements MigrationInterface {
    name = 'AddBestExecutionTime1772299197850'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exercise_tests" DROP CONSTRAINT "FK_exercise_tests_exercise_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_exercise_tests_exercise_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_user_progress_user_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_user_progress_exercise_id"`);
        await queryRunner.query(`ALTER TABLE "user_progress" ADD "best_execution_time_ms" numeric(10,3)`);
        await queryRunner.query(`ALTER TABLE "exercise_tests" ADD CONSTRAINT "FK_aa8aaca58644771dfb8e1262f61" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "exercise_tests" DROP CONSTRAINT "FK_aa8aaca58644771dfb8e1262f61"`);
        await queryRunner.query(`ALTER TABLE "user_progress" DROP COLUMN "best_execution_time_ms"`);
        await queryRunner.query(`CREATE INDEX "IDX_user_progress_exercise_id" ON "user_progress" ("exercise_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_user_progress_user_id" ON "user_progress" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_exercise_tests_exercise_id" ON "exercise_tests" ("exercise_id") `);
        await queryRunner.query(`ALTER TABLE "exercise_tests" ADD CONSTRAINT "FK_exercise_tests_exercise_id" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
