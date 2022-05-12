-- -----------------------------------------------------
-- Schema CageDB
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `CageDB` ;

-- -----------------------------------------------------
-- Schema CageDB
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `CageDB` DEFAULT CHARACTER SET utf8 ;
USE `CageDB` ;


-- -----------------------------------------------------
-- Table `CageDB`.`location`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `CageDB`.`location` ;

CREATE TABLE IF NOT EXISTS `CageDB`.`location` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `location` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`)
)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `CageDB`.`item`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `CageDB`.`item` ;

CREATE TABLE IF NOT EXISTS `CageDB`.`item` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `type` VARCHAR(60) NOT NULL,
  `description` VARCHAR(120) NOT NULL,
  `version` VARCHAR(25) NOT NULL,
  `long_term_loanable` TINYINT NOT NULL,
  `location_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `location_fk` FOREIGN KEY (`location_id`) REFERENCES location (`id`)
)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `CageDB`.`tag`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `CageDB`.`tag` ;

CREATE TABLE IF NOT EXISTS `CageDB`.`tag` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `tag_name` VARCHAR(50) NULL,
  PRIMARY KEY (`id`)
)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `CageDB`.`item_tag`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `CageDB`.`item_tag` ;

CREATE TABLE IF NOT EXISTS `CageDB`.`item_tag` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `item_id` INT NOT NULL,
  `tag_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `item_tag_fk` FOREIGN KEY (`item_id`) REFERENCES item(`id`),
  CONSTRAINT `tag_fk` FOREIGN KEY (`tag_id`) REFERENCES tag(`id`)
)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `CageDB`.`role`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `CageDB`.`role` ;

CREATE TABLE IF NOT EXISTS `CageDB`.`role` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `role_name` VARCHAR(25) NOT NULL,
  PRIMARY KEY (`id`)
)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `CageDB`.`user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `CageDB`.`user` ;

CREATE TABLE IF NOT EXISTS `CageDB`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(65) NOT NULL,
  `type` VARCHAR(25) NOT NULL,
  `password` VARCHAR(25) NOT NULL,
  `email_address` VARCHAR(65) NOT NULL,
  `role_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `role_fk` FOREIGN KEY (`role_id`) REFERENCES role(`id`)
)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `CageDB`.`reservation`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `CageDB`.`reservation` ;

CREATE TABLE IF NOT EXISTS `CageDB`.`reservation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `loan_start` DATETIME NOT NULL,
  `loan_end` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `user_fk` FOREIGN KEY (`user_id`) REFERENCES user(`id`)
)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `CageDB`.`reservation_item`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `CageDB`.`reservation_item` ;

CREATE TABLE IF NOT EXISTS `CageDB`.`reservation_item` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `item_id` INT NOT NULL,
  `reservation_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `reservation_fk` FOREIGN KEY (`reservation_id`) REFERENCES reservation(`id`),
  CONSTRAINT `item_fk` FOREIGN KEY (`item_id`) REFERENCES item(`id`)
)
ENGINE = InnoDB;



-- -----------------------------------------------------
-- Table `CageDB`.`kit`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `CageDB`.`kit` ;

CREATE TABLE IF NOT EXISTS `CageDB`.`kit` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(25) NOT NULL,
  `creator_id` INT NOT NULL,
  `description` VARCHAR (100) NOT NULL,
  `count` INT NOT NULL,
  `long_term_loanable` TINYINT NOT NULL,
  `location` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `creator_fk` FOREIGN KEY (`creator_id`) REFERENCES user(`id`)
)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `CageDB`.`item_kit`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `CageDB`.`item_kit` ;

CREATE TABLE IF NOT EXISTS `CageDB`.`item_kit` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `item_id` INT NOT NULL,
  `kit_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `kit` FOREIGN KEY (`kit_id`) REFERENCES kit(`id`),
  CONSTRAINT `item_kit_fk` FOREIGN KEY (`item_id`) REFERENCES item(`id`)
)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `CageDB`.`reservation_kit`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `CageDB`.`reservation_kit` ;

CREATE TABLE IF NOT EXISTS `CageDB`.`reservation_kit` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `kit_id` INT NOT NULL,
  `reservation_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `kit_fk` FOREIGN KEY (`kit_id`) REFERENCES kit(`id`),
  CONSTRAINT `res_fk` FOREIGN KEY (`reservation_id`) REFERENCES reservation(`id`)
)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `CageDB`.`checkout`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `CageDB`.`checkout` ;

CREATE TABLE IF NOT EXISTS `CageDB`.`checkout` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `reservation_id` INT NOT NULL,
  `checkout_date` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `user_checkout` FOREIGN KEY (`user_id`) REFERENCES user(`id`),
  CONSTRAINT `reservation_checkout` FOREIGN KEY (`reservation_id`) REFERENCES reservation(`id`)
)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `CageDB`.`checkout_kit`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `CageDB`.`checkout_kit` ;

CREATE TABLE IF NOT EXISTS `CageDB`.`checkout_kit` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `kit_id` INT NOT NULL,
  `checkout_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `checkout_kit` FOREIGN KEY (`kit_id`) REFERENCES kit(`id`),
  CONSTRAINT `checkout_kit_id` FOREIGN KEY (`checkout_id`) REFERENCES checkout(`id`)
)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `CageDB`.`checkout_item`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `CageDB`.`checkout_item` ;

CREATE TABLE IF NOT EXISTS `CageDB`.`checkout_item` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `item_id` INT NOT NULL,
  `checkout_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `checkout_item` FOREIGN KEY (`item_id`) REFERENCES item(`id`),
  CONSTRAINT `checkout_item_id` FOREIGN KEY (`checkout_id`) REFERENCES checkout(`id`)
)
ENGINE = InnoDB;

-- SET SQL_MODE=@OLD_SQL_MODE;
-- SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
-- SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;