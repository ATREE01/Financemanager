import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateStockHistory1761037325582 implements MigrationInterface {
  name = 'UpdateStockHistory1761037325582';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_7b1bda2a1ba6446b64d7c0fca1\` ON \`Categories\``,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_bdc089edde34267d32c98e4d2b\` ON \`Categories\` (\`name\`, \`type\`, \`userId\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_39411aa198ce6f933136d86d8d\` ON \`StockHistory\` (\`stockId\`, \`year\`, \`week\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_39411aa198ce6f933136d86d8d\` ON \`StockHistory\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_bdc089edde34267d32c98e4d2b\` ON \`Categories\``,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_7b1bda2a1ba6446b64d7c0fca1\` ON \`Categories\` (\`name\`, \`userId\`)`,
    );
  }
}
