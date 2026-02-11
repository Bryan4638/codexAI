import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateModulesLessonsExercises1770313121085 implements MigrationInterface {
    name = 'CreateModulesLessonsExercises1770313121085'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "modules" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "module_number" integer NOT NULL, "name" character varying NOT NULL, "description" text, "icon" character varying, "order" integer NOT NULL DEFAULT '0', "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_c6adfbd51775148bee80d6e4190" UNIQUE ("module_number"), CONSTRAINT "PK_7dbefd488bd96c5bf31f0ce0c95" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."exercises_type_enum" AS ENUM('code', 'quiz', 'dragDrop', 'fillBlank')`);
        await queryRunner.query(`CREATE TYPE "public"."exercises_difficulty_enum" AS ENUM('beginner', 'intermediate', 'advanced')`);
        await queryRunner.query(`CREATE TABLE "exercises" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."exercises_type_enum" NOT NULL, "difficulty" "public"."exercises_difficulty_enum" NOT NULL, "xp_reward" integer NOT NULL DEFAULT '10', "prompt" text NOT NULL, "data" jsonb NOT NULL, "order" integer NOT NULL DEFAULT '0', "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "lesson_id" uuid NOT NULL, CONSTRAINT "PK_c4c46f5fa89a58ba7c2d894e3c3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lessons" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text, "order" integer NOT NULL DEFAULT '0', "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "module_id" uuid NOT NULL, CONSTRAINT "PK_9b9a8d455cac672d262d7275730" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "exercises" ADD CONSTRAINT "FK_26718d98059c38459d2c64ec824" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lessons" ADD CONSTRAINT "FK_35fb2307535d90a6ed290af1f4a" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lessons" DROP CONSTRAINT "FK_35fb2307535d90a6ed290af1f4a"`);
        await queryRunner.query(`ALTER TABLE "exercises" DROP CONSTRAINT "FK_26718d98059c38459d2c64ec824"`);
        await queryRunner.query(`DROP TABLE "lessons"`);
        await queryRunner.query(`DROP TABLE "exercises"`);
        await queryRunner.query(`DROP TYPE "public"."exercises_difficulty_enum"`);
        await queryRunner.query(`DROP TYPE "public"."exercises_type_enum"`);
        await queryRunner.query(`DROP TABLE "modules"`);
    }

}
