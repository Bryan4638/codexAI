import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactorTestsToChallenges1772300741368 implements MigrationInterface {
    name = 'RefactorTestsToChallenges1772300741368'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "challenge_tests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying NOT NULL, "input" text, "expected_output" text NOT NULL, "is_hidden" boolean NOT NULL DEFAULT false, "order" integer NOT NULL DEFAULT '0', "challenge_id" uuid, CONSTRAINT "PK_5131baa91c1ea81e92771fcdab9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_challenge_progress" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "challenge_id" uuid NOT NULL, "completed_at" TIMESTAMP NOT NULL DEFAULT now(), "best_execution_time_ms" numeric(10,3), "attempts" integer NOT NULL DEFAULT '1', CONSTRAINT "UQ_1a638ffac29846274376b6d0ad6" UNIQUE ("user_id", "challenge_id"), CONSTRAINT "PK_1e0e12fc9b849b6a125348acd70" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_progress" DROP COLUMN "best_execution_time_ms"`);
        await queryRunner.query(`ALTER TABLE "challenge_tests" ADD CONSTRAINT "FK_6608df60333af3faae08991e1cf" FOREIGN KEY ("challenge_id") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_challenge_progress" ADD CONSTRAINT "FK_85a8e593e07f09680f5cf836d20" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_challenge_progress" ADD CONSTRAINT "FK_c261d5c2360c03cf83a8459b8cb" FOREIGN KEY ("challenge_id") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_challenge_progress" DROP CONSTRAINT "FK_c261d5c2360c03cf83a8459b8cb"`);
        await queryRunner.query(`ALTER TABLE "user_challenge_progress" DROP CONSTRAINT "FK_85a8e593e07f09680f5cf836d20"`);
        await queryRunner.query(`ALTER TABLE "challenge_tests" DROP CONSTRAINT "FK_6608df60333af3faae08991e1cf"`);
        await queryRunner.query(`ALTER TABLE "user_progress" ADD "best_execution_time_ms" numeric(10,3)`);
        await queryRunner.query(`DROP TABLE "user_challenge_progress"`);
        await queryRunner.query(`DROP TABLE "challenge_tests"`);
    }

}
