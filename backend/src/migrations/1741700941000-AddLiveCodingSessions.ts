import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLiveCodingSessions1741700941000 implements MigrationInterface {
    name = 'AddLiveCodingSessions1741700941000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "live_coding_sessions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "user_id" uuid NOT NULL,
                "challenge_id" uuid NOT NULL,
                "code" text,
                "time_taken_seconds" integer,
                "execution_time_ms" numeric(10,3),
                "score" integer NOT NULL DEFAULT 0,
                "tab_switches" integer NOT NULL DEFAULT 0,
                "paste_count" integer NOT NULL DEFAULT 0,
                "penalties_applied" integer NOT NULL DEFAULT 0,
                "all_tests_passed" boolean NOT NULL DEFAULT false,
                "started_at" TIMESTAMP NOT NULL DEFAULT now(),
                "completed_at" TIMESTAMP,
                CONSTRAINT "PK_live_coding_sessions" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`ALTER TABLE "live_coding_sessions" ADD CONSTRAINT "FK_live_coding_sessions_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "live_coding_sessions" ADD CONSTRAINT "FK_live_coding_sessions_challenge" FOREIGN KEY ("challenge_id") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`CREATE INDEX "IDX_live_coding_sessions_user_id" ON "live_coding_sessions" ("user_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_live_coding_sessions_challenge_id" ON "live_coding_sessions" ("challenge_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_live_coding_sessions_challenge_id"`);
        await queryRunner.query(`DROP INDEX "IDX_live_coding_sessions_user_id"`);
        await queryRunner.query(`ALTER TABLE "live_coding_sessions" DROP CONSTRAINT "FK_live_coding_sessions_challenge"`);
        await queryRunner.query(`ALTER TABLE "live_coding_sessions" DROP CONSTRAINT "FK_live_coding_sessions_user"`);
        await queryRunner.query(`DROP TABLE "live_coding_sessions"`);
    }
}
