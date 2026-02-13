import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixUserProgressExerciseIdType1771020323823 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Clean up invalid data that is not a UUID
    await queryRunner.query(
      `DELETE FROM "user_progress" WHERE "exercise_id" !~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'`,
    );

    // Change exercise_id from varchar to uuid
    await queryRunner.query(
      `ALTER TABLE "user_progress" ALTER COLUMN "exercise_id" TYPE uuid USING "exercise_id"::uuid`,
    );

    // Add index for performance
    await queryRunner.query(
      `CREATE INDEX "IDX_user_progress_exercise_id" ON "user_progress" ("exercise_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_user_progress_exercise_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_progress" ALTER COLUMN "exercise_id" TYPE varchar`,
    );
  }
}
