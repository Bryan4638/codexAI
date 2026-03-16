import { MigrationInterface, QueryRunner } from "typeorm";

export class RenamePasteCountToCopyPasteCount1773248520910 implements MigrationInterface {
    name = 'RenamePasteCountToCopyPasteCount1773248520910'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "live_coding_sessions" DROP CONSTRAINT "FK_live_coding_sessions_user"`);
        await queryRunner.query(`ALTER TABLE "live_coding_sessions" DROP CONSTRAINT "FK_live_coding_sessions_challenge"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_live_coding_sessions_user_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_live_coding_sessions_challenge_id"`);
        await queryRunner.query(`ALTER TABLE "live_coding_sessions" RENAME COLUMN "paste_count" TO "copy_paste_count"`);
        await queryRunner.query(`ALTER TABLE "live_coding_sessions" ADD CONSTRAINT "FK_964e840a3e866659939552104d3" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "live_coding_sessions" ADD CONSTRAINT "FK_e244b75ae49234835b3d677b3f5" FOREIGN KEY ("challenge_id") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "live_coding_sessions" DROP CONSTRAINT "FK_e244b75ae49234835b3d677b3f5"`);
        await queryRunner.query(`ALTER TABLE "live_coding_sessions" DROP CONSTRAINT "FK_964e840a3e866659939552104d3"`);
        await queryRunner.query(`ALTER TABLE "live_coding_sessions" RENAME COLUMN "copy_paste_count" TO "paste_count"`);
        await queryRunner.query(`CREATE INDEX "IDX_live_coding_sessions_challenge_id" ON "live_coding_sessions" ("challenge_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_live_coding_sessions_user_id" ON "live_coding_sessions" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "live_coding_sessions" ADD CONSTRAINT "FK_live_coding_sessions_challenge" FOREIGN KEY ("challenge_id") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "live_coding_sessions" ADD CONSTRAINT "FK_live_coding_sessions_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
