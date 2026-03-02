import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBestExecutionCode1772474553468 implements MigrationInterface {
    name = 'AddBestExecutionCode1772474553468'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_challenge_progress" ADD "best_execution_code" text`);
        await queryRunner.query(`ALTER TABLE "user_challenge_progress" DROP CONSTRAINT "FK_85a8e593e07f09680f5cf836d20"`);
        await queryRunner.query(`ALTER TABLE "user_challenge_progress" DROP CONSTRAINT "FK_c261d5c2360c03cf83a8459b8cb"`);
        await queryRunner.query(`ALTER TABLE "user_challenge_progress" DROP CONSTRAINT "UQ_1a638ffac29846274376b6d0ad6"`);
        await queryRunner.query(`ALTER TABLE "user_challenge_progress" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_challenge_progress" ALTER COLUMN "challenge_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_challenge_progress" ADD CONSTRAINT "UQ_1a638ffac29846274376b6d0ad6" UNIQUE ("user_id", "challenge_id")`);
        await queryRunner.query(`ALTER TABLE "user_challenge_progress" ADD CONSTRAINT "FK_85a8e593e07f09680f5cf836d20" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_challenge_progress" ADD CONSTRAINT "FK_c261d5c2360c03cf83a8459b8cb" FOREIGN KEY ("challenge_id") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_challenge_progress" DROP CONSTRAINT "FK_c261d5c2360c03cf83a8459b8cb"`);
        await queryRunner.query(`ALTER TABLE "user_challenge_progress" DROP CONSTRAINT "FK_85a8e593e07f09680f5cf836d20"`);
        await queryRunner.query(`ALTER TABLE "user_challenge_progress" DROP CONSTRAINT "UQ_1a638ffac29846274376b6d0ad6"`);
        await queryRunner.query(`ALTER TABLE "user_challenge_progress" ALTER COLUMN "challenge_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_challenge_progress" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_challenge_progress" ADD CONSTRAINT "UQ_1a638ffac29846274376b6d0ad6" UNIQUE ("challenge_id", "user_id")`);
        await queryRunner.query(`ALTER TABLE "user_challenge_progress" ADD CONSTRAINT "FK_c261d5c2360c03cf83a8459b8cb" FOREIGN KEY ("challenge_id") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_challenge_progress" ADD CONSTRAINT "FK_85a8e593e07f09680f5cf836d20" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_challenge_progress" DROP COLUMN "best_execution_code"`);
    }

}
