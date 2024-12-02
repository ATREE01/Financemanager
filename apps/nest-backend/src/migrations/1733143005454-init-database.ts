import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDatabase1733143005454 implements MigrationInterface {
  name = 'InitDatabase1733143005454';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`TimeDepositRecords\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`amount\` int NOT NULL, \`interestRate\` varchar(255) NOT NULL, \`startDate\` date NOT NULL, \`endDate\` date NOT NULL, \`userId\` uuid NULL, \`bankId\` uuid NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`StockBuyRecords\` (\`id\` int NOT NULL AUTO_INCREMENT, \`date\` date NOT NULL, \`buyMethod\` varchar(255) NOT NULL, \`shareNumber\` decimal(12,6) NOT NULL, \`charge\` decimal(10,2) NOT NULL, \`amount\` decimal(12,2) NOT NULL, \`note\` text NULL, \`stockRecordId\` int NULL, \`bankId\` uuid NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`UserStock\` (\`id\` uuid NOT NULL, \`name\` varchar(255) NOT NULL, \`userId\` uuid NULL, \`stockId\` uuid NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`StockReocrds\` (\`id\` int NOT NULL AUTO_INCREMENT, \`buyPrice\` decimal(12,6) NOT NULL, \`buyExchangeRate\` decimal(8,4) NOT NULL, \`userId\` uuid NULL, \`brokerageFirmId\` uuid NULL, \`userStockId\` uuid NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`StockSellRecord\` (\`id\` int NOT NULL AUTO_INCREMENT, \`date\` date NOT NULL, \`shareNumber\` decimal(12,6) NOT NULL, \`stockRecordId\` int NULL, \`stockBundleSellRecordId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`StockBundleSellRecords\` (\`id\` int NOT NULL AUTO_INCREMENT, \`date\` date NOT NULL, \`sellPrice\` decimal(12,6) NOT NULL, \`sellExchangeRate\` decimal(8,4) NOT NULL, \`charge\` decimal(10,2) NOT NULL, \`tax\` decimal(10,2) NOT NULL, \`amount\` decimal(12,2) NOT NULL, \`note\` text NULL, \`userId\` uuid NULL, \`bankId\` uuid NULL, \`brokerageFirmId\` uuid NULL, \`userStockId\` uuid NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`BrokerageFirm\` (\`id\` uuid NOT NULL, \`name\` varchar(255) NOT NULL, \`order\` int NOT NULL, \`userId\` uuid NULL, \`transactionCurrencyId\` int NULL, \`settlementCurrencyId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`Categories\` (\`id\` uuid NOT NULL, \`type\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`order\` int NOT NULL, \`userId\` uuid NULL, UNIQUE INDEX \`IDX_7b1bda2a1ba6446b64d7c0fca1\` (\`name\`, \`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`CurrencyTransactionRecord\` (\`id\` int NOT NULL AUTO_INCREMENT, \`date\` date NOT NULL, \`type\` varchar(255) NOT NULL, \`fromAmount\` int NOT NULL, \`toAmount\` int NOT NULL, \`exchangeRate\` float NOT NULL, \`charge\` int NOT NULL, \`userId\` uuid NULL, \`fromBankId\` uuid NULL, \`toBankId\` uuid NULL, \`fromCurrencyId\` int NULL, \`toCurrencyId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`UserCurrencies\` (\`id\` uuid NOT NULL, \`currencyId\` int NULL, \`userId\` uuid NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`IncExpRecords\` (\`id\` int NOT NULL AUTO_INCREMENT, \`date\` date NOT NULL, \`type\` varchar(255) NOT NULL, \`amount\` int NOT NULL, \`method\` varchar(255) NOT NULL, \`charge\` int NULL, \`note\` text NULL, \`userId\` uuid NULL, \`categoryId\` uuid NULL, \`currencyId\` int NULL, \`bankId\` uuid NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`profiles\` (\`id\` uuid NOT NULL, \`username\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`userId\` uuid NULL, UNIQUE INDEX \`IDX_5b49bd22c967ce2829ca8f1772\` (\`email\`), UNIQUE INDEX \`REL_315ecd98bd1a42dcf2ec4e2e98\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`Users\` (\`id\` uuid NOT NULL, \`hashedPassword\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`BankRecords\` (\`id\` int NOT NULL AUTO_INCREMENT, \`type\` varchar(255) NOT NULL, \`date\` date NOT NULL, \`amount\` int NOT NULL, \`charge\` int NULL, \`note\` text NULL, \`userId\` uuid NULL, \`bankId\` uuid NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`Banks\` (\`id\` uuid NOT NULL, \`name\` varchar(255) NOT NULL, \`order\` int NOT NULL, \`currencyId\` int NULL, \`userId\` uuid NULL, UNIQUE INDEX \`IDX_201ffeac3ca3571cffdb85fe22\` (\`name\`, \`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`Currencies\` (\`id\` int NOT NULL AUTO_INCREMENT, \`code\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`exchangeRate\` float NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`StockHistory\` (\`id\` int NOT NULL AUTO_INCREMENT, \`date\` date NOT NULL, \`year\` int NOT NULL, \`week\` int NOT NULL, \`close\` decimal(12,6) NOT NULL, \`stockId\` uuid NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`Stock\` (\`id\` uuid NOT NULL, \`code\` varchar(255) NOT NULL, \`close\` decimal(12,6) NOT NULL, \`currencyId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`TimeDepositRecords\` ADD CONSTRAINT \`FK_eb3b721986e44c43d6803bd3eb4\` FOREIGN KEY (\`userId\`) REFERENCES \`Users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`TimeDepositRecords\` ADD CONSTRAINT \`FK_bc0828afa046ab9a62aa1241568\` FOREIGN KEY (\`bankId\`) REFERENCES \`Banks\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`StockBuyRecords\` ADD CONSTRAINT \`FK_8571376f3f31348cf6f1d0ab7db\` FOREIGN KEY (\`stockRecordId\`) REFERENCES \`StockReocrds\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`StockBuyRecords\` ADD CONSTRAINT \`FK_8bbeb7218f401ac45c4de73155a\` FOREIGN KEY (\`bankId\`) REFERENCES \`Banks\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`UserStock\` ADD CONSTRAINT \`FK_4abddab87258efb97fe7f0697b4\` FOREIGN KEY (\`userId\`) REFERENCES \`Users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`UserStock\` ADD CONSTRAINT \`FK_47f0bbec9fd94cb9904a600a329\` FOREIGN KEY (\`stockId\`) REFERENCES \`Stock\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`StockReocrds\` ADD CONSTRAINT \`FK_d8e6525aeebbdf5522c311cb1bd\` FOREIGN KEY (\`userId\`) REFERENCES \`Users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`StockReocrds\` ADD CONSTRAINT \`FK_cd458de931303f86b1b99bfa189\` FOREIGN KEY (\`brokerageFirmId\`) REFERENCES \`BrokerageFirm\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`StockReocrds\` ADD CONSTRAINT \`FK_d12343f20d0ac200fe68ab8225a\` FOREIGN KEY (\`userStockId\`) REFERENCES \`UserStock\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`StockSellRecord\` ADD CONSTRAINT \`FK_6e4899f0241f5cda55ada678dae\` FOREIGN KEY (\`stockRecordId\`) REFERENCES \`StockReocrds\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`StockSellRecord\` ADD CONSTRAINT \`FK_0a6cac892ef83014e2aa3d45cca\` FOREIGN KEY (\`stockBundleSellRecordId\`) REFERENCES \`StockBundleSellRecords\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`StockBundleSellRecords\` ADD CONSTRAINT \`FK_e754e14d87ca4a8a8b052b1c2b2\` FOREIGN KEY (\`userId\`) REFERENCES \`Users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`StockBundleSellRecords\` ADD CONSTRAINT \`FK_7b88c2cd0563865bc3eb6bdc08c\` FOREIGN KEY (\`bankId\`) REFERENCES \`Banks\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`StockBundleSellRecords\` ADD CONSTRAINT \`FK_e53fa1624cf1a50b722ff4c754f\` FOREIGN KEY (\`brokerageFirmId\`) REFERENCES \`BrokerageFirm\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`StockBundleSellRecords\` ADD CONSTRAINT \`FK_383da49f098a582a22a3a1d0c94\` FOREIGN KEY (\`userStockId\`) REFERENCES \`UserStock\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`BrokerageFirm\` ADD CONSTRAINT \`FK_9ff7ce1d9fe357c698224666e7b\` FOREIGN KEY (\`userId\`) REFERENCES \`Users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`BrokerageFirm\` ADD CONSTRAINT \`FK_ec856ba28de02dfdd6c92ef3bb4\` FOREIGN KEY (\`transactionCurrencyId\`) REFERENCES \`Currencies\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`BrokerageFirm\` ADD CONSTRAINT \`FK_2490780e25b98e6d46c8c84e249\` FOREIGN KEY (\`settlementCurrencyId\`) REFERENCES \`Currencies\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Categories\` ADD CONSTRAINT \`FK_8111f8d3e5f088377ee14b36a9f\` FOREIGN KEY (\`userId\`) REFERENCES \`Users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`CurrencyTransactionRecord\` ADD CONSTRAINT \`FK_c6edce0801e1d368111ebbb91a4\` FOREIGN KEY (\`userId\`) REFERENCES \`Users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`CurrencyTransactionRecord\` ADD CONSTRAINT \`FK_e5177fa2baf1993260b01b5f434\` FOREIGN KEY (\`fromBankId\`) REFERENCES \`Banks\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`CurrencyTransactionRecord\` ADD CONSTRAINT \`FK_0435a15288b16300bced7681f20\` FOREIGN KEY (\`toBankId\`) REFERENCES \`Banks\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`CurrencyTransactionRecord\` ADD CONSTRAINT \`FK_7e159cb75e1a7d35995c85aa290\` FOREIGN KEY (\`fromCurrencyId\`) REFERENCES \`Currencies\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`CurrencyTransactionRecord\` ADD CONSTRAINT \`FK_b42e94fbd5b051d56c2c858af27\` FOREIGN KEY (\`toCurrencyId\`) REFERENCES \`Currencies\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`UserCurrencies\` ADD CONSTRAINT \`FK_d489bc2ce9e5343629ff3e1a828\` FOREIGN KEY (\`currencyId\`) REFERENCES \`Currencies\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`UserCurrencies\` ADD CONSTRAINT \`FK_14aa6436a60c135d4018f590184\` FOREIGN KEY (\`userId\`) REFERENCES \`Users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`IncExpRecords\` ADD CONSTRAINT \`FK_55974802837a4d90f6e21698bc1\` FOREIGN KEY (\`userId\`) REFERENCES \`Users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`IncExpRecords\` ADD CONSTRAINT \`FK_cd29b84f22d916b065cc61e11b3\` FOREIGN KEY (\`categoryId\`) REFERENCES \`Categories\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`IncExpRecords\` ADD CONSTRAINT \`FK_a1b4bc633371afcf3180603f265\` FOREIGN KEY (\`currencyId\`) REFERENCES \`Currencies\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`IncExpRecords\` ADD CONSTRAINT \`FK_364d7d7b183b695c18babc35d11\` FOREIGN KEY (\`bankId\`) REFERENCES \`Banks\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`profiles\` ADD CONSTRAINT \`FK_315ecd98bd1a42dcf2ec4e2e985\` FOREIGN KEY (\`userId\`) REFERENCES \`Users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`BankRecords\` ADD CONSTRAINT \`FK_e8d32f04aa20e74897f2db3f233\` FOREIGN KEY (\`userId\`) REFERENCES \`Users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`BankRecords\` ADD CONSTRAINT \`FK_b43fa0ea0feb3b7c3a5b49210c3\` FOREIGN KEY (\`bankId\`) REFERENCES \`Banks\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Banks\` ADD CONSTRAINT \`FK_6895fcc3f9d54c0f240bf5c4b85\` FOREIGN KEY (\`currencyId\`) REFERENCES \`Currencies\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Banks\` ADD CONSTRAINT \`FK_225555a34975f3a61b77e3fb888\` FOREIGN KEY (\`userId\`) REFERENCES \`Users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`StockHistory\` ADD CONSTRAINT \`FK_f8b53b5fffb7b767cb52bba5f4b\` FOREIGN KEY (\`stockId\`) REFERENCES \`Stock\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Stock\` ADD CONSTRAINT \`FK_4930817d58fcfa92134eafacb8b\` FOREIGN KEY (\`currencyId\`) REFERENCES \`Currencies\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Stock\` DROP FOREIGN KEY \`FK_4930817d58fcfa92134eafacb8b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`StockHistory\` DROP FOREIGN KEY \`FK_f8b53b5fffb7b767cb52bba5f4b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Banks\` DROP FOREIGN KEY \`FK_225555a34975f3a61b77e3fb888\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Banks\` DROP FOREIGN KEY \`FK_6895fcc3f9d54c0f240bf5c4b85\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`BankRecords\` DROP FOREIGN KEY \`FK_b43fa0ea0feb3b7c3a5b49210c3\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`BankRecords\` DROP FOREIGN KEY \`FK_e8d32f04aa20e74897f2db3f233\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`profiles\` DROP FOREIGN KEY \`FK_315ecd98bd1a42dcf2ec4e2e985\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`IncExpRecords\` DROP FOREIGN KEY \`FK_364d7d7b183b695c18babc35d11\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`IncExpRecords\` DROP FOREIGN KEY \`FK_a1b4bc633371afcf3180603f265\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`IncExpRecords\` DROP FOREIGN KEY \`FK_cd29b84f22d916b065cc61e11b3\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`IncExpRecords\` DROP FOREIGN KEY \`FK_55974802837a4d90f6e21698bc1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`UserCurrencies\` DROP FOREIGN KEY \`FK_14aa6436a60c135d4018f590184\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`UserCurrencies\` DROP FOREIGN KEY \`FK_d489bc2ce9e5343629ff3e1a828\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`CurrencyTransactionRecord\` DROP FOREIGN KEY \`FK_b42e94fbd5b051d56c2c858af27\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`CurrencyTransactionRecord\` DROP FOREIGN KEY \`FK_7e159cb75e1a7d35995c85aa290\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`CurrencyTransactionRecord\` DROP FOREIGN KEY \`FK_0435a15288b16300bced7681f20\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`CurrencyTransactionRecord\` DROP FOREIGN KEY \`FK_e5177fa2baf1993260b01b5f434\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`CurrencyTransactionRecord\` DROP FOREIGN KEY \`FK_c6edce0801e1d368111ebbb91a4\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Categories\` DROP FOREIGN KEY \`FK_8111f8d3e5f088377ee14b36a9f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`BrokerageFirm\` DROP FOREIGN KEY \`FK_2490780e25b98e6d46c8c84e249\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`BrokerageFirm\` DROP FOREIGN KEY \`FK_ec856ba28de02dfdd6c92ef3bb4\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`BrokerageFirm\` DROP FOREIGN KEY \`FK_9ff7ce1d9fe357c698224666e7b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`StockBundleSellRecords\` DROP FOREIGN KEY \`FK_383da49f098a582a22a3a1d0c94\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`StockBundleSellRecords\` DROP FOREIGN KEY \`FK_e53fa1624cf1a50b722ff4c754f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`StockBundleSellRecords\` DROP FOREIGN KEY \`FK_7b88c2cd0563865bc3eb6bdc08c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`StockBundleSellRecords\` DROP FOREIGN KEY \`FK_e754e14d87ca4a8a8b052b1c2b2\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`StockSellRecord\` DROP FOREIGN KEY \`FK_0a6cac892ef83014e2aa3d45cca\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`StockSellRecord\` DROP FOREIGN KEY \`FK_6e4899f0241f5cda55ada678dae\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`StockReocrds\` DROP FOREIGN KEY \`FK_d12343f20d0ac200fe68ab8225a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`StockReocrds\` DROP FOREIGN KEY \`FK_cd458de931303f86b1b99bfa189\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`StockReocrds\` DROP FOREIGN KEY \`FK_d8e6525aeebbdf5522c311cb1bd\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`UserStock\` DROP FOREIGN KEY \`FK_47f0bbec9fd94cb9904a600a329\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`UserStock\` DROP FOREIGN KEY \`FK_4abddab87258efb97fe7f0697b4\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`StockBuyRecords\` DROP FOREIGN KEY \`FK_8bbeb7218f401ac45c4de73155a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`StockBuyRecords\` DROP FOREIGN KEY \`FK_8571376f3f31348cf6f1d0ab7db\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`TimeDepositRecords\` DROP FOREIGN KEY \`FK_bc0828afa046ab9a62aa1241568\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`TimeDepositRecords\` DROP FOREIGN KEY \`FK_eb3b721986e44c43d6803bd3eb4\``,
    );
    await queryRunner.query(`DROP TABLE \`Stock\``);
    await queryRunner.query(`DROP TABLE \`StockHistory\``);
    await queryRunner.query(`DROP TABLE \`Currencies\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_201ffeac3ca3571cffdb85fe22\` ON \`Banks\``,
    );
    await queryRunner.query(`DROP TABLE \`Banks\``);
    await queryRunner.query(`DROP TABLE \`BankRecords\``);
    await queryRunner.query(`DROP TABLE \`Users\``);
    await queryRunner.query(
      `DROP INDEX \`REL_315ecd98bd1a42dcf2ec4e2e98\` ON \`profiles\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_5b49bd22c967ce2829ca8f1772\` ON \`profiles\``,
    );
    await queryRunner.query(`DROP TABLE \`profiles\``);
    await queryRunner.query(`DROP TABLE \`IncExpRecords\``);
    await queryRunner.query(`DROP TABLE \`UserCurrencies\``);
    await queryRunner.query(`DROP TABLE \`CurrencyTransactionRecord\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_7b1bda2a1ba6446b64d7c0fca1\` ON \`Categories\``,
    );
    await queryRunner.query(`DROP TABLE \`Categories\``);
    await queryRunner.query(`DROP TABLE \`BrokerageFirm\``);
    await queryRunner.query(`DROP TABLE \`StockBundleSellRecords\``);
    await queryRunner.query(`DROP TABLE \`StockSellRecord\``);
    await queryRunner.query(`DROP TABLE \`StockReocrds\``);
    await queryRunner.query(`DROP TABLE \`UserStock\``);
    await queryRunner.query(`DROP TABLE \`StockBuyRecords\``);
    await queryRunner.query(`DROP TABLE \`TimeDepositRecords\``);
  }
}
