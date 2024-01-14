import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CropTable1705271444140 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'crop',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'userId',
                    type: 'int',
                },
                {
                    name: 'cropTypeId',
                    type: 'varchar',
                },
                {
                    name: 'soilTypeId',
                    type: 'varchar',
                },
                {
                    name: 'cicle',
                    type: 'varchar',
                },
                {
                    name: 'saturationPoint',
                    type: 'double',
                },
                {
                    name: 'tempIrrigationControl',
                    type: 'double',
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP(6)',
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP(6)',
                    onUpdate: 'CURRENT_TIMESTAMP(6)',
                },
                {
                    name: 'deleted_at',
                    type: 'timestamp',
                    isNullable: true,
                },
            ]
        }))

        await queryRunner.createForeignKey('crop', new TableForeignKey({
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('user');
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('userId') !== -1);
        await queryRunner.dropForeignKey('crop', foreignKey);
        await queryRunner.dropTable('crop');
    }

}
