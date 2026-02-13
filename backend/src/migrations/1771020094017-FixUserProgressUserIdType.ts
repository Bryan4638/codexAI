import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixUserProgressUserIdType1771020094017 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Change user_id from varchar to uuid
    await queryRunner.query(
      `ALTER TABLE "user_progress" ALTER COLUMN "user_id" TYPE uuid USING "user_id"::uuid`,
    );

    // Add index for performance
    await queryRunner.query(
      `CREATE INDEX "IDX_user_progress_user_id" ON "user_progress" ("user_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_user_progress_user_id"`);
    await queryRunner.query(
      `ALTER TABLE "user_progress" ALTER COLUMN "user_id" TYPE varchar`,
    );
  }
}
