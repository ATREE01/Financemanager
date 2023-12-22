如果使用npm start 看到下面這條error 但是我已經換方法了所以理論上你們不會遇到這個問題。

Invalid options object. Dev Server has been initialized using an options object that does not match the API schema.
 - options.allowedHosts[0] should be a non-empty string.

請參考這篇文章 

https://bobbyhadz.com/blog/react-could-not-proxy-request-to-localhost

連接資料庫出現問題的時候用這行。
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';這個password是你設的密碼

Bank:
支出的時候可以選擇信用卡，會直接計入在支出，但是同時新增到卡費欄位，然後可以在這個頁面選擇支付卡費之類的

用這個指令來切換到本地沒有但在遠端有的分枝
git switch 'branch name'


這個檔案用來建立本地資料庫的。
CREATE TABLE `users` (
	`user_id` INT NOT NULL AUTO_INCREMENT,
	`username` VARCHAR(255),
	`email` VARCHAR(255),
	`password_hash` VARCHAR(255),
	PRIMARY KEY (`user_id`),
	UNIQUE (`email`)
);

CREATE TABLE `IncExpRecord` (
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

CREATE TABLE `IncExpCategory`(
	`ID` INT NOT NULL AUTO_INCREMENT,
	`user_id` VARCHAR(255),
	`sort` INT,
	`type` VARCHAR(255),
	`value` VARCHAR(255),
	`name` NVARCHAR(16),
	PRIMARY KEY (`ID`),
	UNIQUE (`user_id`, `name`, `type`)
);

CREATE TABLE `Bank`(
	`ID` INT NOT NULL AUTO_INCREMENT,
	`user_id` INT,
	`bank_id` VARCHAR(255),
	`name` VARCHAR(255),
	`initialAmount` BIGINT,
	PRIMARY KEY (`ID`),
	UNIQUE (`user_id`, `name`)
)

CREATE TABLE `BankRecord`(
	`ID` INT NOT NULL AUTO_INCREMENT,
	`user_id` INT,
	`date` VARCHAR(255),
	`type` VARCHAR(255),
	`category` VARCHAR(255),
	`bank_id` VARCHAR(255),
	`amount` BIGINT,
	`charge` INT,
	PRIMARY KEY(`ID`)
)

CREATE TABLE `TimeDepositRecord`(
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
)