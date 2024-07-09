import { MigrationInterface, QueryRunner } from "typeorm";

export class Workspaces1720555127000 implements MigrationInterface {
    name = 'Workspaces1720555127000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "workspaces" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying(255) NOT NULL, "logoUrl" character varying, CONSTRAINT "UQ_de659ece27e93d8fe29339d0a42" UNIQUE ("name"), CONSTRAINT "PK_098656ae401f3e1a4586f47fd8e" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "workspaces"`);
    }

}
