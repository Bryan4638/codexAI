import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1772567559255 implements MigrationInterface {
    name = 'InitialSchema1772567559255'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "modules" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "module_number" integer NOT NULL, "name" character varying NOT NULL, "description" text, "icon" character varying, "order" integer NOT NULL DEFAULT '0', "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_c6adfbd51775148bee80d6e4190" UNIQUE ("module_number"), CONSTRAINT "PK_7dbefd488bd96c5bf31f0ce0c95" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."exercises_type_enum" AS ENUM('code', 'quiz', 'dragDrop', 'fillBlank')`);
        await queryRunner.query(`CREATE TYPE "public"."exercises_difficulty_enum" AS ENUM('beginner', 'intermediate', 'advanced')`);
        await queryRunner.query(`CREATE TABLE "exercises" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."exercises_type_enum" NOT NULL, "difficulty" "public"."exercises_difficulty_enum" NOT NULL, "xp_reward" integer NOT NULL DEFAULT '10', "prompt" text NOT NULL, "data" jsonb NOT NULL, "order" integer NOT NULL DEFAULT '0', "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "lesson_id" uuid NOT NULL, CONSTRAINT "PK_c4c46f5fa89a58ba7c2d894e3c3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "challenge_tests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying NOT NULL, "input" text, "expected_output" text NOT NULL, "is_hidden" boolean NOT NULL DEFAULT false, "order" integer NOT NULL DEFAULT '0', "challenge_id" uuid, CONSTRAINT "PK_5131baa91c1ea81e92771fcdab9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_progress" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "exercise_id" uuid NOT NULL, "completed_at" TIMESTAMP NOT NULL DEFAULT now(), "attempts" integer NOT NULL DEFAULT '1', CONSTRAINT "UQ_0dbc19d0e80ff069fd5ceea2d1a" UNIQUE ("user_id", "exercise_id"), CONSTRAINT "PK_7b5eb2436efb0051fdf05cbe839" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_badges" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "badge_id" character varying NOT NULL, "unlocked_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_201b6e34825dc5bd06181320bde" UNIQUE ("user_id", "badge_id"), CONSTRAINT "PK_0ca139216824d745a930065706a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "email" character varying NOT NULL, "authProvider" character varying, "providerId" character varying, "avatar" character varying, "xp" integer NOT NULL DEFAULT '0', "level" integer NOT NULL DEFAULT '1', "is_public" boolean NOT NULL DEFAULT true, "bio" character varying, "github" character varying, "linkedin" character varying, "twitter" character varying, "website" character varying, "avatar_url" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_challenge_progress" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "completed_at" TIMESTAMP NOT NULL DEFAULT now(), "best_execution_time_ms" numeric(10,3), "best_execution_code" text, "attempts" integer NOT NULL DEFAULT '1', "user_id" uuid, "challenge_id" uuid, CONSTRAINT "UQ_1a638ffac29846274376b6d0ad6" UNIQUE ("user_id", "challenge_id"), CONSTRAINT "PK_1e0e12fc9b849b6a125348acd70" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "challenges" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "initial_code" character varying NOT NULL, "test_cases" jsonb NOT NULL DEFAULT '[]', "difficulty" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "author_id" uuid NOT NULL, CONSTRAINT "PK_1e664e93171e20fe4d6125466af" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "challenge_id" uuid NOT NULL, "type" character varying NOT NULL DEFAULT 'LIKE', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_46905d3d701eb4ec2c14cac81c9" UNIQUE ("user_id", "challenge_id"), CONSTRAINT "PK_0b213d460d0c473bc2fb6ee27f3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lessons" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text, "order" integer NOT NULL DEFAULT '0', "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "module_id" uuid NOT NULL, CONSTRAINT "PK_9b9a8d455cac672d262d7275730" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "refresh_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tokenHash" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "email_codes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "codeHash" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "used" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6ed15013da989317f69306da6e3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "exercises" ADD CONSTRAINT "FK_26718d98059c38459d2c64ec824" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "challenge_tests" ADD CONSTRAINT "FK_6608df60333af3faae08991e1cf" FOREIGN KEY ("challenge_id") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_progress" ADD CONSTRAINT "FK_c41601eeb8415a9eb15c8a4e557" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_badges" ADD CONSTRAINT "FK_f1221d9b1aaa64b1f3c98ed46d3" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_challenge_progress" ADD CONSTRAINT "FK_85a8e593e07f09680f5cf836d20" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_challenge_progress" ADD CONSTRAINT "FK_c261d5c2360c03cf83a8459b8cb" FOREIGN KEY ("challenge_id") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "challenges" ADD CONSTRAINT "FK_5afdb3ba1bc453064d77a1e885c" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reactions" ADD CONSTRAINT "FK_dde6062145a93649adc5af3946e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reactions" ADD CONSTRAINT "FK_8b1cc425a952c6b172731d43275" FOREIGN KEY ("challenge_id") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lessons" ADD CONSTRAINT "FK_35fb2307535d90a6ed290af1f4a" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_610102b60fea1455310ccd299de" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_610102b60fea1455310ccd299de"`);
        await queryRunner.query(`ALTER TABLE "lessons" DROP CONSTRAINT "FK_35fb2307535d90a6ed290af1f4a"`);
        await queryRunner.query(`ALTER TABLE "reactions" DROP CONSTRAINT "FK_8b1cc425a952c6b172731d43275"`);
        await queryRunner.query(`ALTER TABLE "reactions" DROP CONSTRAINT "FK_dde6062145a93649adc5af3946e"`);
        await queryRunner.query(`ALTER TABLE "challenges" DROP CONSTRAINT "FK_5afdb3ba1bc453064d77a1e885c"`);
        await queryRunner.query(`ALTER TABLE "user_challenge_progress" DROP CONSTRAINT "FK_c261d5c2360c03cf83a8459b8cb"`);
        await queryRunner.query(`ALTER TABLE "user_challenge_progress" DROP CONSTRAINT "FK_85a8e593e07f09680f5cf836d20"`);
        await queryRunner.query(`ALTER TABLE "user_badges" DROP CONSTRAINT "FK_f1221d9b1aaa64b1f3c98ed46d3"`);
        await queryRunner.query(`ALTER TABLE "user_progress" DROP CONSTRAINT "FK_c41601eeb8415a9eb15c8a4e557"`);
        await queryRunner.query(`ALTER TABLE "challenge_tests" DROP CONSTRAINT "FK_6608df60333af3faae08991e1cf"`);
        await queryRunner.query(`ALTER TABLE "exercises" DROP CONSTRAINT "FK_26718d98059c38459d2c64ec824"`);
        await queryRunner.query(`DROP TABLE "email_codes"`);
        await queryRunner.query(`DROP TABLE "refresh_tokens"`);
        await queryRunner.query(`DROP TABLE "lessons"`);
        await queryRunner.query(`DROP TABLE "reactions"`);
        await queryRunner.query(`DROP TABLE "challenges"`);
        await queryRunner.query(`DROP TABLE "user_challenge_progress"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "user_badges"`);
        await queryRunner.query(`DROP TABLE "user_progress"`);
        await queryRunner.query(`DROP TABLE "challenge_tests"`);
        await queryRunner.query(`DROP TABLE "exercises"`);
        await queryRunner.query(`DROP TYPE "public"."exercises_difficulty_enum"`);
        await queryRunner.query(`DROP TYPE "public"."exercises_type_enum"`);
        await queryRunner.query(`DROP TABLE "modules"`);
    }

}
