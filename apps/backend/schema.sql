CREATE TABLE IF NOT EXISTS `Users` (
	`user_id` INT NOT NULL AUTO_INCREMENT,
	`username` VARCHAR(255),
	`email` VARCHAR(255),
	`password_hash` VARCHAR(255),
	PRIMARY KEY (`user_id`),
	UNIQUE (`email`)
);

CREATE TABLE IF NOT EXISTS `IncExpRecord` (
	`ID` INT NOT NULL AUTO_INCREMENT,
	`user_id` INT,
	`date` VARCHAR(255),
	`type` VARCHAR(255),
	`category` VARCHAR(255),
	`currency` VARCHAR(255),
	`method` VARCHAR(255),
	`amount` VARCHAR(255),
	`bank_id` VARCHAR(255),
	`charge` VARCHAR(255),
	`note` NVARCHAR(255),
	PRIMARY KEY (`Record_id`)
);

CREATE TABLE IF NOT EXISTS `IncExpCategory`(
	`ID` INT NOT NULL AUTO_INCREMENT,
	`user_id` VARCHAR(255),
	`sort` INT,
	`type` VARCHAR(255),
	`value` VARCHAR(255),
	`name` VARCHAR(16),
	PRIMARY KEY (`ID`),
	UNIQUE (`user_id`, `name`, `type`)
);

CREATE TABLE IF NOT EXISTS `Bank`(
	`ID` INT NOT NULL AUTO_INCREMENT,
	`user_id` INT,
	`bank_id` VARCHAR(255),
	`name` VARCHAR(255),
	`currency` VARCHAR(16),
	`initialAmount` BIGINT,
	PRIMARY KEY (`ID`),
	UNIQUE (`user_id`, `name`)
);

CREATE TABLE IF NOT EXISTS `BankRecord`(
	`ID` INT NOT NULL AUTO_INCREMENT,
	`user_id` INT,
	`date` VARCHAR(255),
	`type` VARCHAR(255),
	`category` VARCHAR(255),
	`bank_id` VARCHAR(255),
	`currency` VARCHAR(16),
	`amount` BIGINT,
	`charge` INT,
	PRIMARY KEY(`ID`)
);

CREATE TABLE IF NOT EXISTS `TimeDepositRecord`(
	`ID` INT NOT NULL AUTO_INCREMENT,
	`user_id` INT,
	`bank_id` VARCHAR(255),
	`type` VARCHAR(255),
	`currency` VARCHAR(255),
	`amount` INT,
	`interest` VARCHAR(255),
	`startDate` VARCHAR(255),
	`endDate` VARCHAR(255),
	`accInterest` INT,
	PRIMARY KEY(`ID`)
);

CREATE TABLE IF NOT EXISTS `Currency`(
	`ID` INT NOT NULL AUTO_INCREMENT,
	`code` VARCHAR(16),
	`name` NVARCHAR(16),
	`ExchangeRate` float,
	PRIMARY KEY(`ID`)
);

INSERT INTO Currency (code, name, ExchangeRate) VALUES("TWD", "台幣", 1);
INSERT INTO Currency (code, name, ExchangeRate) VALUES("USD", "美金", 0);
INSERT INTO Currency (code, name, ExchangeRate) VALUES("EUR", "歐元", 0);
INSERT INTO Currency (code, name, ExchangeRate) VALUES("JPY", "日幣", 0);
INSERT INTO Currency (code, name, ExchangeRate) VALUES("KRW", "韓元", 0);
INSERT INTO Currency (code, name, ExchangeRate) VALUES("AUD", "澳幣", 0);
INSERT INTO Currency (code, name, ExchangeRate) VALUES("CAD", "加幣", 0);
INSERT INTO Currency (code, name, ExchangeRate) VALUES("CNY", "人民幣", 0);
INSERT INTO Currency (code, name, ExchangeRate) VALUES("GBP", "英鎊", 0);
INSERT INTO Currency (code, name, ExchangeRate) VALUES("ZAR", "南非幣", 0);
INSERT INTO Currency (code, name, ExchangeRate) VALUES("SGD", "新加坡幣", 0);
INSERT INTO Currency (code, name, ExchangeRate) VALUES("MXN", "墨西哥披索", 0);
INSERT INTO Currency (code, name, ExchangeRate) VALUES("THB", "泰銖", 0);
INSERT INTO Currency (code, name, ExchangeRate) VALUES("PHP", "菲律賓披索", 0);
INSERT INTO Currency (code, name, ExchangeRate) VALUES("VND", "越南盾", 0);
INSERT INTO Currency (code, name, ExchangeRate) VALUES("NZD", "紐西蘭幣", 0);
INSERT INTO Currency (code, name, ExchangeRate) VALUES("CHF", "瑞士法郎", 0);
INSERT INTO Currency (code, name, ExchangeRate) VALUES("SEK", "瑞典幣", 0);


CREATE TABLE IF NOT EXISTS `UserCurrencyList`(
	`ID` INT NOT NULL AUTO_INCREMENT,
	`user_id` INT,
	`code` VARCHAR(16),
	PRIMARY KEY(`ID`),
	UNIQUE(`user_id`, `code`)
);

CREATE TABLE IF NOT EXISTS `Brokerage`(
	`ID` INT NOT NULL AUTO_INCREMENT, 
	`user_id` INT, 
	`brokerage_id` VARCHAR(255),
	`name` VARCHAR(255),
	`transactionCur` VARCHAR(16),
	`settlementCur` VARCHAR(16),
	PRIMARY KEY(`ID`),
	UNIQUE(`user_id`, `name`)
);

CREATE TABLE IF NOT EXISTS `StockList`(
	`ID` INT NOT NULL AUTO_INCREMENT,
	`user_id` INT, 
	`stock_symbol` VARCHAR(32),
	`currency` VARCHAR(32),
	`stock_name` VARCHAR(32),
	PRIMARY KEY (`ID`),
	UNIQUE(`user_id`, `stock_symbol`, `stock_name`)
);

CREATE TABLE IF NOT EXISTS `StockPrice`(
	`ID` INT NOT NULL AUTO_INCREMENT,
	`stock_symbol` VARCHAR(32),
	`stock_price` float,
	PRIMARY KEY(`ID`),
	UNIQUE(`stock_symbol`)
);

CREATE TABLE IF NOT EXISTS `StockRecord`(
	`ID` INT NOT NULL AUTO_INCREMENT,
	`user_id` INT, 
	`date` VARCHAR(32),
	`brokerage_id` VARCHAR(64),
	`action` VARCHAR(16),
	`type` VARCHAR(16),
	`bank_id` VARCHAR(64),
	`total` DECIMAL(16, 6),
	`stock_symbol` VARCHAR(64),
	`buy_stock_price` DECIMAL(12, 6),
	`sell_stock_price` DECIMAL(12, 6),
	`share_number` DECIMAL(16, 6),
	`buy_exchange_rate` DECIMAL(10, 5),
	`sell_exchange_rate` DECIMAL(10, 5),
	`charge` DECIMAL(16, 6),
	`tax` DECIMAL(16, 6),
	`note` VARCHAR(255),
	PRIMARY KEY(`ID`)
);

CREATE TABLE IF NOT EXISTS `DividendRecord`(
	`ID` INT NOT NULL AUTO_INCREMENT,
	`user_id` INT,
	`date` VARCHAR(32),
	`brokerage_id` VARCHAR(64),
	`stock_symbol` VARCHAR(16),
	`bank_id` VARCHAR(64),
	`currency` VARCHAR(16),
	`amount` DECIMAL(16, 6),
	PRIMARY KEY(`ID`)
);

CREATE TABLE IF NOT EXISTS `MarketValueRecord` (
	`ID` INT NOT NULL AUTO_INCREMENT, 
	`user_id` INT,
	`date` VARCHAR(32),
	`value` BIGINT,
	PRIMARY KEY(`ID`)
)

