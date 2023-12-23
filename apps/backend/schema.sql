CREATE TABLE IF NOT EXISTS `users` (
	`user_id` INT NOT NULL AUTO_INCREMENT,
	`username` VARCHAR(255),
	`email` VARCHAR(255),
	`password_hash` VARCHAR(255),
	PRIMARY KEY (`user_id`),
	UNIQUE (`email`)
);

CREATE TABLE IF NOT EXISTS `IncExpRecord` (
	`Record_id` INT NOT NULL AUTO_INCREMENT,
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
	`name` NVARCHAR(16),
	PRIMARY KEY (`ID`),
	UNIQUE (`user_id`, `name`, `type`)
);

CREATE TABLE IF NOT EXISTS `Bank`(
	`ID` INT NOT NULL AUTO_INCREMENT,
	`user_id` INT,
	`bank_id` VARCHAR(255),
	`name` VARCHAR(255),
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