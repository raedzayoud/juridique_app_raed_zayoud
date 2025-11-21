-- MySQL schema for Juridique App
CREATE DATABASE IF NOT EXISTS `juridique_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `juridique_db`;

CREATE TABLE IF NOT EXISTS `Communes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `codePostal` varchar(10) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `Themes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `Users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `passwordHash` varchar(255) NOT NULL,
  `role` ENUM('admin','agent') NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `Interventions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `CommuneId` int NOT NULL,
  `ThemeId` int NOT NULL,
  `utilisateurId` int NOT NULL,
  `nomUsager` varchar(255) NOT NULL,
  `prenomUsager` varchar(255) NOT NULL,
  `question` text NOT NULL,
  `reponse` text NULL,
  `statut` ENUM('en_cours','traitee','archivee') NOT NULL DEFAULT 'en_cours',
  `dateCreation` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `dateReponse` datetime NULL,
  `satisfaction` int NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_intervention_commune` FOREIGN KEY (`CommuneId`) REFERENCES `Communes`(`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_intervention_theme` FOREIGN KEY (`ThemeId`) REFERENCES `Themes`(`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_intervention_user` FOREIGN KEY (`utilisateurId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `PieceJointes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `InterventionId` int NOT NULL,
  `url` varchar(1024) NOT NULL,
  `type` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_piece_intervention` FOREIGN KEY (`InterventionId`) REFERENCES `Interventions`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;
