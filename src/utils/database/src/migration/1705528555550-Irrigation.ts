import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class Irrigation1705528555550 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'irrigation',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'cropId',
                    type: 'int',
                },
                {
                    name: 'executionHour',
                    type: 'time',
                },
                {
                    name: 'status',
                    type: 'boolean',
                },
            ]
        }))

        await queryRunner.createForeignKey('irrigation', new TableForeignKey({
            columnNames: ['cropId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'crop',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
