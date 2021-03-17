import {MigrationInterface, QueryRunner} from "typeorm";

export class createVoteTable1614893743014 implements MigrationInterface {
    name = 'createVoteTable1614893743014'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vote" DROP CONSTRAINT "FK_43cc1af57676ac1b7ec774bd10f"`);
        await queryRunner.query(`ALTER TABLE "vote" DROP CONSTRAINT "FK_ad37adcff60fdb9670a97868ab1"`);
        await queryRunner.query(`ALTER TABLE "vote" ALTER COLUMN "postId" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "vote"."postId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "vote" ALTER COLUMN "commentId" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "vote"."commentId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "vote" ADD CONSTRAINT "FK_43cc1af57676ac1b7ec774bd10f" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vote" ADD CONSTRAINT "FK_ad37adcff60fdb9670a97868ab1" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vote" DROP CONSTRAINT "FK_ad37adcff60fdb9670a97868ab1"`);
        await queryRunner.query(`ALTER TABLE "vote" DROP CONSTRAINT "FK_43cc1af57676ac1b7ec774bd10f"`);
        await queryRunner.query(`COMMENT ON COLUMN "vote"."commentId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "vote" ALTER COLUMN "commentId" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "vote"."postId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "vote" ALTER COLUMN "postId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vote" ADD CONSTRAINT "FK_ad37adcff60fdb9670a97868ab1" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vote" ADD CONSTRAINT "FK_43cc1af57676ac1b7ec774bd10f" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
