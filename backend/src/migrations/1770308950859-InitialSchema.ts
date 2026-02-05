import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1770308950859 implements MigrationInterface {
    name = 'InitialSchema1770308950859'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reactions" DROP CONSTRAINT "FK_dde6062145a93649adc5af3946e"`);
        await queryRunner.query(`ALTER TABLE "reactions" DROP CONSTRAINT "FK_8b1cc425a952c6b172731d43275"`);
        await queryRunner.query(`ALTER TABLE "user_progress" DROP CONSTRAINT "FK_c41601eeb8415a9eb15c8a4e557"`);
        await queryRunner.query(`ALTER TABLE "user_badges" DROP CONSTRAINT "FK_f1221d9b1aaa64b1f3c98ed46d3"`);
        await queryRunner.query(`ALTER TABLE "challenges" DROP COLUMN "test_cases"`);
        await queryRunner.query(`ALTER TABLE "challenges" ADD "test_cases" jsonb NOT NULL DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "reactions" ADD CONSTRAINT "FK_dde6062145a93649adc5af3946e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reactions" ADD CONSTRAINT "FK_8b1cc425a952c6b172731d43275" FOREIGN KEY ("challenge_id") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_progress" ADD CONSTRAINT "FK_c41601eeb8415a9eb15c8a4e557" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_badges" ADD CONSTRAINT "FK_f1221d9b1aaa64b1f3c98ed46d3" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_badges" DROP CONSTRAINT "FK_f1221d9b1aaa64b1f3c98ed46d3"`);
        await queryRunner.query(`ALTER TABLE "user_progress" DROP CONSTRAINT "FK_c41601eeb8415a9eb15c8a4e557"`);
        await queryRunner.query(`ALTER TABLE "reactions" DROP CONSTRAINT "FK_8b1cc425a952c6b172731d43275"`);
        await queryRunner.query(`ALTER TABLE "reactions" DROP CONSTRAINT "FK_dde6062145a93649adc5af3946e"`);
        await queryRunner.query(`ALTER TABLE "challenges" DROP COLUMN "test_cases"`);
        await queryRunner.query(`ALTER TABLE "challenges" ADD "test_cases" json NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_badges" ADD CONSTRAINT "FK_f1221d9b1aaa64b1f3c98ed46d3" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_progress" ADD CONSTRAINT "FK_c41601eeb8415a9eb15c8a4e557" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reactions" ADD CONSTRAINT "FK_8b1cc425a952c6b172731d43275" FOREIGN KEY ("challenge_id") REFERENCES "challenges"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reactions" ADD CONSTRAINT "FK_dde6062145a93649adc5af3946e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
