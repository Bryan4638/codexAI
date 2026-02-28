import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddExerciseTests1771024198000 implements MigrationInterface {
  name = 'AddExerciseTests1771024198000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "exercise_tests" (
        "id"              uuid        NOT NULL DEFAULT uuid_generate_v4(),
        "exercise_id"     uuid        NOT NULL,
        "description"     character varying NOT NULL,
        "input"           text,
        "expected_output" text        NOT NULL,
        "is_hidden"       boolean     NOT NULL DEFAULT false,
        "order"           integer     NOT NULL DEFAULT 0,
        "created_at"      TIMESTAMP   NOT NULL DEFAULT now(),
        "updated_at"      TIMESTAMP   NOT NULL DEFAULT now(),
        CONSTRAINT "PK_exercise_tests" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_exercise_tests_exercise_id"
      ON "exercise_tests" ("exercise_id")
    `);

    await queryRunner.query(`
      ALTER TABLE "exercise_tests"
        ADD CONSTRAINT "FK_exercise_tests_exercise_id"
        FOREIGN KEY ("exercise_id")
        REFERENCES "exercises"("id")
        ON DELETE CASCADE
        ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "exercise_tests" DROP CONSTRAINT "FK_exercise_tests_exercise_id"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_exercise_tests_exercise_id"`);
    await queryRunner.query(`DROP TABLE "exercise_tests"`);
  }
}
