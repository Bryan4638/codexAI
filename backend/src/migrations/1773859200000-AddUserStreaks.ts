import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserStreaks1773859200000 implements MigrationInterface {
  name = 'AddUserStreaks1773859200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "user_streaks" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "current_streak" integer NOT NULL DEFAULT 0,
        "longest_streak" integer NOT NULL DEFAULT 0,
        "last_activity_date" date,
        "streak_start_date" date,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_user_streaks" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_user_streaks_user_id" UNIQUE ("user_id")
      )
    `);

    await queryRunner.query(
      `ALTER TABLE "user_streaks" ADD CONSTRAINT "FK_user_streaks_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_user_streaks_user_id" ON "user_streaks" ("user_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "IDX_user_streaks_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_streaks" DROP CONSTRAINT "FK_user_streaks_user"`,
    );
    await queryRunner.query(`DROP TABLE "user_streaks"`);
  }
}
