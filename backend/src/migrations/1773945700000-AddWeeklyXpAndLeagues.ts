import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWeeklyXpAndLeagues1773945700000 implements MigrationInterface {
  name = 'AddWeeklyXpAndLeagues1773945700000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Weekly XP tracking table
    await queryRunner.query(`
      CREATE TABLE "weekly_xp" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "xp_earned" integer NOT NULL DEFAULT 0,
        "week_start" date NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_weekly_xp" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_weekly_xp_user_week" UNIQUE ("user_id", "week_start")
      )
    `);

    await queryRunner.query(
      `ALTER TABLE "weekly_xp" ADD CONSTRAINT "FK_weekly_xp_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_weekly_xp_week" ON "weekly_xp" ("week_start", "xp_earned" DESC)`,
    );

    // Add league column to users
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN "league" varchar(20) DEFAULT 'bronze'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "league"`);
    await queryRunner.query(`DROP INDEX "IDX_weekly_xp_week"`);
    await queryRunner.query(
      `ALTER TABLE "weekly_xp" DROP CONSTRAINT "FK_weekly_xp_user"`,
    );
    await queryRunner.query(`DROP TABLE "weekly_xp"`);
  }
}
