import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUpdatedAtToUser1770745186048 implements MigrationInterface {
    name = 'AddUpdatedAtToUser1770745186048'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_at"`);
    }

}
