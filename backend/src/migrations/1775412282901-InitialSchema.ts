import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1775412282901 implements MigrationInterface {
    name = 'InitialSchema1775412282901'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "weekly_xp" DROP CONSTRAINT "FK_weekly_xp_user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_user_streaks_user_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_weekly_xp_week"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_daily_activity_user_date"`);
        await queryRunner.query(`ALTER TABLE "weekly_xp" DROP CONSTRAINT "UQ_weekly_xp_user_week"`);
        await queryRunner.query(`ALTER TABLE "daily_activity" DROP CONSTRAINT "UQ_daily_activity_user_date"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "league" character varying NOT NULL DEFAULT 'bronze'`);
        await queryRunner.query(`ALTER TABLE "weekly_xp" ADD CONSTRAINT "UQ_3c414683b44c24cad15a1c16697" UNIQUE ("user_id", "week_start")`);
        await queryRunner.query(`ALTER TABLE "daily_activity" ADD CONSTRAINT "UQ_a5dd8fd9da32417ccc1303fba32" UNIQUE ("user_id", "activity_date")`);
        // Clean orphaned rows before adding FK constraints
        await queryRunner.query(`DELETE FROM "user_streaks" WHERE "user_id" NOT IN (SELECT "id" FROM "users")`);
        await queryRunner.query(`DELETE FROM "weekly_xp" WHERE "user_id" NOT IN (SELECT "id" FROM "users")`);
        await queryRunner.query(`DELETE FROM "live_coding_sessions" WHERE "user_id" NOT IN (SELECT "id" FROM "users")`);
        await queryRunner.query(`DELETE FROM "live_coding_sessions" WHERE "challenge_id" NOT IN (SELECT "id" FROM "challenges")`);
        await queryRunner.query(`DELETE FROM "daily_activity" WHERE "user_id" NOT IN (SELECT "id" FROM "users")`);
        await queryRunner.query(`ALTER TABLE "user_streaks" ADD CONSTRAINT "FK_91fc9bfd912d8ce3ae4be2ea193" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "weekly_xp" ADD CONSTRAINT "FK_8eec1f5cf9882532ea74d7fcef3" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "live_coding_sessions" ADD CONSTRAINT "FK_964e840a3e866659939552104d3" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "live_coding_sessions" ADD CONSTRAINT "FK_e244b75ae49234835b3d677b3f5" FOREIGN KEY ("challenge_id") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "daily_activity" ADD CONSTRAINT "FK_5fa56b38b090b21d1ef94544b91" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "daily_activity" DROP CONSTRAINT "FK_5fa56b38b090b21d1ef94544b91"`);
        await queryRunner.query(`ALTER TABLE "live_coding_sessions" DROP CONSTRAINT "FK_e244b75ae49234835b3d677b3f5"`);
        await queryRunner.query(`ALTER TABLE "live_coding_sessions" DROP CONSTRAINT "FK_964e840a3e866659939552104d3"`);
        await queryRunner.query(`ALTER TABLE "weekly_xp" DROP CONSTRAINT "FK_8eec1f5cf9882532ea74d7fcef3"`);
        await queryRunner.query(`ALTER TABLE "user_streaks" DROP CONSTRAINT "FK_91fc9bfd912d8ce3ae4be2ea193"`);
        await queryRunner.query(`ALTER TABLE "daily_activity" DROP CONSTRAINT "UQ_a5dd8fd9da32417ccc1303fba32"`);
        await queryRunner.query(`ALTER TABLE "weekly_xp" DROP CONSTRAINT "UQ_3c414683b44c24cad15a1c16697"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "league"`);
        await queryRunner.query(`ALTER TABLE "daily_activity" ADD CONSTRAINT "UQ_daily_activity_user_date" UNIQUE ("activity_date", "user_id")`);
        await queryRunner.query(`ALTER TABLE "weekly_xp" ADD CONSTRAINT "UQ_weekly_xp_user_week" UNIQUE ("user_id", "week_start")`);
        await queryRunner.query(`CREATE INDEX "IDX_daily_activity_user_date" ON "daily_activity" ("activity_date", "user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_weekly_xp_week" ON "weekly_xp" ("week_start", "xp_earned") `);
        await queryRunner.query(`CREATE INDEX "IDX_user_streaks_user_id" ON "user_streaks" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "weekly_xp" ADD CONSTRAINT "FK_weekly_xp_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
