import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDailyActivity1773945600000 implements MigrationInterface {
  name = 'AddDailyActivity1773945600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "daily_activity" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "activity_date" date NOT NULL,
        "exercises_completed" integer NOT NULL DEFAULT 0,
        "challenges_completed" integer NOT NULL DEFAULT 0,
        "xp_earned" integer NOT NULL DEFAULT 0,
        "time_spent_minutes" integer NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_daily_activity" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_daily_activity_user_date" UNIQUE ("user_id", "activity_date")
      )
    `);

    await queryRunner.query(
      `ALTER TABLE "daily_activity" ADD CONSTRAINT "FK_daily_activity_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_daily_activity_user_date" ON "daily_activity" ("user_id", "activity_date" DESC)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_daily_activity_user_date"`);
    await queryRunner.query(
      `ALTER TABLE "daily_activity" DROP CONSTRAINT "FK_daily_activity_user"`,
    );
    await queryRunner.query(`DROP TABLE "daily_activity"`);
  }
}
