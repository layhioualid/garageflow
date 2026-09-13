-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : dim. 13 sep. 2026 à 19:38
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `gestion_flotte`
--

-- --------------------------------------------------------

--
-- Structure de la table `achat`
--

CREATE TABLE `achat` (
  `id` bigint(20) NOT NULL,
  `fournisseur_id` bigint(20) DEFAULT NULL,
  `date_achat` datetime(6) DEFAULT NULL,
  `montant_total` double DEFAULT NULL,
  `piece_id` bigint(20) DEFAULT NULL,
  `quantite` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `achat`
--

INSERT INTO `achat` (`id`, `fournisseur_id`, `date_achat`, `montant_total`, `piece_id`, `quantite`) VALUES
(6, 2, '2026-05-03 01:00:00.000000', 2000, 5, 20),
(7, 1, '2026-05-05 01:00:00.000000', 8000, 6, 20),
(8, 1, '2026-05-05 01:00:00.000000', 400, 7, 20),
(9, 3, '2026-05-05 01:00:00.000000', 4000, 11, 20),
(10, 3, '2026-05-14 01:00:00.000000', 4000, 13, 20),
(11, 1, '2026-05-06 01:00:00.000000', 8000, 6, 20),
(12, 1, '2026-05-12 01:00:00.000000', 2000, 15, 20),
(13, 1, '2026-05-12 01:00:00.000000', 500, 15, 5),
(14, 3, '2026-05-15 01:00:00.000000', 2000, 17, 100),
(15, 1, '2026-05-18 01:00:00.000000', 6000, 18, 20),
(16, 1, '2026-05-31 01:00:00.000000', 2000, 7, 100),
(17, 3, '2026-05-31 01:00:00.000000', 10000, 11, 50),
(18, 1, '2026-09-10 01:00:00.000000', 200, 7, 10);

-- --------------------------------------------------------

--
-- Structure de la table `alerte`
--

CREATE TABLE `alerte` (
  `id` bigint(20) NOT NULL,
  `prediction_id` bigint(20) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `niveau_risque` varchar(50) DEFAULT NULL,
  `date_alerte` timestamp NOT NULL DEFAULT current_timestamp(),
  `statut` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `client`
--

CREATE TABLE `client` (
  `id` bigint(20) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `telephone` varchar(50) DEFAULT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `client`
--

INSERT INTO `client` (`id`, `nom`, `prenom`, `email`, `telephone`, `adresse`, `created_at`) VALUES
(1, 'layhi', 'oualid', 'walidlayhi@gmail.com', '+212639329568', 'gueliz,marrakech', '2026-05-22 02:56:45'),
(2, 'layhi', 'rayan', 'zntek520@gmail.com', '+212639329555', 'gueliz,marrakech', '2026-05-22 03:04:28');

-- --------------------------------------------------------

--
-- Structure de la table `devis`
--

CREATE TABLE `devis` (
  `id` bigint(20) NOT NULL,
  `intervention_id` bigint(20) NOT NULL,
  `montant` double DEFAULT NULL,
  `statut` varchar(30) DEFAULT 'PENDING',
  `fichier` varchar(255) DEFAULT NULL,
  `date_creation` datetime DEFAULT current_timestamp(),
  `token_validation` varchar(255) DEFAULT NULL,
  `statut_client` varchar(50) DEFAULT 'EN_ATTENTE',
  `date_validation` datetime DEFAULT NULL,
  `commentaire_client` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `devis`
--

INSERT INTO `devis` (`id`, `intervention_id`, `montant`, `statut`, `fichier`, `date_creation`, `token_validation`, `statut_client`, `date_validation`, `commentaire_client`) VALUES
(1, 26, 20, 'APPROVED', NULL, '2026-05-08 02:14:47', NULL, 'EN_ATTENTE', NULL, NULL),
(2, 26, 20, 'APPROVED', NULL, '2026-05-08 02:17:48', NULL, 'EN_ATTENTE', NULL, NULL),
(3, 46, 0, 'APPROVED', NULL, '2026-05-09 02:27:15', NULL, 'EN_ATTENTE', NULL, NULL),
(4, 46, 0, 'APPROVED', NULL, '2026-05-09 02:29:41', NULL, 'EN_ATTENTE', NULL, NULL),
(5, 47, 400, 'REJECTED', NULL, '2026-05-09 02:32:31', NULL, 'EN_ATTENTE', NULL, NULL),
(6, 46, 300, 'APPROVED', NULL, '2026-05-09 02:41:36', NULL, 'EN_ATTENTE', NULL, NULL),
(7, 35, 500, 'APPROVED', NULL, '2026-05-12 01:03:17', NULL, 'EN_ATTENTE', NULL, NULL),
(8, 34, 100, 'APPROVED', NULL, '2026-05-12 02:10:48', NULL, 'EN_ATTENTE', NULL, NULL),
(9, 49, 300, 'APPROVED', NULL, '2026-05-12 02:41:39', NULL, 'EN_ATTENTE', NULL, NULL),
(10, 52, 400, 'PENDING', NULL, '2026-05-12 23:12:36', NULL, 'EN_ATTENTE', NULL, NULL),
(11, 53, 200, 'APPROVED', NULL, '2026-05-12 23:28:44', NULL, 'EN_ATTENTE', NULL, NULL),
(12, 48, 120, 'APPROVED', NULL, '2026-05-13 00:02:57', NULL, 'EN_ATTENTE', NULL, NULL),
(13, 55, 200, 'APPROVED', NULL, '2026-05-13 23:28:45', NULL, 'EN_ATTENTE', NULL, NULL),
(14, 56, 300, 'APPROVED', NULL, '2026-05-15 02:50:24', NULL, 'EN_ATTENTE', NULL, NULL),
(15, 52, 400, 'APPROVED', NULL, '2026-05-18 04:31:13', NULL, 'EN_ATTENTE', NULL, NULL),
(16, 52, 400, 'APPROVED', NULL, '2026-05-18 04:31:21', NULL, 'EN_ATTENTE', NULL, NULL),
(17, 58, 500, 'APPROVED', NULL, '2026-05-18 15:30:49', NULL, 'EN_ATTENTE', NULL, NULL),
(18, 59, 220, 'APPROVED', NULL, '2026-05-18 16:12:48', NULL, 'EN_ATTENTE', NULL, NULL),
(19, 60, 400, 'APPROVED', NULL, '2026-05-22 03:10:37', '5e26cf4e-e856-4738-8546-86b68f876eec', 'ACCEPTE', '2026-05-22 03:11:12', ''),
(20, 61, 400, 'APPROVED', NULL, '2026-05-22 03:38:23', '02392771-41f3-458e-880b-fe0f530f1a75', 'ACCEPTE', '2026-05-22 04:23:42', ''),
(21, 62, 120, 'APPROVED', NULL, '2026-05-25 02:15:46', 'b63c0efb-4e5c-472f-b216-aa888e41dff6', 'ACCEPTE', '2026-05-25 02:17:06', ''),
(22, 63, 280, 'APPROVED', NULL, '2026-05-31 22:02:56', '2862c745-51d0-4233-ba4b-7f7bd21e0093', 'ACCEPTE', '2026-05-31 22:03:53', ''),
(23, 64, 400, 'APPROVED', NULL, '2026-05-31 22:16:00', '26d23365-2561-4495-9b8c-d0789855c5ce', 'ACCEPTE', '2026-05-31 22:16:52', ''),
(24, 65, 140, 'APPROVED', NULL, '2026-05-31 22:22:24', 'cd6b9054-74cb-43de-a7e0-c668c4f743f5', 'EN_ATTENTE', NULL, NULL),
(25, 66, 300, 'APPROVED', NULL, '2026-05-31 22:57:59', '54d5ee1f-3aaa-47be-838e-c016bee86ec6', 'EN_ATTENTE', NULL, NULL),
(26, 67, 400, 'APPROVED', NULL, '2026-05-31 23:07:31', '2698f918-0783-4cd7-9d3d-55346f60ee2d', 'EN_ATTENTE', NULL, NULL),
(27, 68, 400, 'APPROVED', NULL, '2026-05-31 23:14:54', '641c88ab-9040-4586-a3d4-4c9d5cd1929a', 'ACCEPTE', '2026-05-31 23:15:50', ''),
(28, 69, 140, 'APPROVED', NULL, '2026-06-01 00:18:40', '90ee1125-dc47-4820-b343-116859972445', 'ACCEPTE', '2026-06-01 00:18:52', ''),
(29, 69, 140, 'PENDING', NULL, '2026-06-02 05:45:24', 'd8dfe146-c825-4403-8689-81e07aa8ce59', 'EN_ATTENTE', NULL, NULL),
(30, 71, 200, 'APPROVED', NULL, '2026-06-03 21:00:45', 'ad8f062a-5ef8-4078-9a51-b98e8071c32a', 'ACCEPTE', '2026-06-03 21:02:13', ''),
(31, 73, 200, 'APPROVED', NULL, '2026-06-03 21:18:32', 'a7794b65-6b3c-43a0-b4bc-62bf7bd2911a', 'EN_ATTENTE', NULL, NULL),
(32, 73, 200, 'REJECTED', NULL, '2026-06-03 21:18:32', 'eb0e252a-a97a-4622-af9e-db822583dc53', 'EN_ATTENTE', NULL, NULL),
(33, 74, 200, 'APPROVED', NULL, '2026-06-03 21:23:47', '4053e4b6-da75-43c5-89ad-19100b66499e', 'ACCEPTE', '2026-06-03 21:25:24', ''),
(34, 75, 120, 'APPROVED', NULL, '2026-06-04 03:46:42', '9f8aca26-2054-42f6-bad6-6721c82aad74', 'ACCEPTE', '2026-06-04 03:47:09', ''),
(35, 76, 200, 'APPROVED', NULL, '2026-06-04 05:05:33', '26110694-aace-41cd-8aa2-e5e8f00b7fb3', 'ACCEPTE', '2026-06-04 05:07:04', ''),
(36, 77, 200, 'APPROVED', NULL, '2026-06-04 06:04:36', 'b74eeaff-6f25-4d2e-9b23-0dc8d2ecb338', 'ACCEPTE', '2026-06-04 06:06:24', ''),
(37, 78, 120, 'APPROVED', NULL, '2026-06-16 10:05:13', '6e357d4b-0ed6-494d-95a9-68711bdd0bc7', 'ACCEPTE', '2026-06-16 10:18:07', ''),
(38, 82, 400, 'APPROVED', NULL, '2026-06-22 19:38:41', 'ef8f06e2-eaf4-4d5b-85e3-4f5eae7fe520', 'ACCEPTE', '2026-06-22 19:39:43', ''),
(39, 81, 100, 'APPROVED', NULL, '2026-06-22 19:40:43', '85958e94-df0e-4477-bc58-f784c56a4c68', 'ACCEPTE', '2026-06-22 19:41:14', ''),
(40, 83, 120, 'APPROVED', NULL, '2026-06-23 00:22:15', '481d2381-c9a1-4c9a-84c3-376198ab9a0c', 'ACCEPTE', '2026-06-23 00:22:28', ''),
(41, 84, 100, 'APPROVED', NULL, '2026-09-09 21:40:02', 'fe5eb4b3-fec7-4e9a-ab7f-4f8f8b9c1f8b', 'ACCEPTE', '2026-09-09 21:40:36', '');

-- --------------------------------------------------------

--
-- Structure de la table `document`
--

CREATE TABLE `document` (
  `id` bigint(20) NOT NULL,
  `vehicule_id` bigint(20) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `date_creation` datetime(6) DEFAULT NULL,
  `fichier` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `document`
--

INSERT INTO `document` (`id`, `vehicule_id`, `type`, `date_creation`, `fichier`) VALUES
(1, 10, 'ASSURANCE', '2026-05-14 04:54:52.000000', 'uploads/documents/1778730892606_facture-2.pdf');

-- --------------------------------------------------------

--
-- Structure de la table `facture`
--

CREATE TABLE `facture` (
  `id` bigint(20) NOT NULL,
  `numero` varchar(50) DEFAULT NULL,
  `date_facture` datetime DEFAULT NULL,
  `montant_ht` double DEFAULT NULL,
  `tva` double DEFAULT NULL,
  `montant_ttc` double DEFAULT NULL,
  `statut` varchar(30) DEFAULT NULL,
  `intervention_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `facture`
--

INSERT INTO `facture` (`id`, `numero`, `date_facture`, `montant_ht`, `tva`, `montant_ttc`, `statut`, `intervention_id`) VALUES
(2, 'FAC-1778538226114', '2026-05-11 23:38:39', 20, 4, 24, 'PAID', 26),
(3, 'FAC-1778539530365', '2026-05-11 22:45:00', 300, 60, 360, 'PAID', 46),
(4, 'FAC-1778544224898', '2026-05-12 00:03:00', 500, 100, 600, 'PAID', 35),
(5, 'FAC-1778550160980', '2026-05-12 02:42:40', 300, 60, 360, 'PAID', 49),
(6, 'FAC-1778624935676', '2026-05-12 23:28:55', 200, 40, 240, 'UNPAID', 53),
(7, 'FAC-1778711371021', '2026-05-13 23:29:31', 200, 40, 240, 'UNPAID', 55),
(8, 'FAC-1778712545037', '2026-05-13 23:49:05', 120, 24, 144, 'UNPAID', 48),
(9, 'FAC-1778809833718', '2026-05-15 02:50:33', 300, 60, 360, 'PAID', 56),
(10, 'FAC-1779114657958', '2026-05-18 14:30:00', 500, 100, 600, 'PAID', 58),
(11, 'FAC-1779117185048', '2026-05-18 16:13:05', 220, 44, 264, 'PAID', 59),
(12, 'FAC-1779673525108', '2026-05-25 02:45:25', 120, 24, 144, 'PAID', 62),
(13, 'FAC-1780261606721', '2026-05-31 22:06:46', 280, 56, 336, 'PAID', 63),
(14, 'FAC-1780264694793', '2026-05-31 22:58:14', 300, 60, 360, 'PAID', 66),
(15, 'FAC-1780265261706', '2026-05-31 23:07:41', 400, 80, 480, 'PAID', 67),
(16, 'FAC-1780265777359', '2026-05-31 23:16:17', 400, 80, 480, 'PAID', 68),
(17, 'FAC-2026-0016', '2026-06-01 02:52:25', 140, 28, 168, 'PAID', 69),
(18, 'FAC-2026-0017', '2026-06-03 21:03:25', 200, 40, 240, 'PAID', 71),
(19, 'FAC-2026-0018', '2026-06-03 21:13:59', 400, 80, 480, 'PAID', 70),
(20, 'FAC-2026-0019', '2026-06-03 21:19:58', 200, 40, 240, 'PAID', 73),
(21, 'FAC-2026-0020', '2026-06-03 21:26:15', 200, 40, 240, 'PAID', 74),
(22, 'FAC-2026-0021', '2026-06-04 04:00:34', 120, 24, 144, 'PAID', 75),
(23, 'FAC-2026-0022', '2026-06-04 05:08:51', 200, 40, 240, 'PAID', 76),
(24, 'FAC-2026-0023', '2026-06-04 06:07:35', 200, 40, 240, 'PAID', 77),
(25, 'FAC-2026-0024', '2026-06-16 10:21:07', 120, 24, 144, 'PAID', 78),
(26, 'FAC-2026-0025', '2026-06-22 19:42:22', 400, 80, 480, 'PAID', 82),
(27, 'FAC-2026-0026', '2026-06-22 19:43:02', 100, 20, 120, 'PAID', 81),
(28, 'FAC-2026-0027', '2026-06-23 00:23:39', 120, 24, 144, 'UNPAID', 83),
(29, 'FAC-2026-0028', '2026-09-09 21:45:15', 100, 20, 120, 'UNPAID', 84);

-- --------------------------------------------------------

--
-- Structure de la table `fournisseur`
--

CREATE TABLE `fournisseur` (
  `id` bigint(20) NOT NULL,
  `nom` varchar(100) DEFAULT NULL,
  `adresse` text DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `fournisseur`
--

INSERT INTO `fournisseur` (`id`, `nom`, `adresse`, `telephone`, `email`) VALUES
(1, 'oualid layhi', 'gueliz,marrakech', '0639329568', 'walidlayhi@gmail.com'),
(2, 'rayan layhi', 'gueliz,marrakech', '060000000', 'rayan@gmail.com'),
(3, 'med', 'Medina,marrakech', '0609090909', 'med@gmail.com');

-- --------------------------------------------------------

--
-- Structure de la table `intervention`
--

CREATE TABLE `intervention` (
  `id` bigint(20) NOT NULL,
  `vehicule_id` bigint(20) DEFAULT NULL,
  `technicien_id` bigint(20) DEFAULT NULL,
  `date_debut` datetime DEFAULT NULL,
  `date_fin` datetime DEFAULT NULL,
  `type_panne` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `cout` double DEFAULT NULL,
  `duree` double DEFAULT NULL,
  `statut` varchar(50) DEFAULT NULL,
  `intervention_id` bigint(20) DEFAULT NULL,
  `numero_ordre_reparation` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `intervention`
--

INSERT INTO `intervention` (`id`, `vehicule_id`, `technicien_id`, `date_debut`, `date_fin`, `type_panne`, `description`, `cout`, `duree`, `statut`, `intervention_id`, `numero_ordre_reparation`) VALUES
(26, 10, 11, '2026-05-05 00:55:35', '2026-05-05 00:55:45', 'sgfg', 'sdfgdsfg', 20, 0, 'DONE', NULL, NULL),
(32, 29, 10, '2026-05-06 01:50:31', '2026-05-06 03:03:55', 'pistone', 'pistone coule', 200, 1, 'DONE', NULL, NULL),
(33, 12, 11, '2026-05-06 01:54:16', '2026-05-06 01:54:24', 'dfsdf', 'dfsdf', 600, 0, 'DONE', NULL, NULL),
(34, 12, 11, '2026-05-06 02:09:08', NULL, 'dasd', 'sadas', 100, 0, 'DONE', NULL, NULL),
(35, 12, 11, '2026-05-06 02:14:18', '2026-05-06 22:16:40', 'hadvgsjvd', 'sdasadas', 500, 20, 'DONE', NULL, NULL),
(36, 10, 11, '2026-05-06 03:21:43', '2026-05-06 03:21:51', 'FDSFDS', 'DSFSDF', 400, 0, 'DONE', NULL, NULL),
(46, 27, 11, '2026-05-09 02:26:00', '2026-06-01 06:29:05', 'MOTEUR', '', 300, 556, 'DONE', NULL, NULL),
(47, 27, 10, '2026-05-09 02:30:46', '2026-05-11 23:13:00', 'ASA', 'SASA', 400, 68, 'DONE', NULL, NULL),
(48, 12, 10, '2026-05-12 01:00:55', '2026-06-22 19:45:30', 'VIDANGE', 'VIDANGE MOTO', 120, 1002, 'DONE', NULL, NULL),
(49, 30, 10, '2026-05-12 02:41:23', NULL, 'BATTERIE', 'CHANGE DE BATTERIE', 300, 0, 'DONE', NULL, NULL),
(50, 29, 11, '2026-05-12 06:37:15', NULL, 'probleme moteur', 'besoin de vidange', 120, 0, 'DONE', NULL, NULL),
(51, 29, 17, '2026-05-12 06:38:01', '2026-05-15 02:40:59', 'dsfds', 'dsfsdf', 100, 68, 'DONE', NULL, NULL),
(52, 32, 11, '2026-05-12 23:12:19', '2026-05-31 22:41:52', 'BOITE VITESSE', 'BOITE VITESSE MAINTENACE', 400, 455, 'DONE', NULL, NULL),
(53, 32, 10, '2026-05-12 23:28:31', NULL, 'batterie', 'batterie besoin piles', 200, 0, 'DONE', NULL, NULL),
(54, 29, 10, '2026-05-13 00:02:16', '2026-05-15 02:41:17', 'vidange', 'vidange complet', 120, 50, 'DONE', NULL, NULL),
(55, 34, 10, '2026-05-13 23:28:25', '2026-05-15 02:48:16', 'batterie', 'probleme des piles', 200, 27, 'DONE', NULL, NULL),
(56, 28, 17, '2026-05-15 02:49:47', NULL, 'probleme moteur', 'motuer preparation', 300, 0, 'IN_PROGRESS', NULL, NULL),
(57, 12, 14, '2026-05-15 03:13:01', '2026-05-15 03:13:33', 'probleme batterie', 'batterie', 400, 0, 'DONE', NULL, NULL),
(58, 12, 11, '2026-05-18 15:30:30', '2026-05-25 02:54:28', 'probleme moteur', 'moteur', 500, 155, 'DONE', NULL, NULL),
(59, 30, 11, '2026-05-18 16:12:38', '2026-05-18 16:17:35', 'moteur', 'probleme moteur', 220, 0, 'DONE', NULL, NULL),
(60, 30, 17, '2026-05-22 03:10:28', '2026-05-25 02:52:35', 'batterie ', 'batterie piles', 400, 71, 'DONE', NULL, NULL),
(61, 12, 14, '2026-05-22 03:38:19', '2026-05-25 02:54:10', 'moteure', 'vidange complet', 400, 71, 'DONE', NULL, NULL),
(62, 35, 11, '2026-05-25 02:15:26', '2026-05-25 02:46:17', 'moteur', 'vidange complet', 120, 0, 'DONE', NULL, NULL),
(63, 10, 14, '2026-05-31 22:02:47', '2026-05-31 22:04:53', 'freinage', 'freinage nulle', 280, 0, 'DONE', NULL, NULL),
(64, 35, 11, '2026-05-31 22:15:50', '2026-05-31 22:21:21', 'batterie', 'batterie vide', 400, 0, 'DONE', NULL, NULL),
(65, 10, 11, '2026-05-31 22:22:18', '2026-05-31 22:23:07', 'moteur', 'moteur vidange ', 140, 0, 'DONE', NULL, NULL),
(66, 33, 10, '2026-05-31 22:57:48', '2026-05-31 22:58:14', 'SADSAD', 'SADSAD', 300, 0, 'DONE', NULL, NULL),
(67, 13, 11, '2026-05-31 23:07:24', '2026-05-31 23:07:41', 'MOTEUR', 'MOTEURE FUITE', 400, 0, 'DONE', NULL, NULL),
(68, 26, 10, '2026-05-31 23:14:32', '2026-05-31 23:16:17', 'BATTERIE', 'BATTERIE FAIBLE', 400, 0, 'DONE', NULL, NULL),
(69, 10, 11, '2026-06-01 00:18:32', '2026-06-01 02:52:25', 'freinage', 'freinage faible', 140, 2, 'DONE', NULL, NULL),
(70, 35, 14, '2026-06-03 01:44:13', '2026-06-03 21:13:59', 'probleme carburant ', 'carburant sale ', 400, 19, 'DONE', NULL, NULL),
(71, 10, 14, '2026-06-03 20:59:55', '2026-06-03 21:03:25', 'batterie', 'batterie tres faible ', 200, 0, 'DONE', NULL, NULL),
(73, 35, 11, '2026-06-03 21:17:56', '2026-06-03 21:19:58', 'batterie', 'batterie tres faible ', 200, 0, 'DONE', NULL, NULL),
(74, 35, 11, '2026-06-03 21:23:32', '2026-06-03 21:26:15', 'batterie', 'batterie tres faible ', 200, 0, 'DONE', NULL, NULL),
(75, 10, 27, '2026-06-04 03:31:12', '2026-06-04 04:00:34', 'probleme moteur', 'probleme de moteur besoin de vidange', 120, 0, 'DONE', NULL, NULL),
(76, 26, 27, '2026-06-04 05:05:17', '2026-06-04 05:08:51', 'batterie', 'batterie tres faible ', 200, 0, 'DONE', NULL, NULL),
(77, 35, 27, '2026-06-04 06:03:47', '2026-06-04 06:07:35', 'probleme batterie ', 'batterie tres faible', 200, 0, 'DONE', NULL, NULL),
(78, 33, 27, '2026-06-16 10:05:05', '2026-06-16 10:21:07', 'moteur', 'vidange complet', 120, 0, 'DONE', NULL, NULL),
(79, 32, 25, '2026-06-22 19:04:04', NULL, 'batterie', 'batterie faible', 200, 0, 'PENDING', NULL, NULL),
(80, 35, 11, '2026-06-22 19:05:32', NULL, 'freainage', 'frein', 20, 0, 'PENDING', NULL, NULL),
(81, 34, 27, '2026-06-22 19:28:50', '2026-06-22 19:43:02', 'moteur', 'vidange moteur', 100, 0, 'DONE', NULL, NULL),
(82, 31, 27, '2026-06-22 19:35:20', '2026-06-22 19:42:22', 'probleme moteur', 'vidange moteur ', 400, 0, 'DONE', NULL, 'OR-20260622-8EC67A'),
(83, 29, 27, '2026-06-23 00:22:04', '2026-06-23 00:23:39', 'moteur et freinage ', 'vidange pour moteur et huile pour les freins ', 120, 0, 'DONE', NULL, 'OR-20260623-8CE92F'),
(84, 10, 27, '2026-09-09 21:39:46', '2026-09-09 21:45:15', 'moteur vidange', 'vidange', 100, 0, 'DONE', NULL, 'OR-20260909-7B8BF8');

-- --------------------------------------------------------

--
-- Structure de la table `ligne_intervention_piece`
--

CREATE TABLE `ligne_intervention_piece` (
  `id` bigint(20) NOT NULL,
  `intervention_id` bigint(20) DEFAULT NULL,
  `piece_id` bigint(20) DEFAULT NULL,
  `quantite` int(11) DEFAULT NULL,
  `prix_unitaire` double DEFAULT 0,
  `total` double DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `ligne_intervention_piece`
--

INSERT INTO `ligne_intervention_piece` (`id`, `intervention_id`, `piece_id`, `quantite`, `prix_unitaire`, `total`) VALUES
(30, 26, 7, 1, 0, 0),
(40, 32, 13, 1, 0, 0),
(41, 33, 6, 1, 0, 0),
(42, 33, 11, 1, 0, 0),
(43, 35, 6, 1, 0, 0),
(44, 35, 5, 1, 0, 0),
(45, 36, 6, 1, 0, 0),
(51, 47, 6, 1, 0, 0),
(54, 34, 5, 1, 0, 0),
(64, 49, 11, 1, 0, 0),
(65, 49, 5, 1, 0, 0),
(69, 50, 15, 1, 0, 0),
(70, 50, 7, 1, 0, 0),
(71, 51, 5, 1, 0, 0),
(72, 52, 6, 1, 0, 0),
(73, 53, 11, 1, 0, 0),
(74, 54, 15, 1, 0, 0),
(75, 54, 7, 1, 0, 0),
(78, 55, 11, 1, 0, 0),
(88, 56, 13, 1, 0, 0),
(89, 56, 15, 1, 0, 0),
(90, 57, 11, 2, 0, 0),
(92, 58, 5, 1, 0, 0),
(93, 58, 6, 1, 0, 0),
(94, 59, 7, 1, 0, 0),
(95, 59, 13, 1, 0, 0),
(97, 60, 11, 2, 0, 0),
(98, 61, 18, 1, 0, 0),
(99, 61, 15, 1, 0, 0),
(100, 62, 15, 1, 0, 0),
(101, 62, 7, 1, 0, 0),
(108, 63, 17, 4, 0, 0),
(109, 63, 5, 2, 0, 0),
(112, 64, 11, 2, 0, 0),
(116, 65, 15, 1, 0, 0),
(117, 65, 7, 2, 0, 0),
(131, 66, 18, 1, 0, 0),
(133, 67, 6, 1, 0, 0),
(135, 68, 11, 2, 0, 0),
(138, 69, 15, 1, 0, 0),
(139, 69, 17, 2, 0, 0),
(140, 46, 5, 1, 0, 0),
(141, 46, 11, 1, 0, 0),
(147, 71, 11, 1, 0, 0),
(148, 70, 15, 1, 0, 0),
(149, 70, 18, 1, 0, 0),
(151, 73, 11, 1, 0, 0),
(153, 74, 11, 1, 0, 0),
(156, 75, 7, 1, 0, 0),
(157, 75, 15, 1, 0, 0),
(159, 76, 11, 1, 0, 0),
(161, 77, 11, 1, 0, 0),
(166, 79, 11, 1, 0, 0),
(167, 78, 7, 1, 0, 0),
(168, 78, 15, 1, 0, 0),
(169, 80, 17, 1, 0, 0),
(173, 82, 15, 1, 0, 0),
(174, 82, 18, 1, 0, 0),
(175, 81, 15, 1, 0, 0),
(176, 48, 5, 1, 0, 0),
(177, 48, 7, 1, 0, 0),
(180, 83, 15, 1, 0, 0),
(181, 83, 17, 1, 0, 0),
(183, 84, 15, 1, 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table `ordre_reparation_besoins`
--

CREATE TABLE `ordre_reparation_besoins` (
  `intervention_id` bigint(20) NOT NULL,
  `besoin_client` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `ordre_reparation_besoins`
--

INSERT INTO `ordre_reparation_besoins` (`intervention_id`, `besoin_client`) VALUES
(82, 'vidange'),
(81, 'vidange'),
(48, 'vidange'),
(83, 'Vidange'),
(83, 'freinage'),
(84, 'vidange');

-- --------------------------------------------------------

--
-- Structure de la table `photo`
--

CREATE TABLE `photo` (
  `id` bigint(20) NOT NULL,
  `intervention_id` bigint(20) DEFAULT NULL,
  `url` text DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `date_ajout` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `photo`
--

INSERT INTO `photo` (`id`, `intervention_id`, `url`, `type`, `date_ajout`) VALUES
(12, 33, 'uploads/photos/1778096936451_Screenshot_2026-05-06_030253.png', 'AFTER', '2026-05-06 20:48:56'),
(13, 33, 'uploads/photos/1778097590544_Screenshot_2026-05-06_030237.png', 'BEFORE', '2026-05-06 20:59:50'),
(14, 48, 'uploads/photos/1778544055587_Screenshot_2026-05-06_030237.png', 'BEFORE', '2026-05-12 01:00:55'),
(15, 32, 'uploads/photos/1778730449370_images.jpg', 'BEFORE', '2026-05-14 04:47:29'),
(16, 68, 'uploads/photos/1780265672862_images.jpg', 'BEFORE', '2026-05-31 23:14:32'),
(17, 73, 'uploads/photos/1780517876836_battery-maintenance-action-truck-location-260nw-2550267203.webp', 'BEFORE', '2026-06-03 21:17:56'),
(18, 74, 'uploads/photos/1780518212469_battery-maintenance-action-truck-location-260nw-2550267203.webp', 'BEFORE', '2026-06-03 21:23:32'),
(19, 76, 'uploads/photos/1780545917362_battery-maintenance-action-truck-location-260nw-2550267203.webp', 'BEFORE', '2026-06-04 05:05:17'),
(20, 77, 'uploads/photos/1780549655170_battery-maintenance-action-truck-location-260nw-2550267203.webp', 'AFTER', '2026-06-04 06:07:35'),
(21, 79, 'uploads/photos/1782151444518_images_(1).jpg', 'INITIAL', '2026-06-22 19:04:04'),
(22, 78, 'uploads/photos/1782151459769_images_(1).jpg', 'INITIAL', '2026-06-22 19:04:19'),
(23, 80, 'uploads/photos/1782151532229_images_(1).jpg', 'INITIAL', '2026-06-22 19:05:32'),
(24, 80, 'uploads/photos/1782151532257_battery-maintenance-action-truck-location-260nw-2550267203.webp', 'INITIAL', '2026-06-22 19:05:32'),
(25, 81, 'uploads/photos/1782152930948_images_(1).jpg', 'INITIAL', '2026-06-22 19:28:50'),
(26, 82, 'uploads/photos/1782153320775_camion-ou-camion-service.jpg', 'INITIAL', '2026-06-22 19:35:20'),
(27, 83, 'uploads/photos/1782170524237_camion-ou-camion-service.jpg', 'INITIAL', '2026-06-23 00:22:04'),
(28, 84, 'uploads/photos/1788986386687_etat_init.webp', 'INITIAL', '2026-09-09 21:39:46');

-- --------------------------------------------------------

--
-- Structure de la table `piece`
--

CREATE TABLE `piece` (
  `id` bigint(20) NOT NULL,
  `nom` varchar(100) DEFAULT NULL,
  `quantite_stock` int(11) DEFAULT NULL,
  `prix` double DEFAULT NULL,
  `seuil_alerte` int(11) DEFAULT NULL,
  `fournisseur_id` bigint(20) DEFAULT NULL,
  `reference` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `piece`
--

INSERT INTO `piece` (`id`, `nom`, `quantite_stock`, `prix`, `seuil_alerte`, `fournisseur_id`, `reference`) VALUES
(5, 'disques', 1, 100, 0, 2, 'Système de freinage'),
(6, 'boîte de vitesses', 24, 400, 0, 1, 'Transmission'),
(7, 'filtre diesel', 103, 20, 0, 1, 'filters'),
(11, 'électrique piles', 32, 200, 0, 3, 'pils'),
(13, 'piston', 16, 200, 0, 3, 'Moteur et composants'),
(15, 'HUILE ', 2, 100, 0, 1, 'AGD1267'),
(17, 'frein', 84, 20, 5, 3, '12345'),
(18, 'filtreee', 15, 300, 3, 1, '32434');

-- --------------------------------------------------------

--
-- Structure de la table `prediction_panne`
--

CREATE TABLE `prediction_panne` (
  `id` bigint(20) NOT NULL,
  `vehicle_data_id` bigint(20) DEFAULT NULL,
  `probabilite` double DEFAULT NULL,
  `niveau_risque` varchar(50) DEFAULT NULL,
  `date_prediction` timestamp NOT NULL DEFAULT current_timestamp(),
  `recommendation` varchar(2000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `prediction_panne`
--

INSERT INTO `prediction_panne` (`id`, `vehicle_data_id`, `probabilite`, `niveau_risque`, `date_prediction`, `recommendation`) VALUES
(102, 104, 0.14, 'Faible', '2026-05-12 04:57:54', NULL),
(103, 105, 0.135, 'Faible', '2026-05-12 04:57:54', NULL),
(104, 106, 0.115, 'Faible', '2026-05-12 04:57:54', NULL),
(105, 107, 0.14, 'Faible', '2026-05-12 04:57:54', NULL),
(106, 108, 0.135, 'Faible', '2026-05-12 04:57:54', NULL),
(107, 109, 0.14, 'Faible', '2026-05-12 04:57:54', NULL),
(108, 111, 0.955, 'Élevé', '2026-05-12 04:58:26', NULL),
(109, 110, 0.955, 'Élevé', '2026-05-12 04:58:26', NULL),
(110, 112, 0.92, 'Élevé', '2026-05-12 04:58:26', NULL),
(111, 113, 0.92, 'Élevé', '2026-05-12 04:58:26', NULL),
(112, 114, 0.155, 'Faible', '2026-05-12 04:58:26', NULL),
(113, 115, 0.155, 'Faible', '2026-05-12 04:58:26', NULL),
(114, 117, 0.14, 'Faible', '2026-05-12 04:58:26', NULL),
(115, 116, 0.14, 'Faible', '2026-05-12 04:58:26', NULL),
(116, 119, 0.145, 'Faible', '2026-05-12 04:58:26', NULL),
(117, 118, 0.145, 'Faible', '2026-05-12 04:58:26', NULL),
(118, 120, 0.115, 'Faible', '2026-05-12 04:58:26', NULL),
(119, 121, 0.115, 'Faible', '2026-05-12 04:58:26', NULL),
(120, 122, 0.14, 'Faible', '2026-05-12 04:58:26', NULL),
(121, 123, 0.14, 'Faible', '2026-05-12 04:58:26', NULL),
(122, 124, 0.115, 'Faible', '2026-05-12 04:58:26', NULL),
(123, 125, 0.115, 'Faible', '2026-05-12 04:58:26', NULL),
(124, 126, 0.135, 'Faible', '2026-05-12 04:58:26', NULL),
(125, 128, 0.14, 'Faible', '2026-05-12 04:58:26', NULL),
(126, 127, 0.135, 'Faible', '2026-05-12 04:58:26', NULL),
(127, 129, 0.14, 'Faible', '2026-05-12 04:58:26', NULL),
(128, 131, 0.92, 'Élevé', '2026-05-12 05:00:51', NULL),
(129, 130, 0.955, 'Élevé', '2026-05-12 05:00:51', NULL),
(130, 132, 0.155, 'Faible', '2026-05-12 05:00:53', NULL),
(131, 134, 0.14, 'Faible', '2026-05-12 05:00:54', NULL),
(132, 133, 0.92, 'Élevé', '2026-05-12 05:00:54', NULL),
(133, 135, 0.145, 'Faible', '2026-05-12 05:00:54', NULL),
(134, 136, 0.155, 'Faible', '2026-05-12 05:00:55', NULL),
(135, 137, 0.115, 'Faible', '2026-05-12 05:00:55', NULL),
(136, 138, 0.14, 'Faible', '2026-05-12 05:00:55', NULL),
(137, 139, 0.14, 'Faible', '2026-05-12 05:00:55', NULL),
(138, 140, 0.145, 'Faible', '2026-05-12 05:00:55', NULL),
(139, 141, 0.115, 'Faible', '2026-05-12 05:00:55', NULL),
(140, 142, 0.115, 'Faible', '2026-05-12 05:00:55', NULL),
(141, 143, 0.135, 'Faible', '2026-05-12 05:00:55', NULL),
(142, 144, 0.14, 'Faible', '2026-05-12 05:00:55', NULL),
(143, 145, 0.14, 'Faible', '2026-05-12 05:00:55', NULL),
(144, 146, 0.115, 'Faible', '2026-05-12 05:00:55', NULL),
(145, 147, 0.135, 'Faible', '2026-05-12 05:00:55', NULL),
(146, 148, 0.14, 'Faible', '2026-05-12 05:00:55', NULL),
(147, 149, 0.955, 'Élevé', '2026-05-12 05:01:17', NULL),
(148, 150, 0.955, 'Élevé', '2026-05-12 05:01:22', NULL),
(149, 151, 0.955, 'Élevé', '2026-05-12 05:04:32', NULL),
(150, 152, 0.92, 'Élevé', '2026-05-12 05:04:38', NULL),
(151, 153, 0.955, 'Élevé', '2026-05-12 05:11:29', NULL),
(152, 154, 0.92, 'Élevé', '2026-05-12 05:11:32', NULL),
(153, 155, 0.155, 'Faible', '2026-05-12 05:11:33', NULL),
(154, 156, 0.14, 'Faible', '2026-05-12 05:11:33', NULL),
(155, 157, 0.145, 'Faible', '2026-05-12 05:11:33', NULL),
(156, 158, 0.115, 'Faible', '2026-05-12 05:11:33', NULL),
(157, 159, 0.14, 'Faible', '2026-05-12 05:11:33', NULL),
(158, 160, 0.115, 'Faible', '2026-05-12 05:11:33', NULL),
(159, 161, 0.135, 'Faible', '2026-05-12 05:11:33', NULL),
(160, 162, 0.14, 'Faible', '2026-05-12 05:11:33', NULL),
(161, 163, 0.955, 'Élevé', '2026-05-12 05:11:56', NULL),
(162, 164, 0.92, 'Élevé', '2026-05-12 05:11:57', NULL),
(163, 165, 0.155, 'Faible', '2026-05-12 05:11:59', NULL),
(164, 166, 0.14, 'Faible', '2026-05-12 05:11:59', NULL),
(165, 167, 0.145, 'Faible', '2026-05-12 05:11:59', NULL),
(166, 168, 0.115, 'Faible', '2026-05-12 05:11:59', NULL),
(167, 169, 0.14, 'Faible', '2026-05-12 05:11:59', NULL),
(168, 170, 0.115, 'Faible', '2026-05-12 05:11:59', NULL),
(169, 171, 0.135, 'Faible', '2026-05-12 05:11:59', NULL),
(170, 172, 0.14, 'Faible', '2026-05-12 05:11:59', NULL),
(171, 173, 0.955, 'Élevé', '2026-05-12 05:13:56', NULL),
(172, 174, 0.92, 'Élevé', '2026-05-12 05:13:58', NULL),
(173, 175, 0.155, 'Faible', '2026-05-12 05:13:59', NULL),
(174, 176, 0.14, 'Faible', '2026-05-12 05:13:59', NULL),
(175, 177, 0.145, 'Faible', '2026-05-12 05:13:59', NULL),
(176, 178, 0.115, 'Faible', '2026-05-12 05:13:59', NULL),
(177, 179, 0.14, 'Faible', '2026-05-12 05:13:59', NULL),
(178, 180, 0.115, 'Faible', '2026-05-12 05:13:59', NULL),
(179, 181, 0.135, 'Faible', '2026-05-12 05:13:59', NULL),
(180, 182, 0.14, 'Faible', '2026-05-12 05:13:59', NULL),
(181, 183, 0.955, 'Élevé', '2026-05-12 05:23:24', NULL),
(182, 184, 0.92, 'Élevé', '2026-05-12 05:23:25', NULL),
(183, 185, 0.155, 'Faible', '2026-05-12 05:23:27', NULL),
(184, 186, 0.14, 'Faible', '2026-05-12 05:23:28', NULL),
(185, 187, 0.145, 'Faible', '2026-05-12 05:23:28', NULL),
(186, 188, 0.115, 'Faible', '2026-05-12 05:23:28', NULL),
(187, 189, 0.14, 'Faible', '2026-05-12 05:23:28', NULL),
(188, 190, 0.115, 'Faible', '2026-05-12 05:23:28', NULL),
(189, 191, 0.135, 'Faible', '2026-05-12 05:23:28', NULL),
(190, 192, 0.14, 'Faible', '2026-05-12 05:23:28', NULL),
(191, 193, 0.955, 'Élevé', '2026-05-12 05:30:56', NULL),
(192, 194, 0.92, 'Élevé', '2026-05-12 05:30:57', NULL),
(193, 195, 0.155, 'Faible', '2026-05-12 05:30:57', NULL),
(194, 196, 0.14, 'Faible', '2026-05-12 05:30:57', NULL),
(195, 197, 0.145, 'Faible', '2026-05-12 05:30:57', NULL),
(196, 198, 0.115, 'Faible', '2026-05-12 05:30:57', NULL),
(197, 199, 0.14, 'Faible', '2026-05-12 05:30:57', NULL),
(198, 200, 0.115, 'Faible', '2026-05-12 05:30:57', NULL),
(199, 201, 0.135, 'Faible', '2026-05-12 05:30:57', NULL),
(200, 202, 0.14, 'Faible', '2026-05-12 05:30:58', NULL),
(201, 203, 0.955, 'Élevé', '2026-05-12 05:38:19', NULL),
(202, 204, 0.92, 'Élevé', '2026-05-12 05:38:20', NULL),
(203, 205, 0.155, 'Faible', '2026-05-12 05:38:21', NULL),
(204, 206, 0.14, 'Faible', '2026-05-12 05:38:21', NULL),
(205, 207, 0.145, 'Faible', '2026-05-12 05:38:21', NULL),
(206, 208, 0.115, 'Faible', '2026-05-12 05:38:21', NULL),
(207, 209, 0.14, 'Faible', '2026-05-12 05:38:21', NULL),
(208, 210, 0.25, 'Faible', '2026-05-12 05:38:21', NULL),
(209, 211, 0.135, 'Faible', '2026-05-12 05:38:21', NULL),
(210, 212, 0.14, 'Faible', '2026-05-12 05:38:21', NULL),
(211, 213, 0.25, 'Faible', '2026-05-12 05:38:51', NULL),
(212, 214, 0.25, 'Faible', '2026-05-12 05:38:55', NULL),
(213, 215, 0.955, 'Élevé', '2026-05-12 21:25:22', NULL),
(214, 216, 0.92, 'Élevé', '2026-05-12 21:25:23', NULL),
(215, 217, 0.155, 'Faible', '2026-05-12 21:25:24', NULL),
(216, 218, 0.14, 'Faible', '2026-05-12 21:25:24', NULL),
(217, 219, 0.145, 'Faible', '2026-05-12 21:25:24', NULL),
(218, 220, 0.115, 'Faible', '2026-05-12 21:25:24', NULL),
(219, 221, 0.14, 'Faible', '2026-05-12 21:25:24', NULL),
(220, 222, 0.25, 'Faible', '2026-05-12 21:25:25', NULL),
(221, 223, 0.135, 'Faible', '2026-05-12 21:25:25', NULL),
(222, 224, 0.14, 'Faible', '2026-05-12 21:25:25', NULL),
(223, 225, 0.955, 'Élevé', '2026-05-12 21:29:59', NULL),
(224, 226, 0.955, 'Élevé', '2026-05-12 21:30:23', NULL),
(225, 227, 0.92, 'Élevé', '2026-05-12 21:30:28', NULL),
(226, 228, 0.155, 'Faible', '2026-05-12 21:30:28', NULL),
(227, 229, 0.14, 'Faible', '2026-05-12 21:30:29', NULL),
(228, 230, 0.145, 'Faible', '2026-05-12 21:30:29', NULL),
(229, 231, 0.115, 'Faible', '2026-05-12 21:30:29', NULL),
(230, 232, 0.14, 'Faible', '2026-05-12 21:30:29', NULL),
(231, 233, 0.25, 'Faible', '2026-05-12 21:30:29', NULL),
(232, 234, 0.135, 'Faible', '2026-05-12 21:30:29', NULL),
(233, 235, 0.14, 'Faible', '2026-05-12 21:30:29', NULL),
(234, 236, 0.92, 'Élevé', '2026-05-12 21:43:39', NULL),
(235, 237, 0.14, 'Faible', '2026-05-12 21:43:53', NULL),
(236, 238, 0.955, 'Élevé', '2026-05-12 21:50:22', NULL),
(237, 239, 0.92, 'Élevé', '2026-05-12 21:50:26', NULL),
(238, 240, 0.155, 'Faible', '2026-05-12 21:50:27', NULL),
(239, 241, 0.14, 'Faible', '2026-05-12 21:50:27', NULL),
(240, 242, 0.145, 'Faible', '2026-05-12 21:50:27', NULL),
(241, 243, 0.115, 'Faible', '2026-05-12 21:50:28', NULL),
(242, 244, 0.14, 'Faible', '2026-05-12 21:50:28', NULL),
(243, 245, 0.25, 'Faible', '2026-05-12 21:50:28', NULL),
(244, 246, 0.135, 'Faible', '2026-05-12 21:50:28', NULL),
(245, 247, 0.14, 'Faible', '2026-05-12 21:50:28', NULL),
(246, 248, 0.145, 'Faible', '2026-05-12 21:56:11', NULL),
(247, 249, 0.145, 'Faible', '2026-05-12 21:56:23', NULL),
(248, 250, 0.145, 'Faible', '2026-05-12 22:08:07', NULL),
(249, 251, 0.14, 'Faible', '2026-05-12 22:12:47', NULL),
(250, 252, 0.955, 'Élevé', '2026-05-12 22:24:03', NULL),
(251, 253, 0.955, 'Élevé', '2026-05-12 22:25:44', NULL),
(252, 254, 0.14, 'Faible', '2026-05-12 22:25:50', NULL),
(253, 255, 0.14, 'Faible', '2026-05-12 22:29:08', NULL),
(254, 256, 0.955, 'Élevé', '2026-05-12 22:33:47', NULL),
(255, 257, 0.92, 'Élevé', '2026-05-12 22:33:47', NULL),
(256, 258, 0.155, 'Faible', '2026-05-12 22:33:47', NULL),
(257, 259, 0.14, 'Faible', '2026-05-12 22:33:47', NULL),
(258, 260, 0.145, 'Faible', '2026-05-12 22:33:47', NULL),
(259, 261, 0.115, 'Faible', '2026-05-12 22:33:47', NULL),
(260, 262, 0.14, 'Faible', '2026-05-12 22:33:47', NULL),
(261, 263, 0.25, 'Faible', '2026-05-12 22:33:47', NULL),
(262, 264, 0.135, 'Faible', '2026-05-12 22:33:47', NULL),
(263, 265, 0.14, 'Faible', '2026-05-12 22:33:47', NULL),
(264, 266, 0.14, 'Faible', '2026-05-12 22:33:47', NULL),
(265, 267, 0.14, 'Faible', '2026-05-12 22:40:03', NULL),
(266, 268, 0.955, 'Élevé', '2026-05-12 23:03:58', NULL),
(267, 269, 0.92, 'Élevé', '2026-05-12 23:03:59', NULL),
(268, 270, 0.155, 'Faible', '2026-05-12 23:04:00', NULL),
(269, 271, 0.14, 'Faible', '2026-05-12 23:04:00', NULL),
(270, 272, 0.145, 'Faible', '2026-05-12 23:04:01', NULL),
(271, 273, 0.115, 'Faible', '2026-05-12 23:04:01', NULL),
(272, 274, 0.14, 'Faible', '2026-05-12 23:04:01', NULL),
(273, 275, 0.905, 'Élevé', '2026-05-12 23:04:01', NULL),
(274, 276, 0.135, 'Faible', '2026-05-12 23:04:02', NULL),
(275, 277, 0.14, 'Faible', '2026-05-12 23:04:02', NULL),
(276, 278, 0.14, 'Faible', '2026-05-12 23:04:02', NULL),
(277, 279, 0.14, 'Faible', '2026-05-12 23:04:02', NULL),
(278, 280, 0.955, 'Élevé', '2026-05-13 22:12:51', NULL),
(279, 281, 0.92, 'Élevé', '2026-05-13 22:12:51', NULL),
(280, 282, 0.155, 'Faible', '2026-05-13 22:12:51', NULL),
(281, 283, 0.14, 'Faible', '2026-05-13 22:12:51', NULL),
(282, 284, 0.145, 'Faible', '2026-05-13 22:12:51', NULL),
(283, 285, 0.115, 'Faible', '2026-05-13 22:12:51', NULL),
(284, 286, 0.14, 'Faible', '2026-05-13 22:12:51', NULL),
(285, 287, 0.905, 'Élevé', '2026-05-13 22:12:51', NULL),
(286, 288, 0.135, 'Faible', '2026-05-13 22:12:52', NULL),
(287, 289, 0.14, 'Faible', '2026-05-13 22:12:52', NULL),
(288, 290, 0.14, 'Faible', '2026-05-13 22:12:52', NULL),
(289, 291, 0.14, 'Faible', '2026-05-13 22:12:52', NULL),
(290, 292, 0.13, 'Faible', '2026-05-13 22:27:41', NULL),
(291, 293, 0.125, 'Faible', '2026-05-13 22:29:00', NULL),
(292, 294, 0.955, 'Élevé', '2026-05-14 03:12:15', NULL),
(293, 295, 0.145, 'Faible', '2026-05-14 04:15:11', NULL),
(294, 296, 0.99, 'Élevé', '2026-05-14 04:26:13', NULL),
(295, 297, 1, 'Élevé', '2026-05-14 04:26:56', NULL),
(296, 298, 0.955, 'Élevé', '2026-05-14 04:27:12', NULL),
(297, 299, 0.99, 'Élevé', '2026-05-14 04:27:24', NULL),
(298, 300, 0.99, 'Élevé', '2026-05-14 04:29:41', NULL),
(299, 301, 0.13, 'Faible', '2026-05-14 04:59:15', NULL),
(300, 302, 0.145, 'Faible', '2026-05-15 01:51:21', NULL),
(301, 303, 0.955, 'Élevé', '2026-05-15 01:51:41', NULL),
(302, 304, 0.92, 'Élevé', '2026-05-15 01:51:42', NULL),
(303, 305, 0.155, 'Faible', '2026-05-15 01:51:43', NULL),
(304, 306, 0.14, 'Faible', '2026-05-15 01:51:43', NULL),
(305, 307, 0.145, 'Faible', '2026-05-15 01:51:43', NULL),
(306, 308, 0.115, 'Faible', '2026-05-15 01:51:43', NULL),
(307, 309, 0.145, 'Faible', '2026-05-15 01:51:43', NULL),
(308, 310, 0.905, 'Élevé', '2026-05-15 01:51:43', NULL),
(309, 311, 0.135, 'Faible', '2026-05-15 01:51:44', NULL),
(310, 312, 0.14, 'Faible', '2026-05-15 01:51:44', NULL),
(311, 313, 0.14, 'Faible', '2026-05-15 01:51:44', NULL),
(312, 314, 0.14, 'Faible', '2026-05-15 01:51:44', NULL),
(313, 315, 0.125, 'Faible', '2026-05-15 01:51:44', NULL),
(314, 316, 0.145, 'Faible', '2026-05-15 01:51:44', NULL),
(315, 317, 1, 'Élevé', '2026-05-15 01:58:35', NULL),
(316, 318, 0.955, 'Élevé', '2026-05-18 14:33:50', NULL),
(317, 319, 0.995, 'Élevé', '2026-05-18 14:33:51', NULL),
(318, 320, 0.155, 'Faible', '2026-05-18 14:33:52', NULL),
(319, 321, 0.14, 'Faible', '2026-05-18 14:33:52', NULL),
(320, 322, 0.145, 'Faible', '2026-05-18 14:33:52', NULL),
(321, 323, 0.115, 'Faible', '2026-05-18 14:33:52', NULL),
(322, 324, 0.145, 'Faible', '2026-05-18 14:33:52', NULL),
(323, 325, 0.905, 'Élevé', '2026-05-18 14:33:52', NULL),
(324, 326, 0.135, 'Faible', '2026-05-18 14:33:52', NULL),
(325, 327, 0.14, 'Faible', '2026-05-18 14:33:52', NULL),
(326, 328, 0.14, 'Faible', '2026-05-18 14:33:52', NULL),
(327, 329, 0.14, 'Faible', '2026-05-18 14:33:52', NULL),
(328, 330, 0.125, 'Faible', '2026-05-18 14:33:52', NULL),
(329, 331, 0.145, 'Faible', '2026-05-18 14:33:52', NULL),
(330, 332, 0.955, 'Élevé', '2026-05-18 15:48:05', NULL),
(331, 333, 0.955, 'Élevé', '2026-05-18 15:48:13', NULL),
(332, 334, 0.995, 'Élevé', '2026-05-18 15:48:13', NULL),
(333, 335, 0.155, 'Faible', '2026-05-18 15:48:18', NULL),
(334, 336, 0.14, 'Faible', '2026-05-18 15:48:18', NULL),
(335, 337, 0.145, 'Faible', '2026-05-18 15:48:18', NULL),
(336, 338, 0.115, 'Faible', '2026-05-18 15:48:18', NULL),
(337, 339, 0.145, 'Faible', '2026-05-18 15:48:18', NULL),
(338, 340, 0.905, 'Élevé', '2026-05-18 15:48:18', NULL),
(339, 341, 0.1, 'Faible', '2026-05-18 15:48:20', NULL),
(340, 342, 0.14, 'Faible', '2026-05-18 15:48:20', NULL),
(341, 343, 0.14, 'Faible', '2026-05-18 15:48:20', NULL),
(342, 344, 0.14, 'Faible', '2026-05-18 15:48:20', NULL),
(343, 345, 0.125, 'Faible', '2026-05-18 15:48:20', NULL),
(344, 346, 0.145, 'Faible', '2026-05-18 15:48:20', NULL),
(345, 347, 0.955, 'Élevé', '2026-05-18 15:51:59', NULL),
(346, 348, 0.995, 'Élevé', '2026-05-18 15:52:04', NULL),
(347, 349, 0.155, 'Faible', '2026-05-18 15:52:04', NULL),
(348, 350, 0.14, 'Faible', '2026-05-18 15:52:04', NULL),
(349, 351, 0.145, 'Faible', '2026-05-18 15:52:04', NULL),
(350, 352, 0.115, 'Faible', '2026-05-18 15:52:04', NULL),
(351, 353, 0.145, 'Faible', '2026-05-18 15:52:04', NULL),
(352, 354, 0.905, 'Élevé', '2026-05-18 15:52:04', NULL),
(353, 355, 0.1, 'Faible', '2026-05-18 15:52:04', NULL),
(354, 356, 0.14, 'Faible', '2026-05-18 15:52:04', NULL),
(355, 357, 0.14, 'Faible', '2026-05-18 15:52:04', NULL),
(356, 358, 0.14, 'Faible', '2026-05-18 15:52:04', NULL),
(357, 359, 0.125, 'Faible', '2026-05-18 15:52:04', NULL),
(358, 360, 0.145, 'Faible', '2026-05-18 15:52:04', NULL),
(359, 361, 0.955, 'Élevé', '2026-05-19 14:32:34', NULL),
(360, 362, 1, 'Élevé', '2026-05-19 14:39:35', NULL),
(361, 363, 0.955, 'Élevé', '2026-05-19 14:59:25', NULL),
(362, 364, 0.995, 'Élevé', '2026-05-19 14:59:25', NULL),
(363, 365, 0.155, 'Faible', '2026-05-19 14:59:37', NULL),
(364, 366, 0.14, 'Faible', '2026-05-19 14:59:37', NULL),
(365, 367, 0.145, 'Faible', '2026-05-19 14:59:37', NULL),
(366, 368, 0.115, 'Faible', '2026-05-19 14:59:37', NULL),
(367, 369, 0.145, 'Faible', '2026-05-19 14:59:37', NULL),
(368, 370, 0.905, 'Élevé', '2026-05-19 14:59:38', NULL),
(369, 371, 0.1, 'Faible', '2026-05-19 14:59:39', NULL),
(370, 372, 0.14, 'Faible', '2026-05-19 14:59:39', NULL),
(371, 373, 0.14, 'Faible', '2026-05-19 14:59:39', NULL),
(372, 374, 0.14, 'Faible', '2026-05-19 14:59:39', NULL),
(373, 375, 0.125, 'Faible', '2026-05-19 14:59:39', NULL),
(374, 376, 0.145, 'Faible', '2026-05-19 14:59:39', NULL),
(375, 406, 0.711306775138135, 'Risque élevé', '2026-06-15 19:05:25', NULL),
(376, 407, 0.6845886780667956, 'Risque élevé', '2026-06-15 19:07:20', NULL),
(377, 408, 0.6860382156800392, 'Risque élevé', '2026-06-15 19:07:26', NULL),
(378, 409, 0.7113067751381348, 'Risque élevé', '2026-06-15 19:15:37', 'Planifier une inspection dans les prochains jours. | Analyser les problèmes signalés par le conducteur.'),
(379, 410, 0.45119897620033383, 'Risque moyen', '2026-06-15 19:16:18', 'Programmer un contrôle préventif.'),
(380, 411, 0.6895342702007412, 'Risque élevé', '2026-06-15 19:16:21', 'Planifier une inspection dans les prochains jours. | Analyser les problèmes signalés par le conducteur.'),
(381, 412, 0.7113067751381348, 'Risque élevé', '2026-06-15 19:27:38', 'Planifier une inspection dans les prochains jours. | Analyser les problèmes signalés par le conducteur.'),
(382, 413, 0.6845886780667957, 'Risque élevé', '2026-06-15 19:27:38', 'Planifier une inspection dans les prochains jours. | Analyser les problèmes signalés par le conducteur.'),
(383, 414, 0.4381890832453172, 'Risque moyen', '2026-06-15 19:27:38', 'Programmer un contrôle préventif.'),
(384, 415, 0.34303693863134077, 'Risque faible', '2026-06-15 19:27:39', 'Aucune maintenance urgente. Continuer le suivi normal.'),
(385, 416, 0.49493274452100594, 'Risque moyen', '2026-06-15 19:27:39', 'Programmer un contrôle préventif.'),
(386, 417, 0.4871483638824603, 'Risque moyen', '2026-06-15 19:27:39', 'Programmer un contrôle préventif.'),
(387, 418, 0.44153091052254173, 'Risque moyen', '2026-06-15 19:27:39', 'Programmer un contrôle préventif.'),
(388, 419, 0.6073903292118408, 'Risque élevé', '2026-06-15 19:27:39', 'Planifier une inspection dans les prochains jours. | Analyser les problèmes signalés par le conducteur.'),
(389, 420, 0.5503550847631713, 'Risque moyen', '2026-06-15 19:27:39', 'Programmer un contrôle préventif. | Analyser les problèmes signalés par le conducteur.'),
(390, 421, 0.3658203111671421, 'Risque faible', '2026-06-15 19:27:39', 'Aucune maintenance urgente. Continuer le suivi normal.'),
(391, 422, 0.5185142310123851, 'Risque moyen', '2026-06-15 19:27:39', 'Programmer un contrôle préventif.'),
(392, 423, 0.4462974656589168, 'Risque moyen', '2026-06-15 19:27:39', 'Programmer un contrôle préventif.'),
(393, 424, 0.45119897620033406, 'Risque moyen', '2026-06-15 19:27:40', 'Programmer un contrôle préventif.'),
(394, 425, 0.6895342702007412, 'Risque élevé', '2026-06-15 19:27:40', 'Planifier une inspection dans les prochains jours. | Analyser les problèmes signalés par le conducteur.'),
(395, 426, 0.7113067751381348, 'Risque élevé', '2026-06-15 19:48:06', 'Planifier une inspection technique prioritaire avant la prochaine utilisation intensive. | Kilométrage très élevé : vérifier moteur, transmission, suspension et système de refroidissement. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité.'),
(396, 427, 0.6845886780667957, 'Risque élevé', '2026-06-15 19:48:06', 'Planifier une inspection technique prioritaire avant la prochaine utilisation intensive. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité.'),
(397, 428, 0.4381890832453172, 'Risque moyen', '2026-06-15 19:48:06', 'Programmer un contrôle préventif pour éviter une panne future. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Historique d’entretien faible : créer un plan de maintenance régulier. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(398, 429, 0.34303693863134077, 'Risque faible', '2026-06-15 19:48:07', 'Aucune maintenance urgente. Continuer le suivi normal du véhicule. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Historique d’entretien faible : créer un plan de maintenance régulier.'),
(399, 430, 0.49493274452100605, 'Risque moyen', '2026-06-15 19:48:07', 'Programmer un contrôle préventif pour éviter une panne future. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(400, 431, 0.4871483638824606, 'Risque moyen', '2026-06-15 19:48:07', 'Programmer un contrôle préventif pour éviter une panne future. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(401, 432, 0.44153091052254156, 'Risque moyen', '2026-06-15 19:48:07', 'Programmer un contrôle préventif pour éviter une panne future. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Historique d’entretien faible : créer un plan de maintenance régulier. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(402, 433, 0.6073903292118409, 'Risque élevé', '2026-06-15 19:48:07', 'Planifier une inspection technique prioritaire avant la prochaine utilisation intensive. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Plusieurs problèmes signalés : analyser les symptômes conducteur et vérifier les composants concernés.'),
(403, 434, 0.5503550847631713, 'Risque moyen', '2026-06-15 19:48:07', 'Programmer un contrôle préventif pour éviter une panne future. | Plusieurs problèmes signalés : analyser les symptômes conducteur et vérifier les composants concernés.'),
(404, 435, 0.3658203111671421, 'Risque faible', '2026-06-15 19:48:08', 'Aucune maintenance urgente. Continuer le suivi normal du véhicule. | Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d’usure. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Historique d’entretien faible : créer un plan de maintenance régulier.'),
(405, 436, 0.5185142310123853, 'Risque moyen', '2026-06-15 19:48:08', 'Programmer un contrôle préventif pour éviter une panne future. | Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d’usure. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(406, 437, 0.4462974656589166, 'Risque moyen', '2026-06-15 19:48:08', 'Programmer un contrôle préventif pour éviter une panne future. | Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d’usure. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Historique d’entretien faible : créer un plan de maintenance régulier. | Problème signalé : effectuer une vérification ciblée avant aggravation. | Moteur diesel avec kilométrage élevé : vérifier injecteurs, turbo, filtre à particules et système d’admission.'),
(407, 438, 0.45119897620033406, 'Risque moyen', '2026-06-15 19:48:08', 'Programmer un contrôle préventif pour éviter une panne future. | Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d’usure. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Historique d’entretien faible : créer un plan de maintenance régulier. | Problème signalé : effectuer une vérification ciblée avant aggravation. | Moteur diesel avec kilométrage élevé : vérifier injecteurs, turbo, filtre à particules et système d’admission.'),
(408, 439, 0.6895342702007412, 'Risque élevé', '2026-06-15 19:48:08', 'Planifier une inspection technique prioritaire avant la prochaine utilisation intensive. | Kilométrage très élevé : vérifier moteur, transmission, suspension et système de refroidissement. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité. | Transmission automatique : contrôler huile de boîte et comportement des passages de vitesse.'),
(409, 440, 0.7136990067087804, 'Risque élevé', '2026-07-13 17:57:48', 'Planifier une inspection technique prioritaire avant la prochaine utilisation intensive. | Kilométrage très élevé : vérifier moteur, transmission, suspension et système de refroidissement. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité.'),
(410, 441, 0.7182780577223159, 'Risque élevé', '2026-07-13 17:57:55', 'Planifier une inspection technique prioritaire avant la prochaine utilisation intensive. | Kilométrage très élevé : vérifier moteur, transmission, suspension et système de refroidissement. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité. | Pneus usés : remplacer ou contrôler rapidement les pneus pour éviter une perte d’adhérence.'),
(411, 442, 0.6886739913337718, 'Risque élevé', '2026-07-13 18:02:52', 'Planifier une inspection technique prioritaire avant la prochaine utilisation intensive. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité.'),
(412, 443, 0.687489075872676, 'Risque élevé', '2026-07-13 18:02:59', 'Planifier une inspection technique prioritaire avant la prochaine utilisation intensive. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité. | Pneus usés : remplacer ou contrôler rapidement les pneus pour éviter une perte d’adhérence. | Freins usés : contrôler plaquettes, disques et liquide de frein en priorité. | Batterie faible : tester la charge, l’alternateur et prévoir un remplacement si nécessaire.'),
(413, 444, 0.687489075872676, 'Risque élevé', '2026-07-13 18:03:04', 'Planifier une inspection technique prioritaire avant la prochaine utilisation intensive. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité. | Pneus usés : remplacer ou contrôler rapidement les pneus pour éviter une perte d’adhérence. | Freins usés : contrôler plaquettes, disques et liquide de frein en priorité. | Batterie faible : tester la charge, l’alternateur et prévoir un remplacement si nécessaire.'),
(414, 445, 0.44244545388030104, 'Risque moyen', '2026-07-13 18:03:19', 'Programmer un contrôle préventif pour éviter une panne future. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Historique d’entretien faible : créer un plan de maintenance régulier. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(415, 446, 0.4434021199546594, 'Risque moyen', '2026-07-13 18:03:30', 'Programmer un contrôle préventif pour éviter une panne future. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Historique d’entretien faible : créer un plan de maintenance régulier. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(416, 447, 0.4424454538803006, 'Risque moyen', '2026-07-13 18:04:13', 'Programmer un contrôle préventif pour éviter une panne future. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Historique d’entretien faible : créer un plan de maintenance régulier. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(417, 448, 0.4434021199546596, 'Risque moyen', '2026-07-13 18:04:20', 'Programmer un contrôle préventif pour éviter une panne future. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Historique d’entretien faible : créer un plan de maintenance régulier. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(418, 449, 0.6886739913337722, 'Risque élevé', '2026-07-13 18:19:29', 'Planifier une inspection technique prioritaire avant la prochaine utilisation intensive. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité.'),
(419, 450, 0.687489075872676, 'Risque élevé', '2026-07-13 18:19:35', 'Planifier une inspection technique prioritaire avant la prochaine utilisation intensive. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité. | Pneus usés : remplacer ou contrôler rapidement les pneus pour éviter une perte d’adhérence. | Freins usés : contrôler plaquettes, disques et liquide de frein en priorité. | Batterie faible : tester la charge, l’alternateur et prévoir un remplacement si nécessaire.'),
(420, 451, 0.4989134711737973, 'Risque moyen', '2026-07-13 18:20:00', 'Programmer un contrôle préventif pour éviter une panne future. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(421, 452, 0.5073079857689287, 'Risque moyen', '2026-07-13 18:20:26', 'Programmer un contrôle préventif pour éviter une panne future. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(422, 453, 0.7136990067087804, 'Risque élevé', '2026-07-13 18:20:44', 'Planifier une inspection technique prioritaire avant la prochaine utilisation intensive. | Kilométrage très élevé : vérifier moteur, transmission, suspension et système de refroidissement. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité.'),
(423, 454, 0.7182780577223159, 'Risque élevé', '2026-07-13 18:20:51', 'Planifier une inspection technique prioritaire avant la prochaine utilisation intensive. | Kilométrage très élevé : vérifier moteur, transmission, suspension et système de refroidissement. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité. | Pneus usés : remplacer ou contrôler rapidement les pneus pour éviter une perte d’adhérence.'),
(424, 455, 0.7182780577223159, 'Risque élevé', '2026-07-13 18:21:00', 'Planifier une inspection technique prioritaire avant la prochaine utilisation intensive. | Kilométrage très élevé : vérifier moteur, transmission, suspension et système de refroidissement. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité. | Pneus usés : remplacer ou contrôler rapidement les pneus pour éviter une perte d’adhérence.'),
(425, 456, 0.3540459367638645, 'Risque faible', '2026-07-13 18:21:37', 'Aucune maintenance urgente. Continuer le suivi normal du véhicule. | Historique d’entretien faible : créer un plan de maintenance régulier.'),
(426, 457, 0.3540459367638645, 'Risque faible', '2026-07-13 18:21:41', 'Aucune maintenance urgente. Continuer le suivi normal du véhicule. | Historique d’entretien faible : créer un plan de maintenance régulier.'),
(427, 458, 0.7259922849543323, 'Risque élevé', '2026-07-13 18:27:32', 'Planifier une inspection technique prioritaire avant la prochaine utilisation intensive. | Kilométrage très élevé : vérifier moteur, transmission, suspension et système de refroidissement. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité. | Moteur diesel avec kilométrage élevé : vérifier injecteurs, turbo, filtre à particules et système d’admission.'),
(428, 459, 0.6920871502906297, 'Risque élevé', '2026-07-13 18:27:32', 'Planifier une inspection technique prioritaire avant la prochaine utilisation intensive. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité.'),
(429, 460, 0.4385648589889362, 'Risque moyen', '2026-07-13 18:27:32', 'Programmer un contrôle préventif pour éviter une panne future. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Historique d’entretien faible : créer un plan de maintenance régulier. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(430, 461, 0.3372146733310655, 'Risque faible', '2026-07-13 18:27:32', 'Aucune maintenance urgente. Continuer le suivi normal du véhicule. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Historique d’entretien faible : créer un plan de maintenance régulier.'),
(431, 462, 0.5073079857689284, 'Risque moyen', '2026-07-13 18:27:33', 'Programmer un contrôle préventif pour éviter une panne future. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(432, 463, 0.4905936416598449, 'Risque moyen', '2026-07-13 18:27:33', 'Programmer un contrôle préventif pour éviter une panne future. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(433, 464, 0.45135780643761136, 'Risque moyen', '2026-07-13 18:27:33', 'Programmer un contrôle préventif pour éviter une panne future. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Historique d’entretien faible : créer un plan de maintenance régulier. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(434, 465, 0.6507000191185583, 'Risque élevé', '2026-07-13 18:27:33', 'Planifier une inspection technique prioritaire avant la prochaine utilisation intensive. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité.'),
(435, 466, 0.5633160364457835, 'Risque moyen', '2026-07-13 18:27:33', 'Programmer un contrôle préventif pour éviter une panne future. | Plusieurs problèmes signalés : analyser les symptômes conducteur et vérifier les composants concernés.'),
(436, 467, 0.44248092780062165, 'Risque moyen', '2026-07-13 18:27:33', 'Programmer un contrôle préventif pour éviter une panne future. | Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d’usure. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Historique d’entretien faible : créer un plan de maintenance régulier. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(437, 468, 0.576416741431456, 'Risque moyen', '2026-07-13 18:27:33', 'Programmer un contrôle préventif pour éviter une panne future. | Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d’usure. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Plusieurs problèmes signalés : analyser les symptômes conducteur et vérifier les composants concernés. | Pneus usés : remplacer ou contrôler rapidement les pneus pour éviter une perte d’adhérence. | Batterie faible : tester la charge, l’alternateur et prévoir un remplacement si nécessaire.'),
(438, 469, 0.4999023353054605, 'Risque moyen', '2026-07-13 18:27:33', 'Programmer un contrôle préventif pour éviter une panne future. | Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d’usure. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(439, 470, 0.5257388313105972, 'Risque moyen', '2026-07-13 18:27:34', 'Programmer un contrôle préventif pour éviter une panne future. | Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d’usure. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(440, 471, 0.7020402829480858, 'Risque élevé', '2026-07-13 18:27:34', 'Planifier une inspection technique prioritaire avant la prochaine utilisation intensive. | Kilométrage très élevé : vérifier moteur, transmission, suspension et système de refroidissement. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité. | Pneus usés : remplacer ou contrôler rapidement les pneus pour éviter une perte d’adhérence. | Batterie faible : tester la charge, l’alternateur et prévoir un remplacement si nécessaire.'),
(441, 472, 0.3540459367638645, 'Risque faible', '2026-07-13 18:27:34', 'Aucune maintenance urgente. Continuer le suivi normal du véhicule. | Historique d’entretien faible : créer un plan de maintenance régulier.'),
(442, 473, 0.7259922849543325, 'Risque élevé', '2026-07-13 18:28:24', 'Planifier une inspection technique prioritaire avant la prochaine utilisation intensive. | Kilométrage très élevé : vérifier moteur, transmission, suspension et système de refroidissement. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité. | Moteur diesel avec kilométrage élevé : vérifier injecteurs, turbo, filtre à particules et système d’admission.'),
(443, 474, 0.6920871502906298, 'Risque élevé', '2026-07-13 18:28:24', 'Planifier une inspection technique prioritaire avant la prochaine utilisation intensive. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité.'),
(444, 475, 0.43856485898893655, 'Risque moyen', '2026-07-13 18:28:24', 'Programmer un contrôle préventif pour éviter une panne future. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Historique d’entretien faible : créer un plan de maintenance régulier. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(445, 476, 0.33721467333106553, 'Risque faible', '2026-07-13 18:28:25', 'Aucune maintenance urgente. Continuer le suivi normal du véhicule. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Historique d’entretien faible : créer un plan de maintenance régulier.'),
(446, 477, 0.5073079857689285, 'Risque moyen', '2026-07-13 18:28:25', 'Programmer un contrôle préventif pour éviter une panne future. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(447, 478, 0.49059364165984504, 'Risque moyen', '2026-07-13 18:28:25', 'Programmer un contrôle préventif pour éviter une panne future. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(448, 479, 0.4513578064376112, 'Risque moyen', '2026-07-13 18:28:25', 'Programmer un contrôle préventif pour éviter une panne future. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Historique d’entretien faible : créer un plan de maintenance régulier. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(449, 480, 0.6507000191185585, 'Risque élevé', '2026-07-13 18:28:25', 'Planifier une inspection technique prioritaire avant la prochaine utilisation intensive. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité.'),
(450, 481, 0.5633160364457832, 'Risque moyen', '2026-07-13 18:28:25', 'Programmer un contrôle préventif pour éviter une panne future. | Plusieurs problèmes signalés : analyser les symptômes conducteur et vérifier les composants concernés.'),
(451, 482, 0.4424809278006215, 'Risque moyen', '2026-07-13 18:28:25', 'Programmer un contrôle préventif pour éviter une panne future. | Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d’usure. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Historique d’entretien faible : créer un plan de maintenance régulier. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(452, 483, 0.5764167414314562, 'Risque moyen', '2026-07-13 18:28:26', 'Programmer un contrôle préventif pour éviter une panne future. | Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d’usure. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Plusieurs problèmes signalés : analyser les symptômes conducteur et vérifier les composants concernés. | Pneus usés : remplacer ou contrôler rapidement les pneus pour éviter une perte d’adhérence. | Batterie faible : tester la charge, l’alternateur et prévoir un remplacement si nécessaire.'),
(453, 484, 0.4999023353054603, 'Risque moyen', '2026-07-13 18:28:26', 'Programmer un contrôle préventif pour éviter une panne future. | Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d’usure. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(454, 485, 0.5257388313105973, 'Risque moyen', '2026-07-13 18:28:26', 'Programmer un contrôle préventif pour éviter une panne future. | Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d’usure. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(455, 486, 0.702040282948086, 'Risque élevé', '2026-07-13 18:28:26', 'Planifier une inspection technique prioritaire avant la prochaine utilisation intensive. | Kilométrage très élevé : vérifier moteur, transmission, suspension et système de refroidissement. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité. | Pneus usés : remplacer ou contrôler rapidement les pneus pour éviter une perte d’adhérence. | Batterie faible : tester la charge, l’alternateur et prévoir un remplacement si nécessaire.'),
(456, 487, 0.35404593676386453, 'Risque faible', '2026-07-13 18:28:26', 'Aucune maintenance urgente. Continuer le suivi normal du véhicule. | Historique d’entretien faible : créer un plan de maintenance régulier.'),
(457, 488, 0.6908406886598222, 'Risque élevé', '2026-07-13 18:28:43', 'Planifier une inspection technique prioritaire avant la prochaine utilisation intensive. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité. | Pneus usés : remplacer ou contrôler rapidement les pneus pour éviter une perte d’adhérence. | Freins usés : contrôler plaquettes, disques et liquide de frein en priorité. | Batterie faible : tester la charge, l’alternateur et prévoir un remplacement si nécessaire.'),
(458, 489, 0.5073079857689287, 'Risque moyen', '2026-07-13 18:29:09', 'Programmer un contrôle préventif pour éviter une panne future. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(459, 490, 0.8190674174567398, 'Risque critique', '2026-07-13 19:03:19', 'Maintenance urgente recommandée : immobiliser le véhicule et effectuer un diagnostic complet. | Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d’usure. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Historique d’entretien faible : créer un plan de maintenance régulier. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité.'),
(460, 491, 0.8190674174567398, 'Risque critique', '2026-07-14 01:22:55', 'Maintenance urgente recommandée : immobiliser le véhicule et effectuer un diagnostic complet. | Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d’usure. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Historique d’entretien faible : créer un plan de maintenance régulier. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité.'),
(461, 492, 0.8254737243563816, 'Risque critique', '2026-07-15 17:05:04', 'Maintenance urgente recommandée : immobiliser le véhicule et effectuer un diagnostic complet. | Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d’usure. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Historique d’entretien faible : créer un plan de maintenance régulier. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité. | Pneus moyens : vérifier pression, usure et parallélisme.'),
(462, 493, 0.9542650651964217, 'Risque critique', '2026-07-19 22:06:19', 'Maintenance urgente recommandée : immobiliser le véhicule et effectuer un diagnostic complet. | Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d’usure. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Historique d’entretien faible : créer un plan de maintenance régulier. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité.'),
(463, 494, 0.8710279521696984, 'Risque critique', '2026-07-19 22:06:45', 'Maintenance urgente recommandée : immobiliser le véhicule et effectuer un diagnostic complet. | Kilométrage très élevé : vérifier moteur, transmission, suspension et système de refroidissement. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité. | Moteur diesel avec kilométrage élevé : vérifier injecteurs, turbo, filtre à particules et système d’admission.'),
(464, 495, 0.9029553962960432, 'Risque critique', '2026-07-19 22:06:45', 'Maintenance urgente recommandée : immobiliser le véhicule et effectuer un diagnostic complet. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité.'),
(465, 496, 0.18068625078697031, 'Risque faible', '2026-07-19 22:06:45', 'Aucune maintenance urgente. Continuer le suivi normal du véhicule. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Historique d’entretien faible : créer un plan de maintenance régulier. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(466, 497, 0.2188237169462228, 'Risque faible', '2026-07-19 22:06:45', 'Aucune maintenance urgente. Continuer le suivi normal du véhicule. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Historique d’entretien faible : créer un plan de maintenance régulier.'),
(467, 498, 0.24835304889577864, 'Risque faible', '2026-07-19 22:06:45', 'Aucune maintenance urgente. Continuer le suivi normal du véhicule. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(468, 499, 0.21872119387041855, 'Risque faible', '2026-07-19 22:06:45', 'Aucune maintenance urgente. Continuer le suivi normal du véhicule. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(469, 500, 0.21195317861437504, 'Risque faible', '2026-07-19 22:06:45', 'Aucune maintenance urgente. Continuer le suivi normal du véhicule. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Historique d’entretien faible : créer un plan de maintenance régulier. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(470, 501, 0.9212852599124699, 'Risque critique', '2026-07-19 22:06:46', 'Maintenance urgente recommandée : immobiliser le véhicule et effectuer un diagnostic complet. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité.'),
(471, 502, 0.26821107717649034, 'Risque faible', '2026-07-19 22:06:46', 'Aucune maintenance urgente. Continuer le suivi normal du véhicule. | Plusieurs problèmes signalés : analyser les symptômes conducteur et vérifier les composants concernés.');
INSERT INTO `prediction_panne` (`id`, `vehicle_data_id`, `probabilite`, `niveau_risque`, `date_prediction`, `recommendation`) VALUES
(472, 503, 0.1859228607280777, 'Risque faible', '2026-07-19 22:06:46', 'Aucune maintenance urgente. Continuer le suivi normal du véhicule. | Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d’usure. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Historique d’entretien faible : créer un plan de maintenance régulier. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(473, 504, 0.9542296709460308, 'Risque critique', '2026-07-19 22:06:46', 'Maintenance urgente recommandée : immobiliser le véhicule et effectuer un diagnostic complet. | Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d’usure. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Plusieurs problèmes signalés : analyser les symptômes conducteur et vérifier les composants concernés. | Pneus usés : remplacer ou contrôler rapidement les pneus pour éviter une perte d’adhérence. | Batterie faible : tester la charge, l’alternateur et prévoir un remplacement si nécessaire.'),
(474, 505, 0.19024234903573348, 'Risque faible', '2026-07-19 22:06:46', 'Aucune maintenance urgente. Continuer le suivi normal du véhicule. | Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d’usure. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(475, 506, 0.23834386327764495, 'Risque faible', '2026-07-19 22:06:46', 'Aucune maintenance urgente. Continuer le suivi normal du véhicule. | Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d’usure. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(476, 507, 0.9799660201583826, 'Risque critique', '2026-07-19 22:06:46', 'Maintenance urgente recommandée : immobiliser le véhicule et effectuer un diagnostic complet. | Kilométrage très élevé : vérifier moteur, transmission, suspension et système de refroidissement. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité. | Pneus usés : remplacer ou contrôler rapidement les pneus pour éviter une perte d’adhérence. | Batterie faible : tester la charge, l’alternateur et prévoir un remplacement si nécessaire.'),
(477, 508, 0.09899915057964953, 'Risque faible', '2026-07-19 22:06:47', 'Aucune maintenance urgente. Continuer le suivi normal du véhicule. | Historique d’entretien faible : créer un plan de maintenance régulier.'),
(478, 509, 0.13299872301283483, 'Risque faible', '2026-07-19 22:50:02', 'Aucune maintenance urgente. Continuer le suivi normal du véhicule. | Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d’usure. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Historique d’entretien faible : créer un plan de maintenance régulier. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(479, 510, 0.9906490855098956, 'Risque critique', '2026-09-08 17:32:14', 'Maintenance urgente recommandée : immobiliser le véhicule et effectuer un diagnostic complet. | Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d’usure. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité.'),
(480, 511, 0.9906490855098956, 'Risque critique', '2026-09-08 17:32:30', 'Maintenance urgente recommandée : immobiliser le véhicule et effectuer un diagnostic complet. | Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d’usure. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité.'),
(481, 512, 0.9906490855098956, 'Risque critique', '2026-09-08 17:33:46', 'Maintenance urgente recommandée : immobiliser le véhicule et effectuer un diagnostic complet. | Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d’usure. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité.'),
(482, 513, 0.9906490855098956, 'Risque critique', '2026-09-08 17:33:53', 'Maintenance urgente recommandée : immobiliser le véhicule et effectuer un diagnostic complet. | Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d’usure. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité.'),
(483, 514, 0.8710279521696984, 'Risque critique', '2026-09-08 17:34:40', 'Maintenance urgente recommandée : immobiliser le véhicule et effectuer un diagnostic complet. | Kilométrage très élevé : vérifier moteur, transmission, suspension et système de refroidissement. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité. | Moteur diesel avec kilométrage élevé : vérifier injecteurs, turbo, filtre à particules et système d’admission.'),
(484, 515, 0.9906490855098956, 'Risque critique', '2026-09-08 17:35:03', 'Maintenance urgente recommandée : immobiliser le véhicule et effectuer un diagnostic complet. | Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d’usure. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité.'),
(485, 516, 0.9906490855098956, 'Risque critique', '2026-09-08 17:35:10', 'Maintenance urgente recommandée : immobiliser le véhicule et effectuer un diagnostic complet. | Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d’usure. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité.'),
(486, 517, 0.9959823726859003, 'Risque critique', '2026-09-08 17:37:03', 'Maintenance urgente recommandée : immobiliser le véhicule et effectuer un diagnostic complet. | Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d’usure. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité. | Batterie faible : tester la charge, l’alternateur et prévoir un remplacement si nécessaire.'),
(487, 518, 0.1839181403288973, 'Risque faible', '2026-09-08 17:38:56', 'Aucune maintenance urgente. Continuer le suivi normal du véhicule. | Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d’usure. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(488, 519, 0.9395786791185494, 'Risque critique', '2026-09-08 17:39:13', 'Maintenance urgente recommandée : immobiliser le véhicule et effectuer un diagnostic complet. | Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d’usure. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Problème signalé : effectuer une vérification ciblée avant aggravation. | Batterie faible : tester la charge, l’alternateur et prévoir un remplacement si nécessaire.'),
(489, 520, 0.8576078967920838, 'Risque critique', '2026-09-08 17:41:38', 'Maintenance urgente recommandée : immobiliser le véhicule et effectuer un diagnostic complet. | Kilométrage très élevé : vérifier moteur, transmission, suspension et système de refroidissement. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité. | Transmission automatique : contrôler huile de boîte et comportement des passages de vitesse.'),
(490, 521, 0.8576078967920838, 'Risque critique', '2026-09-08 17:41:58', 'Maintenance urgente recommandée : immobiliser le véhicule et effectuer un diagnostic complet. | Kilométrage très élevé : vérifier moteur, transmission, suspension et système de refroidissement. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité. | Transmission automatique : contrôler huile de boîte et comportement des passages de vitesse.'),
(491, 522, 0.9029553962960432, 'Risque critique', '2026-09-08 17:41:58', 'Maintenance urgente recommandée : immobiliser le véhicule et effectuer un diagnostic complet. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité.'),
(492, 523, 0.18733521253059998, 'Risque faible', '2026-09-08 17:41:58', 'Aucune maintenance urgente. Continuer le suivi normal du véhicule. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Historique d’entretien faible : créer un plan de maintenance régulier. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(493, 524, 0.2188237169462228, 'Risque faible', '2026-09-08 17:41:58', 'Aucune maintenance urgente. Continuer le suivi normal du véhicule. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Historique d’entretien faible : créer un plan de maintenance régulier.'),
(494, 525, 0.19730476396817462, 'Risque faible', '2026-09-08 17:41:59', 'Aucune maintenance urgente. Continuer le suivi normal du véhicule. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(495, 526, 0.21872119387041855, 'Risque faible', '2026-09-08 17:41:59', 'Aucune maintenance urgente. Continuer le suivi normal du véhicule. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(496, 527, 0.21195317861437504, 'Risque faible', '2026-09-08 17:41:59', 'Aucune maintenance urgente. Continuer le suivi normal du véhicule. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Historique d’entretien faible : créer un plan de maintenance régulier. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(497, 528, 0.9212852599124699, 'Risque critique', '2026-09-08 17:41:59', 'Maintenance urgente recommandée : immobiliser le véhicule et effectuer un diagnostic complet. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité.'),
(498, 529, 0.26821107717649034, 'Risque faible', '2026-09-08 17:41:59', 'Aucune maintenance urgente. Continuer le suivi normal du véhicule. | Plusieurs problèmes signalés : analyser les symptômes conducteur et vérifier les composants concernés.'),
(499, 530, 0.1859228607280777, 'Risque faible', '2026-09-08 17:41:59', 'Aucune maintenance urgente. Continuer le suivi normal du véhicule. | Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d’usure. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Historique d’entretien faible : créer un plan de maintenance régulier. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(500, 531, 0.9542296709460308, 'Risque critique', '2026-09-08 17:41:59', 'Maintenance urgente recommandée : immobiliser le véhicule et effectuer un diagnostic complet. | Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d’usure. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Plusieurs problèmes signalés : analyser les symptômes conducteur et vérifier les composants concernés. | Pneus usés : remplacer ou contrôler rapidement les pneus pour éviter une perte d’adhérence. | Batterie faible : tester la charge, l’alternateur et prévoir un remplacement si nécessaire.'),
(501, 532, 0.19024234903573348, 'Risque faible', '2026-09-08 17:41:59', 'Aucune maintenance urgente. Continuer le suivi normal du véhicule. | Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d’usure. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(502, 533, 0.23834386327764495, 'Risque faible', '2026-09-08 17:41:59', 'Aucune maintenance urgente. Continuer le suivi normal du véhicule. | Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d’usure. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(503, 534, 0.9799660201583826, 'Risque critique', '2026-09-08 17:42:00', 'Maintenance urgente recommandée : immobiliser le véhicule et effectuer un diagnostic complet. | Kilométrage très élevé : vérifier moteur, transmission, suspension et système de refroidissement. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité. | Pneus usés : remplacer ou contrôler rapidement les pneus pour éviter une perte d’adhérence. | Batterie faible : tester la charge, l’alternateur et prévoir un remplacement si nécessaire.'),
(504, 535, 0.09899915057964953, 'Risque faible', '2026-09-08 17:42:00', 'Aucune maintenance urgente. Continuer le suivi normal du véhicule. | Historique d’entretien faible : créer un plan de maintenance régulier.'),
(505, 536, 0.9906490855098956, 'Risque critique', '2026-09-08 17:51:09', 'Maintenance urgente recommandée : immobiliser le véhicule et effectuer un diagnostic complet. | Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d’usure. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité. | Batterie défectueuse : remplacement recommandé avant remise en service.'),
(506, 537, 0.9906490855098956, 'Risque critique', '2026-09-08 17:51:45', 'Maintenance urgente recommandée : immobiliser le véhicule et effectuer un diagnostic complet. | Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d’usure. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité. | Batterie défectueuse : remplacement recommandé avant remise en service.'),
(507, 538, 0.8576078967920838, 'Risque critique', '2026-09-08 17:52:59', 'Maintenance urgente recommandée : immobiliser le véhicule et effectuer un diagnostic complet. | Kilométrage très élevé : vérifier moteur, transmission, suspension et système de refroidissement. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité. | Transmission automatique : contrôler huile de boîte et comportement des passages de vitesse.'),
(508, 539, 0.9029553962960434, 'Risque critique', '2026-09-08 17:52:59', 'Maintenance urgente recommandée : immobiliser le véhicule et effectuer un diagnostic complet. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité.'),
(509, 540, 0.18733521253059998, 'Risque faible', '2026-09-08 17:52:59', 'Aucune maintenance urgente. Continuer le suivi normal du véhicule. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Historique d’entretien faible : créer un plan de maintenance régulier. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(510, 541, 0.2188237169462228, 'Risque faible', '2026-09-08 17:52:59', 'Aucune maintenance urgente. Continuer le suivi normal du véhicule. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Historique d’entretien faible : créer un plan de maintenance régulier.'),
(511, 542, 0.19730476396817462, 'Risque faible', '2026-09-08 17:53:00', 'Aucune maintenance urgente. Continuer le suivi normal du véhicule. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(512, 543, 0.21872119387041855, 'Risque faible', '2026-09-08 17:53:00', 'Aucune maintenance urgente. Continuer le suivi normal du véhicule. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(513, 544, 0.21195317861437504, 'Risque faible', '2026-09-08 17:53:00', 'Aucune maintenance urgente. Continuer le suivi normal du véhicule. | Véhicule ancien : contrôler l’état mécanique général, les durites, joints et composants électriques. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Historique d’entretien faible : créer un plan de maintenance régulier. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(514, 545, 0.9212852599124699, 'Risque critique', '2026-09-08 17:53:00', 'Maintenance urgente recommandée : immobiliser le véhicule et effectuer un diagnostic complet. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité.'),
(515, 546, 0.26821107717649034, 'Risque faible', '2026-09-08 17:53:00', 'Aucune maintenance urgente. Continuer le suivi normal du véhicule. | Plusieurs problèmes signalés : analyser les symptômes conducteur et vérifier les composants concernés.'),
(516, 547, 0.1859228607280777, 'Risque faible', '2026-09-08 17:53:00', 'Aucune maintenance urgente. Continuer le suivi normal du véhicule. | Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d’usure. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Historique d’entretien faible : créer un plan de maintenance régulier. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(517, 548, 0.9542296709460308, 'Risque critique', '2026-09-08 17:53:00', 'Maintenance urgente recommandée : immobiliser le véhicule et effectuer un diagnostic complet. | Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d’usure. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Plusieurs problèmes signalés : analyser les symptômes conducteur et vérifier les composants concernés. | Pneus usés : remplacer ou contrôler rapidement les pneus pour éviter une perte d’adhérence. | Batterie faible : tester la charge, l’alternateur et prévoir un remplacement si nécessaire.'),
(518, 549, 0.19024234903573348, 'Risque faible', '2026-09-08 17:53:00', 'Aucune maintenance urgente. Continuer le suivi normal du véhicule. | Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d’usure. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(519, 550, 0.23834386327764495, 'Risque faible', '2026-09-08 17:53:01', 'Aucune maintenance urgente. Continuer le suivi normal du véhicule. | Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d’usure. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Problème signalé : effectuer une vérification ciblée avant aggravation.'),
(520, 551, 0.9799660201583826, 'Risque critique', '2026-09-08 17:53:01', 'Maintenance urgente recommandée : immobiliser le véhicule et effectuer un diagnostic complet. | Kilométrage très élevé : vérifier moteur, transmission, suspension et système de refroidissement. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Nombre élevé de problèmes signalés : réaliser un diagnostic approfondi avec priorité sécurité. | Pneus usés : remplacer ou contrôler rapidement les pneus pour éviter une perte d’adhérence. | Batterie faible : tester la charge, l’alternateur et prévoir un remplacement si nécessaire.'),
(521, 552, 0.09899915057964953, 'Risque faible', '2026-09-08 17:53:01', 'Aucune maintenance urgente. Continuer le suivi normal du véhicule. | Historique d’entretien faible : créer un plan de maintenance régulier.'),
(522, 553, 0.95, 'Risque critique', '2026-09-08 17:53:41', 'Maintenance urgente recommandée : immobiliser le véhicule et effectuer un diagnostic complet. | Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d’usure. | Entretien à prévoir : contrôler huile moteur, filtres, freins et pneus. | Historique d’entretien faible : créer un plan de maintenance régulier. | Pneus moyens : vérifier pression, usure et parallélisme. | Freins à surveiller : prévoir un contrôle du système de freinage.'),
(523, 554, 0.8576078967920838, 'Risque critique', '2026-09-08 18:21:31', 'Un besoin de maintenance est indiqué pour cette observation. Il est recommandé d\'effectuer un contrôle du véhicule afin de déterminer les actions de maintenance appropriées. Kilométrage très élevé : contrôler le moteur, la transmission, la suspension et le système de refroidissement. Véhicule ancien : contrôler l\'état mécanique général, les durites, les joints et les composants électriques. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Nombre élevé de problèmes signalés : effectuer un diagnostic approfondi des composants concernés. Transmission automatique avec kilométrage élevé : contrôler l\'huile de boîte et le comportement des passages de vitesse.'),
(524, 555, 0.9029553962960432, 'Risque critique', '2026-09-08 18:21:31', 'Un besoin de maintenance est indiqué pour cette observation. Il est recommandé d\'effectuer un contrôle du véhicule afin de déterminer les actions de maintenance appropriées. Nombre élevé de problèmes signalés : effectuer un diagnostic approfondi des composants concernés.'),
(525, 556, 0.1873352125306, 'Risque faible', '2026-09-08 18:21:31', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Véhicule ancien : contrôler l\'état mécanique général, les durites, les joints et les composants électriques. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Historique d\'entretien faible : mettre en place un suivi de maintenance régulier. Un problème est signalé : effectuer une vérification ciblée.'),
(526, 557, 0.2188237169462228, 'Risque faible', '2026-09-08 18:21:32', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Véhicule ancien : contrôler l\'état mécanique général, les durites, les joints et les composants électriques. Historique d\'entretien faible : mettre en place un suivi de maintenance régulier.'),
(527, 558, 0.19730476396817462, 'Risque faible', '2026-09-08 18:21:32', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Un problème est signalé : effectuer une vérification ciblée.'),
(528, 559, 0.21872119387041855, 'Risque faible', '2026-09-08 18:21:32', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Véhicule ancien : contrôler l\'état mécanique général, les durites, les joints et les composants électriques. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Un problème est signalé : effectuer une vérification ciblée.'),
(529, 560, 0.21195317861437504, 'Risque faible', '2026-09-08 18:21:32', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Véhicule ancien : contrôler l\'état mécanique général, les durites, les joints et les composants électriques. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Historique d\'entretien faible : mettre en place un suivi de maintenance régulier. Un problème est signalé : effectuer une vérification ciblée.'),
(530, 561, 0.9212852599124699, 'Risque critique', '2026-09-08 18:21:32', 'Un besoin de maintenance est indiqué pour cette observation. Il est recommandé d\'effectuer un contrôle du véhicule afin de déterminer les actions de maintenance appropriées. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Nombre élevé de problèmes signalés : effectuer un diagnostic approfondi des composants concernés.'),
(531, 562, 0.26821107717649034, 'Risque faible', '2026-09-08 18:21:32', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Plusieurs problèmes sont signalés : vérifier les composants concernés et l\'historique des interventions.'),
(532, 563, 0.1859228607280777, 'Risque faible', '2026-09-08 18:21:32', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d\'usure. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Historique d\'entretien faible : mettre en place un suivi de maintenance régulier. Un problème est signalé : effectuer une vérification ciblée.'),
(533, 564, 0.9542296709460308, 'Risque critique', '2026-09-08 18:21:32', 'Un besoin de maintenance est indiqué pour cette observation. Il est recommandé d\'effectuer un contrôle du véhicule afin de déterminer les actions de maintenance appropriées. Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d\'usure. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Plusieurs problèmes sont signalés : vérifier les composants concernés et l\'historique des interventions. État des pneus dégradé : contrôler leur usure, leur pression et leur état général. Batterie faible : contrôler son niveau de charge et le fonctionnement de l\'alternateur.'),
(534, 565, 0.19024234903573348, 'Risque faible', '2026-09-08 18:21:32', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d\'usure. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Un problème est signalé : effectuer une vérification ciblée.'),
(535, 566, 0.23834386327764495, 'Risque faible', '2026-09-08 18:21:33', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d\'usure. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Un problème est signalé : effectuer une vérification ciblée.'),
(536, 567, 0.9799660201583826, 'Risque critique', '2026-09-08 18:21:33', 'Un besoin de maintenance est indiqué pour cette observation. Il est recommandé d\'effectuer un contrôle du véhicule afin de déterminer les actions de maintenance appropriées. Kilométrage très élevé : contrôler le moteur, la transmission, la suspension et le système de refroidissement. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Nombre élevé de problèmes signalés : effectuer un diagnostic approfondi des composants concernés. État des pneus dégradé : contrôler leur usure, leur pression et leur état général. Batterie faible : contrôler son niveau de charge et le fonctionnement de l\'alternateur.'),
(537, 568, 0.09899915057964953, 'Risque faible', '2026-09-08 18:21:33', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Historique d\'entretien faible : mettre en place un suivi de maintenance régulier.'),
(538, 569, 0.09899915057964953, 'Risque faible', '2026-09-08 18:22:10', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Historique d\'entretien faible : mettre en place un suivi de maintenance régulier.'),
(539, 570, 0.18626358672352766, 'Risque faible', '2026-09-08 18:22:29', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d\'usure. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Historique d\'entretien faible : mettre en place un suivi de maintenance régulier. Pneus dans un état moyen : vérifier la pression, l\'usure et le parallélisme. Freins à surveiller : prévoir un contrôle du système de freinage.'),
(540, 571, 0.9283369503141062, 'Risque critique', '2026-09-08 18:23:18', 'Un besoin de maintenance est indiqué pour cette observation. Il est recommandé d\'effectuer un contrôle du véhicule afin de déterminer les actions de maintenance appropriées. Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d\'usure. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Un problème est signalé : effectuer une vérification ciblée. État des pneus dégradé : contrôler leur usure, leur pression et leur état général. État des freins dégradé : contrôler les plaquettes, les disques et le liquide de frein.'),
(541, 572, 0.8576078967920838, 'Risque critique', '2026-09-08 18:29:37', 'Un besoin de maintenance est indiqué pour cette observation. Il est recommandé d\'effectuer un contrôle du véhicule afin de déterminer les actions de maintenance appropriées. Kilométrage très élevé : contrôler le moteur, la transmission, la suspension et le système de refroidissement. Véhicule ancien : contrôler l\'état mécanique général, les durites, les joints et les composants électriques. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Nombre élevé de problèmes signalés : effectuer un diagnostic approfondi des composants concernés. Transmission automatique avec kilométrage élevé : contrôler l\'huile de boîte et le comportement des passages de vitesse.'),
(542, 573, 0.9029553962960434, 'Risque critique', '2026-09-08 18:29:37', 'Un besoin de maintenance est indiqué pour cette observation. Il est recommandé d\'effectuer un contrôle du véhicule afin de déterminer les actions de maintenance appropriées. Nombre élevé de problèmes signalés : effectuer un diagnostic approfondi des composants concernés.'),
(543, 574, 0.18733521253059998, 'Risque faible', '2026-09-08 18:29:37', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Véhicule ancien : contrôler l\'état mécanique général, les durites, les joints et les composants électriques. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Historique d\'entretien faible : mettre en place un suivi de maintenance régulier. Un problème est signalé : effectuer une vérification ciblée.'),
(544, 575, 0.2188237169462228, 'Risque faible', '2026-09-08 18:29:37', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Véhicule ancien : contrôler l\'état mécanique général, les durites, les joints et les composants électriques. Historique d\'entretien faible : mettre en place un suivi de maintenance régulier.'),
(545, 576, 0.19730476396817462, 'Risque faible', '2026-09-08 18:29:37', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Un problème est signalé : effectuer une vérification ciblée.'),
(546, 577, 0.21872119387041855, 'Risque faible', '2026-09-08 18:29:37', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Véhicule ancien : contrôler l\'état mécanique général, les durites, les joints et les composants électriques. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Un problème est signalé : effectuer une vérification ciblée.'),
(547, 578, 0.21195317861437504, 'Risque faible', '2026-09-08 18:29:37', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Véhicule ancien : contrôler l\'état mécanique général, les durites, les joints et les composants électriques. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Historique d\'entretien faible : mettre en place un suivi de maintenance régulier. Un problème est signalé : effectuer une vérification ciblée.'),
(548, 579, 0.9212852599124699, 'Risque critique', '2026-09-08 18:29:37', 'Un besoin de maintenance est indiqué pour cette observation. Il est recommandé d\'effectuer un contrôle du véhicule afin de déterminer les actions de maintenance appropriées. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Nombre élevé de problèmes signalés : effectuer un diagnostic approfondi des composants concernés.'),
(549, 580, 0.26821107717649034, 'Risque faible', '2026-09-08 18:29:37', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Plusieurs problèmes sont signalés : vérifier les composants concernés et l\'historique des interventions.'),
(550, 581, 0.1859228607280777, 'Risque faible', '2026-09-08 18:29:37', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d\'usure. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Historique d\'entretien faible : mettre en place un suivi de maintenance régulier. Un problème est signalé : effectuer une vérification ciblée.'),
(551, 582, 0.9542296709460308, 'Risque critique', '2026-09-08 18:29:38', 'Un besoin de maintenance est indiqué pour cette observation. Il est recommandé d\'effectuer un contrôle du véhicule afin de déterminer les actions de maintenance appropriées. Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d\'usure. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Plusieurs problèmes sont signalés : vérifier les composants concernés et l\'historique des interventions. État des pneus dégradé : contrôler leur usure, leur pression et leur état général. Batterie faible : contrôler son niveau de charge et le fonctionnement de l\'alternateur.'),
(552, 583, 0.19024234903573348, 'Risque faible', '2026-09-08 18:29:38', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d\'usure. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Un problème est signalé : effectuer une vérification ciblée.'),
(553, 584, 0.23834386327764495, 'Risque faible', '2026-09-08 18:29:38', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d\'usure. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Un problème est signalé : effectuer une vérification ciblée.'),
(554, 585, 0.9799660201583826, 'Risque critique', '2026-09-08 18:29:38', 'Un besoin de maintenance est indiqué pour cette observation. Il est recommandé d\'effectuer un contrôle du véhicule afin de déterminer les actions de maintenance appropriées. Kilométrage très élevé : contrôler le moteur, la transmission, la suspension et le système de refroidissement. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Nombre élevé de problèmes signalés : effectuer un diagnostic approfondi des composants concernés. État des pneus dégradé : contrôler leur usure, leur pression et leur état général. Batterie faible : contrôler son niveau de charge et le fonctionnement de l\'alternateur.'),
(555, 586, 0.09899915057964953, 'Risque faible', '2026-09-08 18:29:38', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Historique d\'entretien faible : mettre en place un suivi de maintenance régulier.'),
(556, 587, 0.18626358672352766, 'Risque faible', '2026-09-08 19:00:37', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d\'usure. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Historique d\'entretien faible : mettre en place un suivi de maintenance régulier.'),
(557, 588, 0.8576078967920838, 'Risque critique', '2026-09-09 20:16:29', 'Un besoin de maintenance est indiqué pour cette observation. Il est recommandé d\'effectuer un contrôle du véhicule afin de déterminer les actions de maintenance appropriées. Kilométrage très élevé : contrôler le moteur, la transmission, la suspension et le système de refroidissement. Véhicule ancien : contrôler l\'état mécanique général, les durites, les joints et les composants électriques. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Nombre élevé de problèmes signalés : effectuer un diagnostic approfondi des composants concernés. Transmission automatique avec kilométrage élevé : contrôler l\'huile de boîte et le comportement des passages de vitesse.'),
(558, 589, 0.9029553962960434, 'Risque critique', '2026-09-09 20:16:29', 'Un besoin de maintenance est indiqué pour cette observation. Il est recommandé d\'effectuer un contrôle du véhicule afin de déterminer les actions de maintenance appropriées. Nombre élevé de problèmes signalés : effectuer un diagnostic approfondi des composants concernés.'),
(559, 590, 0.1873352125306, 'Risque faible', '2026-09-09 20:16:29', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Véhicule ancien : contrôler l\'état mécanique général, les durites, les joints et les composants électriques. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Historique d\'entretien faible : mettre en place un suivi de maintenance régulier. Un problème est signalé : effectuer une vérification ciblée.'),
(560, 591, 0.2188237169462228, 'Risque faible', '2026-09-09 20:16:29', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Véhicule ancien : contrôler l\'état mécanique général, les durites, les joints et les composants électriques. Historique d\'entretien faible : mettre en place un suivi de maintenance régulier.'),
(561, 592, 0.19730476396817462, 'Risque faible', '2026-09-09 20:16:29', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Un problème est signalé : effectuer une vérification ciblée.'),
(562, 593, 0.21872119387041855, 'Risque faible', '2026-09-09 20:16:29', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Véhicule ancien : contrôler l\'état mécanique général, les durites, les joints et les composants électriques. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Un problème est signalé : effectuer une vérification ciblée.'),
(563, 594, 0.21195317861437504, 'Risque faible', '2026-09-09 20:16:30', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Véhicule ancien : contrôler l\'état mécanique général, les durites, les joints et les composants électriques. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Historique d\'entretien faible : mettre en place un suivi de maintenance régulier. Un problème est signalé : effectuer une vérification ciblée.'),
(564, 595, 0.9212852599124699, 'Risque critique', '2026-09-09 20:16:30', 'Un besoin de maintenance est indiqué pour cette observation. Il est recommandé d\'effectuer un contrôle du véhicule afin de déterminer les actions de maintenance appropriées. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Nombre élevé de problèmes signalés : effectuer un diagnostic approfondi des composants concernés.'),
(565, 596, 0.26821107717649034, 'Risque faible', '2026-09-09 20:16:30', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Plusieurs problèmes sont signalés : vérifier les composants concernés et l\'historique des interventions.'),
(566, 597, 0.1859228607280777, 'Risque faible', '2026-09-09 20:16:30', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d\'usure. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Historique d\'entretien faible : mettre en place un suivi de maintenance régulier. Un problème est signalé : effectuer une vérification ciblée.'),
(567, 598, 0.9542296709460308, 'Risque critique', '2026-09-09 20:16:30', 'Un besoin de maintenance est indiqué pour cette observation. Il est recommandé d\'effectuer un contrôle du véhicule afin de déterminer les actions de maintenance appropriées. Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d\'usure. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Plusieurs problèmes sont signalés : vérifier les composants concernés et l\'historique des interventions. État des pneus dégradé : contrôler leur usure, leur pression et leur état général. Batterie faible : contrôler son niveau de charge et le fonctionnement de l\'alternateur.'),
(568, 599, 0.19024234903573348, 'Risque faible', '2026-09-09 20:16:30', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d\'usure. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Un problème est signalé : effectuer une vérification ciblée.'),
(569, 600, 0.23834386327764495, 'Risque faible', '2026-09-09 20:16:30', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d\'usure. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Un problème est signalé : effectuer une vérification ciblée.'),
(570, 601, 0.9799660201583826, 'Risque critique', '2026-09-09 20:16:30', 'Un besoin de maintenance est indiqué pour cette observation. Il est recommandé d\'effectuer un contrôle du véhicule afin de déterminer les actions de maintenance appropriées. Kilométrage très élevé : contrôler le moteur, la transmission, la suspension et le système de refroidissement. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Nombre élevé de problèmes signalés : effectuer un diagnostic approfondi des composants concernés. État des pneus dégradé : contrôler leur usure, leur pression et leur état général. Batterie faible : contrôler son niveau de charge et le fonctionnement de l\'alternateur.'),
(571, 602, 0.09899915057964953, 'Risque faible', '2026-09-09 20:16:30', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Historique d\'entretien faible : mettre en place un suivi de maintenance régulier.'),
(572, 603, 0.8576078967920838, 'Risque critique', '2026-09-09 20:18:54', 'Un besoin de maintenance est indiqué pour cette observation. Il est recommandé d\'effectuer un contrôle du véhicule afin de déterminer les actions de maintenance appropriées. Kilométrage très élevé : contrôler le moteur, la transmission, la suspension et le système de refroidissement. Véhicule ancien : contrôler l\'état mécanique général, les durites, les joints et les composants électriques. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Nombre élevé de problèmes signalés : effectuer un diagnostic approfondi des composants concernés. Transmission automatique avec kilométrage élevé : contrôler l\'huile de boîte et le comportement des passages de vitesse.'),
(573, 604, 0.9029553962960432, 'Risque critique', '2026-09-09 20:18:54', 'Un besoin de maintenance est indiqué pour cette observation. Il est recommandé d\'effectuer un contrôle du véhicule afin de déterminer les actions de maintenance appropriées. Nombre élevé de problèmes signalés : effectuer un diagnostic approfondi des composants concernés.'),
(574, 605, 0.18733521253059998, 'Risque faible', '2026-09-09 20:18:55', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Véhicule ancien : contrôler l\'état mécanique général, les durites, les joints et les composants électriques. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Historique d\'entretien faible : mettre en place un suivi de maintenance régulier. Un problème est signalé : effectuer une vérification ciblée.'),
(575, 606, 0.2188237169462228, 'Risque faible', '2026-09-09 20:18:55', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Véhicule ancien : contrôler l\'état mécanique général, les durites, les joints et les composants électriques. Historique d\'entretien faible : mettre en place un suivi de maintenance régulier.'),
(576, 607, 0.19730476396817462, 'Risque faible', '2026-09-09 20:18:55', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Un problème est signalé : effectuer une vérification ciblée.'),
(577, 608, 0.21872119387041855, 'Risque faible', '2026-09-09 20:18:55', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Véhicule ancien : contrôler l\'état mécanique général, les durites, les joints et les composants électriques. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Un problème est signalé : effectuer une vérification ciblée.'),
(578, 609, 0.21195317861437504, 'Risque faible', '2026-09-09 20:18:55', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Véhicule ancien : contrôler l\'état mécanique général, les durites, les joints et les composants électriques. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Historique d\'entretien faible : mettre en place un suivi de maintenance régulier. Un problème est signalé : effectuer une vérification ciblée.'),
(579, 610, 0.9212852599124699, 'Risque critique', '2026-09-09 20:18:55', 'Un besoin de maintenance est indiqué pour cette observation. Il est recommandé d\'effectuer un contrôle du véhicule afin de déterminer les actions de maintenance appropriées. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Nombre élevé de problèmes signalés : effectuer un diagnostic approfondi des composants concernés.'),
(580, 611, 0.26821107717649034, 'Risque faible', '2026-09-09 20:18:55', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Plusieurs problèmes sont signalés : vérifier les composants concernés et l\'historique des interventions.'),
(581, 612, 0.1859228607280777, 'Risque faible', '2026-09-09 20:18:55', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d\'usure. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Historique d\'entretien faible : mettre en place un suivi de maintenance régulier. Un problème est signalé : effectuer une vérification ciblée.');
INSERT INTO `prediction_panne` (`id`, `vehicle_data_id`, `probabilite`, `niveau_risque`, `date_prediction`, `recommendation`) VALUES
(582, 613, 0.9542296709460308, 'Risque critique', '2026-09-09 20:18:55', 'Un besoin de maintenance est indiqué pour cette observation. Il est recommandé d\'effectuer un contrôle du véhicule afin de déterminer les actions de maintenance appropriées. Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d\'usure. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Plusieurs problèmes sont signalés : vérifier les composants concernés et l\'historique des interventions. État des pneus dégradé : contrôler leur usure, leur pression et leur état général. Batterie faible : contrôler son niveau de charge et le fonctionnement de l\'alternateur.'),
(583, 614, 0.19024234903573348, 'Risque faible', '2026-09-09 20:18:55', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d\'usure. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Un problème est signalé : effectuer une vérification ciblée.'),
(584, 615, 0.23834386327764495, 'Risque faible', '2026-09-09 20:18:55', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d\'usure. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Un problème est signalé : effectuer une vérification ciblée.'),
(585, 616, 0.9799660201583826, 'Risque critique', '2026-09-09 20:18:56', 'Un besoin de maintenance est indiqué pour cette observation. Il est recommandé d\'effectuer un contrôle du véhicule afin de déterminer les actions de maintenance appropriées. Kilométrage très élevé : contrôler le moteur, la transmission, la suspension et le système de refroidissement. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Nombre élevé de problèmes signalés : effectuer un diagnostic approfondi des composants concernés. État des pneus dégradé : contrôler leur usure, leur pression et leur état général. Batterie faible : contrôler son niveau de charge et le fonctionnement de l\'alternateur.'),
(586, 617, 0.09899915057964953, 'Risque faible', '2026-09-09 20:18:56', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Historique d\'entretien faible : mettre en place un suivi de maintenance régulier.'),
(587, 618, 0.9906490855098956, 'Risque critique', '2026-09-09 20:21:02', 'Un besoin de maintenance est indiqué pour cette observation. Il est recommandé d\'effectuer un contrôle du véhicule afin de déterminer les actions de maintenance appropriées. Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d\'usure. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Nombre élevé de problèmes signalés : effectuer un diagnostic approfondi des composants concernés.'),
(588, 619, 0.9866584305650881, 'Risque critique', '2026-09-09 20:52:54', 'Un besoin de maintenance est indiqué pour cette observation. Il est recommandé d\'effectuer un contrôle du véhicule afin de déterminer les actions de maintenance appropriées. Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d\'usure. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Historique d\'entretien faible : mettre en place un suivi de maintenance régulier. Un problème est signalé : effectuer une vérification ciblée. Pneus dans un état moyen : vérifier la pression, l\'usure et le parallélisme.'),
(589, 620, 0.8560779269652578, 'Risque critique', '2026-09-10 15:26:19', 'Un besoin de maintenance est indiqué pour cette observation. Il est recommandé d\'effectuer un contrôle du véhicule afin de déterminer les actions de maintenance appropriées. Kilométrage très élevé : contrôler le moteur, la transmission, la suspension et le système de refroidissement. Véhicule ancien : contrôler l\'état mécanique général, les durites, les joints et les composants électriques. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Nombre élevé de problèmes signalés : effectuer un diagnostic approfondi des composants concernés. Transmission automatique avec kilométrage élevé : contrôler l\'huile de boîte et le comportement des passages de vitesse.'),
(590, 621, 0.9029553962960434, 'Risque critique', '2026-09-10 15:26:19', 'Un besoin de maintenance est indiqué pour cette observation. Il est recommandé d\'effectuer un contrôle du véhicule afin de déterminer les actions de maintenance appropriées. Nombre élevé de problèmes signalés : effectuer un diagnostic approfondi des composants concernés.'),
(591, 622, 0.18733521253059998, 'Risque faible', '2026-09-10 15:26:19', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Véhicule ancien : contrôler l\'état mécanique général, les durites, les joints et les composants électriques. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Historique d\'entretien faible : mettre en place un suivi de maintenance régulier. Un problème est signalé : effectuer une vérification ciblée.'),
(592, 623, 0.2188237169462228, 'Risque faible', '2026-09-10 15:26:20', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Véhicule ancien : contrôler l\'état mécanique général, les durites, les joints et les composants électriques. Historique d\'entretien faible : mettre en place un suivi de maintenance régulier.'),
(593, 624, 0.19730476396817462, 'Risque faible', '2026-09-10 15:26:20', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Un problème est signalé : effectuer une vérification ciblée.'),
(594, 625, 0.21872119387041855, 'Risque faible', '2026-09-10 15:26:20', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Véhicule ancien : contrôler l\'état mécanique général, les durites, les joints et les composants électriques. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Un problème est signalé : effectuer une vérification ciblée.'),
(595, 626, 0.21195317861437504, 'Risque faible', '2026-09-10 15:26:20', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Véhicule ancien : contrôler l\'état mécanique général, les durites, les joints et les composants électriques. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Historique d\'entretien faible : mettre en place un suivi de maintenance régulier. Un problème est signalé : effectuer une vérification ciblée.'),
(596, 627, 0.9212852599124699, 'Risque critique', '2026-09-10 15:26:20', 'Un besoin de maintenance est indiqué pour cette observation. Il est recommandé d\'effectuer un contrôle du véhicule afin de déterminer les actions de maintenance appropriées. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Nombre élevé de problèmes signalés : effectuer un diagnostic approfondi des composants concernés.'),
(597, 628, 0.26821107717649034, 'Risque faible', '2026-09-10 15:26:20', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Plusieurs problèmes sont signalés : vérifier les composants concernés et l\'historique des interventions.'),
(598, 629, 0.1859228607280777, 'Risque faible', '2026-09-10 15:26:20', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d\'usure. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Historique d\'entretien faible : mettre en place un suivi de maintenance régulier. Un problème est signalé : effectuer une vérification ciblée.'),
(599, 630, 0.9542296709460308, 'Risque critique', '2026-09-10 15:26:20', 'Un besoin de maintenance est indiqué pour cette observation. Il est recommandé d\'effectuer un contrôle du véhicule afin de déterminer les actions de maintenance appropriées. Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d\'usure. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Plusieurs problèmes sont signalés : vérifier les composants concernés et l\'historique des interventions. État des pneus dégradé : contrôler leur usure, leur pression et leur état général. Batterie faible : contrôler son niveau de charge et le fonctionnement de l\'alternateur.'),
(600, 631, 0.19024234903573348, 'Risque faible', '2026-09-10 15:26:20', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d\'usure. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Un problème est signalé : effectuer une vérification ciblée.'),
(601, 632, 0.23834386327764495, 'Risque faible', '2026-09-10 15:26:20', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d\'usure. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Un problème est signalé : effectuer une vérification ciblée.'),
(602, 633, 0.9799660201583826, 'Risque critique', '2026-09-10 15:26:20', 'Un besoin de maintenance est indiqué pour cette observation. Il est recommandé d\'effectuer un contrôle du véhicule afin de déterminer les actions de maintenance appropriées. Kilométrage très élevé : contrôler le moteur, la transmission, la suspension et le système de refroidissement. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Nombre élevé de problèmes signalés : effectuer un diagnostic approfondi des composants concernés. État des pneus dégradé : contrôler leur usure, leur pression et leur état général. Batterie faible : contrôler son niveau de charge et le fonctionnement de l\'alternateur.'),
(603, 634, 0.09899915057964953, 'Risque faible', '2026-09-10 15:26:20', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Historique d\'entretien faible : mettre en place un suivi de maintenance régulier.'),
(604, 635, 0.932347125937912, 'Risque critique', '2026-09-10 15:27:08', 'Un besoin de maintenance est indiqué pour cette observation. Il est recommandé d\'effectuer un contrôle du véhicule afin de déterminer les actions de maintenance appropriées. Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d\'usure. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Historique d\'entretien faible : mettre en place un suivi de maintenance régulier. Un problème est signalé : effectuer une vérification ciblée. État des pneus dégradé : contrôler leur usure, leur pression et leur état général.'),
(605, 636, 0.8560779269652578, 'Risque critique', '2026-09-11 15:57:50', 'Un besoin de maintenance est indiqué pour cette observation. Il est recommandé d\'effectuer un contrôle du véhicule afin de déterminer les actions de maintenance appropriées. Kilométrage très élevé : contrôler le moteur, la transmission, la suspension et le système de refroidissement. Véhicule ancien : contrôler l\'état mécanique général, les durites, les joints et les composants électriques. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Nombre élevé de problèmes signalés : effectuer un diagnostic approfondi des composants concernés. Transmission automatique avec kilométrage élevé : contrôler l\'huile de boîte et le comportement des passages de vitesse.'),
(606, 637, 0.9029553962960432, 'Risque critique', '2026-09-11 15:57:50', 'Un besoin de maintenance est indiqué pour cette observation. Il est recommandé d\'effectuer un contrôle du véhicule afin de déterminer les actions de maintenance appropriées. Nombre élevé de problèmes signalés : effectuer un diagnostic approfondi des composants concernés.'),
(607, 638, 0.18733521253059998, 'Risque faible', '2026-09-11 15:57:51', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Véhicule ancien : contrôler l\'état mécanique général, les durites, les joints et les composants électriques. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Historique d\'entretien faible : mettre en place un suivi de maintenance régulier. Un problème est signalé : effectuer une vérification ciblée.'),
(608, 639, 0.2188237169462228, 'Risque faible', '2026-09-11 15:57:51', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Véhicule ancien : contrôler l\'état mécanique général, les durites, les joints et les composants électriques. Historique d\'entretien faible : mettre en place un suivi de maintenance régulier.'),
(609, 640, 0.19730476396817462, 'Risque faible', '2026-09-11 15:57:51', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Un problème est signalé : effectuer une vérification ciblée.'),
(610, 641, 0.21872119387041855, 'Risque faible', '2026-09-11 15:57:51', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Véhicule ancien : contrôler l\'état mécanique général, les durites, les joints et les composants électriques. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Un problème est signalé : effectuer une vérification ciblée.'),
(611, 642, 0.21195317861437504, 'Risque faible', '2026-09-11 15:57:51', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Véhicule ancien : contrôler l\'état mécanique général, les durites, les joints et les composants électriques. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Historique d\'entretien faible : mettre en place un suivi de maintenance régulier. Un problème est signalé : effectuer une vérification ciblée.'),
(612, 643, 0.9212852599124699, 'Risque critique', '2026-09-11 15:57:51', 'Un besoin de maintenance est indiqué pour cette observation. Il est recommandé d\'effectuer un contrôle du véhicule afin de déterminer les actions de maintenance appropriées. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Nombre élevé de problèmes signalés : effectuer un diagnostic approfondi des composants concernés.'),
(613, 644, 0.26821107717649034, 'Risque faible', '2026-09-11 15:57:51', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Plusieurs problèmes sont signalés : vérifier les composants concernés et l\'historique des interventions.'),
(614, 645, 0.1859228607280777, 'Risque faible', '2026-09-11 15:57:51', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d\'usure. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Historique d\'entretien faible : mettre en place un suivi de maintenance régulier. Un problème est signalé : effectuer une vérification ciblée.'),
(615, 646, 0.9542296709460308, 'Risque critique', '2026-09-11 15:57:51', 'Un besoin de maintenance est indiqué pour cette observation. Il est recommandé d\'effectuer un contrôle du véhicule afin de déterminer les actions de maintenance appropriées. Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d\'usure. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Plusieurs problèmes sont signalés : vérifier les composants concernés et l\'historique des interventions. État des pneus dégradé : contrôler leur usure, leur pression et leur état général. Batterie faible : contrôler son niveau de charge et le fonctionnement de l\'alternateur.'),
(616, 647, 0.19024234903573348, 'Risque faible', '2026-09-11 15:57:51', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d\'usure. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Un problème est signalé : effectuer une vérification ciblée.'),
(617, 648, 0.23834386327764495, 'Risque faible', '2026-09-11 15:57:51', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d\'usure. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Un problème est signalé : effectuer une vérification ciblée.'),
(618, 649, 0.9799660201583826, 'Risque critique', '2026-09-11 15:57:51', 'Un besoin de maintenance est indiqué pour cette observation. Il est recommandé d\'effectuer un contrôle du véhicule afin de déterminer les actions de maintenance appropriées. Kilométrage très élevé : contrôler le moteur, la transmission, la suspension et le système de refroidissement. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Nombre élevé de problèmes signalés : effectuer un diagnostic approfondi des composants concernés. État des pneus dégradé : contrôler leur usure, leur pression et leur état général. Batterie faible : contrôler son niveau de charge et le fonctionnement de l\'alternateur.'),
(619, 650, 0.09899915057964953, 'Risque faible', '2026-09-11 15:57:51', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Historique d\'entretien faible : mettre en place un suivi de maintenance régulier.'),
(620, 651, 0.8560779269652578, 'Risque critique', '2026-09-11 16:10:59', 'Un besoin de maintenance est indiqué pour cette observation. Il est recommandé d\'effectuer un contrôle du véhicule afin de déterminer les actions de maintenance appropriées. Kilométrage très élevé : contrôler le moteur, la transmission, la suspension et le système de refroidissement. Véhicule ancien : contrôler l\'état mécanique général, les durites, les joints et les composants électriques. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Nombre élevé de problèmes signalés : effectuer un diagnostic approfondi des composants concernés. Transmission automatique avec kilométrage élevé : contrôler l\'huile de boîte et le comportement des passages de vitesse.'),
(621, 652, 0.9029553962960434, 'Risque critique', '2026-09-11 16:10:59', 'Un besoin de maintenance est indiqué pour cette observation. Il est recommandé d\'effectuer un contrôle du véhicule afin de déterminer les actions de maintenance appropriées. Nombre élevé de problèmes signalés : effectuer un diagnostic approfondi des composants concernés.'),
(622, 653, 0.18733521253059998, 'Risque faible', '2026-09-11 16:10:59', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Véhicule ancien : contrôler l\'état mécanique général, les durites, les joints et les composants électriques. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Historique d\'entretien faible : mettre en place un suivi de maintenance régulier. Un problème est signalé : effectuer une vérification ciblée.'),
(623, 654, 0.2188237169462228, 'Risque faible', '2026-09-11 16:10:59', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Véhicule ancien : contrôler l\'état mécanique général, les durites, les joints et les composants électriques. Historique d\'entretien faible : mettre en place un suivi de maintenance régulier.'),
(624, 655, 0.19730476396817462, 'Risque faible', '2026-09-11 16:10:59', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Un problème est signalé : effectuer une vérification ciblée.'),
(625, 656, 0.21872119387041855, 'Risque faible', '2026-09-11 16:10:59', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Véhicule ancien : contrôler l\'état mécanique général, les durites, les joints et les composants électriques. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Un problème est signalé : effectuer une vérification ciblée.'),
(626, 657, 0.21195317861437504, 'Risque faible', '2026-09-11 16:10:59', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Véhicule ancien : contrôler l\'état mécanique général, les durites, les joints et les composants électriques. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Historique d\'entretien faible : mettre en place un suivi de maintenance régulier. Un problème est signalé : effectuer une vérification ciblée.'),
(627, 658, 0.9212852599124699, 'Risque critique', '2026-09-11 16:10:59', 'Un besoin de maintenance est indiqué pour cette observation. Il est recommandé d\'effectuer un contrôle du véhicule afin de déterminer les actions de maintenance appropriées. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Nombre élevé de problèmes signalés : effectuer un diagnostic approfondi des composants concernés.'),
(628, 659, 0.26821107717649034, 'Risque faible', '2026-09-11 16:10:59', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Plusieurs problèmes sont signalés : vérifier les composants concernés et l\'historique des interventions.'),
(629, 660, 0.1859228607280777, 'Risque faible', '2026-09-11 16:10:59', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d\'usure. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Historique d\'entretien faible : mettre en place un suivi de maintenance régulier. Un problème est signalé : effectuer une vérification ciblée.'),
(630, 661, 0.9542296709460308, 'Risque critique', '2026-09-11 16:10:59', 'Un besoin de maintenance est indiqué pour cette observation. Il est recommandé d\'effectuer un contrôle du véhicule afin de déterminer les actions de maintenance appropriées. Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d\'usure. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Plusieurs problèmes sont signalés : vérifier les composants concernés et l\'historique des interventions. État des pneus dégradé : contrôler leur usure, leur pression et leur état général. Batterie faible : contrôler son niveau de charge et le fonctionnement de l\'alternateur.'),
(631, 662, 0.19024234903573348, 'Risque faible', '2026-09-11 16:10:59', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d\'usure. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Un problème est signalé : effectuer une vérification ciblée.'),
(632, 663, 0.23834386327764495, 'Risque faible', '2026-09-11 16:11:00', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d\'usure. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Un problème est signalé : effectuer une vérification ciblée.'),
(633, 664, 0.9799660201583826, 'Risque critique', '2026-09-11 16:11:00', 'Un besoin de maintenance est indiqué pour cette observation. Il est recommandé d\'effectuer un contrôle du véhicule afin de déterminer les actions de maintenance appropriées. Kilométrage très élevé : contrôler le moteur, la transmission, la suspension et le système de refroidissement. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Nombre élevé de problèmes signalés : effectuer un diagnostic approfondi des composants concernés. État des pneus dégradé : contrôler leur usure, leur pression et leur état général. Batterie faible : contrôler son niveau de charge et le fonctionnement de l\'alternateur.'),
(634, 665, 0.09899915057964953, 'Risque faible', '2026-09-11 16:11:00', 'Aucun besoin de maintenance n\'est indiqué pour cette observation. Le suivi habituel du véhicule peut être maintenu. Historique d\'entretien faible : mettre en place un suivi de maintenance régulier.'),
(635, 666, 0.9490055565030001, 'Risque critique', '2026-09-11 16:11:38', 'Un besoin de maintenance est indiqué pour cette observation. Il est recommandé d\'effectuer un contrôle du véhicule afin de déterminer les actions de maintenance appropriées. Kilométrage moyen : effectuer un contrôle général et vérifier les pièces d\'usure. Entretien à prévoir : contrôler l\'huile moteur, les filtres, les freins et les pneus. Historique d\'entretien faible : mettre en place un suivi de maintenance régulier. Un problème est signalé : effectuer une vérification ciblée. Pneus dans un état moyen : vérifier la pression, l\'usure et le parallélisme.');

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

CREATE TABLE `utilisateur` (
  `id` bigint(20) NOT NULL,
  `nom` varchar(100) DEFAULT NULL,
  `prenom` varchar(100) DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `role` varchar(255) DEFAULT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `specialite` varchar(255) DEFAULT NULL,
  `telephone` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `utilisateur`
--

INSERT INTO `utilisateur` (`id`, `nom`, `prenom`, `email`, `mot_de_passe`, `role`, `date_creation`, `specialite`, `telephone`) VALUES
(4, 'Admiin', 'Test', 'admin1@test.com', '', 'ADMIN', '2026-04-23 03:03:23', NULL, '0639329568'),
(10, 'test', 'test', 'tewst@gmail.com', '12345', 'TECHNICIEN', '2026-05-14 03:10:54', 'diagnostic', '06123456789'),
(11, 'layhi', 'oualid', 'walid@gmail.com', '1234567', 'TECHNICIEN', '2026-05-14 03:05:48', 'Mecanique', '+212639329568'),
(12, 'layhi', 'oualid', 'layhi@gmail.com', '234565', 'GESTIONNAIRE', '2026-04-22 21:13:06', '', '0639329568'),
(13, 'rayna', 'lh', 'gudvstyv@gmail.com', '12345', 'GESTIONNAIRE', '2026-04-23 20:30:33', NULL, '06000000'),
(14, 'layhi', 'oualid', 'walidlayhii@gmail.com', '23433432', 'TECHNICIEN', '2026-04-24 17:00:59', NULL, '0639329568'),
(15, 'youssef', 'akhmis', 'youssef@gmail.com', '123456789', 'ADMIN', '2026-05-03 16:11:04', NULL, '06000000000'),
(16, 'layhi', 'oualid', 'walidlayhi@gmail.com', '12345678980', 'ADMIN', '2026-05-06 01:44:38', NULL, '0639329568'),
(17, 'lh', 'walid', 'walidl@gmail.com', '1234567890', 'TECHNICIEN', '2026-05-14 04:51:48', 'mecanic', '+212639329568'),
(18, 'Admin', 'GarageFlow', 'admin@garageflow.com', '$2a$10$f38ztioBjKjwYd/kH/ETlue712M7ckaQKFWaPwPU1mS2rJpmyxvd.', 'ADMIN', '2026-06-01 03:03:18', 'Administration', '0600000000'),
(23, 'Admin', 'GarageFlow', 'adminN@garageflow.com', '$2a$10$HdLowjqUGvCqycTBbya/IuHO.EAPi7sQOF3IPskLghbUkrXHnVmNq', 'ADMIN', '2026-06-01 03:18:18', 'Administration', '0600000000'),
(24, 'layhi', 'oualid', 'walidlayhi1@gmail.com', '$2a$10$H8JqPjbhx5UuUuP5FCJML.zml2XBRCm7d96XPbl0fB57/o3K3oaKG', 'GESTIONNAIRE', '2026-06-01 04:02:39', NULL, '0639329568'),
(25, 'layhi', 'oualid', 'walidlayhiiiiiii@gmail.com', '$2a$10$CQ.0MCjvged7D3Rt6E6vDO1tyeiWq4r9B5CzTtlRIBqSrwDfNaYdy', 'TECHNICIEN', '2026-06-02 05:14:55', NULL, '0639329568'),
(26, 'sadf', 'fdf3e', 'asdsda@gamail.com', '$2a$10$wQtI1nWDOCbD9Cy/hyT14.lV8mCEpitY67n981/tYemfNDJRQKuyW', 'TECHNICIEN', '2026-06-04 02:22:12', NULL, '0625439283'),
(27, 'walidd', 'waliddd', 'walidd@gmail.com', '$2a$10$/aFA2x83pZbJXtkJYKsUpuMTXlSEFz9vaU5FtS3.52llMPZBDyrge', 'TECHNICIEN', '2026-06-04 02:23:43', NULL, '0762462345'),
(28, 'layhi', 'walid', 'layhii@gmail.com', '$2a$10$oUuJ6Wq7nCjJV7LLQvFShOo/gX8auR7WWODszxNAhvRhyEH5J5Avu', 'GESTIONNAIRE', '2026-06-04 03:15:10', NULL, '0639329568');

-- --------------------------------------------------------

--
-- Structure de la table `vehicle_data`
--

CREATE TABLE `vehicle_data` (
  `id` bigint(20) NOT NULL,
  `vehicule_id` bigint(20) DEFAULT NULL,
  `vehicle_model` varchar(50) DEFAULT NULL,
  `mileage` int(11) DEFAULT NULL,
  `maintenance_history` varchar(50) DEFAULT NULL,
  `reported_issues` int(11) DEFAULT NULL,
  `vehicle_age` int(11) DEFAULT NULL,
  `fuel_type` varchar(50) DEFAULT NULL,
  `transmission_type` varchar(50) DEFAULT NULL,
  `engine_size` double DEFAULT NULL,
  `odometer_reading` int(11) DEFAULT NULL,
  `last_service_mileage` int(11) DEFAULT NULL,
  `last_service_date` date DEFAULT NULL,
  `warranty_expiry_date` date DEFAULT NULL,
  `owner_type` varchar(50) DEFAULT NULL,
  `insurance_premium` double DEFAULT NULL,
  `service_history` int(11) DEFAULT NULL,
  `accident_history` varchar(255) DEFAULT NULL,
  `fuel_efficiency` double DEFAULT NULL,
  `tire_condition` varchar(50) DEFAULT NULL,
  `brake_condition` varchar(50) DEFAULT NULL,
  `battery_status` varchar(50) DEFAULT NULL,
  `need_maintenance` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `vehicle_data`
--

INSERT INTO `vehicle_data` (`id`, `vehicule_id`, `vehicle_model`, `mileage`, `maintenance_history`, `reported_issues`, `vehicle_age`, `fuel_type`, `transmission_type`, `engine_size`, `odometer_reading`, `last_service_mileage`, `last_service_date`, `warranty_expiry_date`, `owner_type`, `insurance_premium`, `service_history`, `accident_history`, `fuel_efficiency`, `tire_condition`, `brake_condition`, `battery_status`, `need_maintenance`) VALUES
(53, 10, 'benz', 1000200, 'Poor', 2, 15, 'Petrol', 'Manual', 200, 1000200, 990200, '2026-05-12', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(54, 12, 'DW', 1500, 'Good', 4, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-04-22', '2027-01-01', 'First', 1200, 4, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(55, 12, 'DW', 1500, 'Good', 4, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-04-22', '2027-01-01', 'First', 1200, 4, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(56, 13, 'DVB', 30000, 'Good', 0, 14, 'Petrol', 'Manual', 3000, 30000, 20000, '2026-04-22', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(57, 13, 'DVB', 30000, 'Good', 0, 14, 'Petrol', 'Manual', 3000, 30000, 20000, '2026-04-22', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(58, 20, 'dsfg', 3432, 'Good', 0, 25, 'Petrol', 'Automatic', 234, 3432, 0, '2026-04-23', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(59, 20, 'dsfg', 3432, 'Good', 0, 25, 'Petrol', 'Automatic', 234, 3432, 0, '2026-04-23', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(60, 26, 'asdas', 232, 'Good', 0, 814, 'Petrol', 'Automatic', 1323, 232, 0, '2026-05-03', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(61, 26, 'asdas', 232, 'Good', 0, 814, 'Petrol', 'Automatic', 1323, 232, 0, '2026-05-03', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(62, 27, 'sadas', 32443, 'Good', 2, 26, 'Diesel', 'Manual', 34324, 32443, 22443, '2026-05-04', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(63, 28, 'sdad', 21323, 'Good', 0, 26, 'Petrol', 'Manual', 233, 21323, 11323, '2026-05-04', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(64, 27, 'sadas', 32443, 'Good', 2, 26, 'Diesel', 'Manual', 34324, 32443, 22443, '2026-05-04', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(65, 28, 'sdad', 21323, 'Good', 0, 26, 'Petrol', 'Manual', 233, 21323, 11323, '2026-05-04', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(66, 29, 'truck', 20000, 'Good', 1, 0, 'Petrol', 'Automatic', 200, 20000, 10000, '2026-05-05', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(67, 29, 'truck', 20000, 'Good', 1, 0, 'Petrol', 'Automatic', 200, 20000, 10000, '2026-05-05', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(68, 30, 'CLIO', 8500, 'Good', 1, 0, 'Petrol', 'Manual', 1.5, 8500, 0, '2026-05-11', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(69, 30, 'CLIO', 8500, 'Good', 1, 0, 'Petrol', 'Manual', 1.5, 8500, 0, '2026-05-11', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(70, 31, 'scani20', 90000, 'Good', 0, 2, 'Diesel', 'Manual', 100, 90000, 80000, '2026-05-12', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(71, 31, 'scani20', 90000, 'Good', 0, 2, 'Diesel', 'Manual', 100, 90000, 80000, '2026-05-12', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(72, 10, 'benz', 1000200, 'Poor', 2, 15, 'Petrol', 'Manual', 200, 1000200, 990200, '2026-05-12', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(73, 12, 'DW', 1500, 'Good', 4, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-04-22', '2027-01-01', 'First', 1200, 4, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(74, 12, 'DW', 1500, 'Good', 4, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-04-22', '2027-01-01', 'First', 1200, 4, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(75, 13, 'DVB', 30000, 'Good', 0, 14, 'Petrol', 'Manual', 3000, 30000, 20000, '2026-04-22', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(76, 13, 'DVB', 30000, 'Good', 0, 14, 'Petrol', 'Manual', 3000, 30000, 20000, '2026-04-22', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(77, 20, 'dsfg', 3432, 'Good', 0, 25, 'Petrol', 'Automatic', 234, 3432, 0, '2026-04-23', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(78, 20, 'dsfg', 3432, 'Good', 0, 25, 'Petrol', 'Automatic', 234, 3432, 0, '2026-04-23', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(79, 26, 'asdas', 232, 'Good', 0, 814, 'Petrol', 'Automatic', 1323, 232, 0, '2026-05-03', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(80, 27, 'sadas', 32443, 'Good', 2, 26, 'Diesel', 'Manual', 34324, 32443, 22443, '2026-05-04', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(81, 26, 'asdas', 232, 'Good', 0, 814, 'Petrol', 'Automatic', 1323, 232, 0, '2026-05-03', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(82, 27, 'sadas', 32443, 'Good', 2, 26, 'Diesel', 'Manual', 34324, 32443, 22443, '2026-05-04', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(83, 28, 'sdad', 21323, 'Good', 0, 26, 'Petrol', 'Manual', 233, 21323, 11323, '2026-05-04', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(84, 28, 'sdad', 21323, 'Good', 0, 26, 'Petrol', 'Manual', 233, 21323, 11323, '2026-05-04', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(85, 29, 'truck', 20000, 'Good', 1, 0, 'Petrol', 'Automatic', 200, 20000, 10000, '2026-05-05', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(86, 30, 'CLIO', 8500, 'Good', 1, 0, 'Petrol', 'Manual', 1.5, 8500, 0, '2026-05-11', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(87, 29, 'truck', 20000, 'Good', 1, 0, 'Petrol', 'Automatic', 200, 20000, 10000, '2026-05-05', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(88, 31, 'scani20', 90000, 'Good', 0, 2, 'Diesel', 'Manual', 100, 90000, 80000, '2026-05-12', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(89, 30, 'CLIO', 8500, 'Good', 1, 0, 'Petrol', 'Manual', 1.5, 8500, 0, '2026-05-11', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(90, 31, 'scani20', 90000, 'Good', 0, 2, 'Diesel', 'Manual', 100, 90000, 80000, '2026-05-12', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(91, 10, 'benz', 1000200, 'Poor', 2, 15, 'Petrol', 'Manual', 200, 1000200, 990200, '2026-05-12', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(92, 12, 'DW', 1500, 'Good', 4, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-04-22', '2027-01-01', 'First', 1200, 4, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(93, 13, 'DVB', 30000, 'Good', 0, 14, 'Petrol', 'Manual', 3000, 30000, 20000, '2026-04-22', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(94, 12, 'DW', 1500, 'Good', 4, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-04-22', '2027-01-01', 'First', 1200, 4, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(95, 20, 'dsfg', 3432, 'Good', 0, 25, 'Petrol', 'Automatic', 234, 3432, 0, '2026-04-23', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(96, 13, 'DVB', 30000, 'Good', 0, 14, 'Petrol', 'Manual', 3000, 30000, 20000, '2026-04-22', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(97, 26, 'asdas', 232, 'Good', 0, 814, 'Petrol', 'Automatic', 1323, 232, 0, '2026-05-03', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(98, 27, 'sadas', 32443, 'Good', 2, 26, 'Diesel', 'Manual', 34324, 32443, 22443, '2026-05-04', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(99, 20, 'dsfg', 3432, 'Good', 0, 25, 'Petrol', 'Automatic', 234, 3432, 0, '2026-04-23', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(100, 26, 'asdas', 232, 'Good', 0, 814, 'Petrol', 'Automatic', 1323, 232, 0, '2026-05-03', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(101, 28, 'sdad', 21323, 'Good', 0, 26, 'Petrol', 'Manual', 233, 21323, 11323, '2026-05-04', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(102, 29, 'truck', 20000, 'Good', 1, 0, 'Petrol', 'Automatic', 200, 20000, 10000, '2026-05-05', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(103, 27, 'sadas', 32443, 'Good', 2, 26, 'Diesel', 'Manual', 34324, 32443, 22443, '2026-05-04', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(104, 28, 'sdad', 21323, 'Good', 0, 26, 'Petrol', 'Manual', 233, 21323, 11323, '2026-05-04', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(105, 30, 'CLIO', 8500, 'Good', 1, 0, 'Petrol', 'Manual', 1.5, 8500, 0, '2026-05-11', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(106, 29, 'truck', 20000, 'Good', 1, 0, 'Petrol', 'Automatic', 200, 20000, 10000, '2026-05-05', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(107, 31, 'scani20', 90000, 'Good', 0, 2, 'Diesel', 'Manual', 100, 90000, 80000, '2026-05-12', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(108, 30, 'CLIO', 8500, 'Good', 1, 0, 'Petrol', 'Manual', 1.5, 8500, 0, '2026-05-11', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(109, 31, 'scani20', 90000, 'Good', 0, 2, 'Diesel', 'Manual', 100, 90000, 80000, '2026-05-12', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(110, 10, 'benz', 1000200, 'Poor', 2, 15, 'Petrol', 'Manual', 200, 1000200, 990200, '2026-05-12', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(111, 10, 'benz', 1000200, 'Poor', 2, 15, 'Petrol', 'Manual', 200, 1000200, 990200, '2026-05-12', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(112, 12, 'DW', 1500, 'Good', 4, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-04-22', '2027-01-01', 'First', 1200, 4, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(113, 12, 'DW', 1500, 'Good', 4, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-04-22', '2027-01-01', 'First', 1200, 4, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(114, 13, 'DVB', 30000, 'Good', 0, 14, 'Petrol', 'Manual', 3000, 30000, 20000, '2026-04-22', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(115, 13, 'DVB', 30000, 'Good', 0, 14, 'Petrol', 'Manual', 3000, 30000, 20000, '2026-04-22', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(116, 20, 'dsfg', 3432, 'Good', 0, 25, 'Petrol', 'Automatic', 234, 3432, 0, '2026-04-23', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(117, 20, 'dsfg', 3432, 'Good', 0, 25, 'Petrol', 'Automatic', 234, 3432, 0, '2026-04-23', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(118, 26, 'asdas', 232, 'Good', 0, 814, 'Petrol', 'Automatic', 1323, 232, 0, '2026-05-03', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(119, 26, 'asdas', 232, 'Good', 0, 814, 'Petrol', 'Automatic', 1323, 232, 0, '2026-05-03', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(120, 27, 'sadas', 32443, 'Good', 2, 26, 'Diesel', 'Manual', 34324, 32443, 22443, '2026-05-04', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(121, 27, 'sadas', 32443, 'Good', 2, 26, 'Diesel', 'Manual', 34324, 32443, 22443, '2026-05-04', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(122, 28, 'sdad', 21323, 'Good', 0, 26, 'Petrol', 'Manual', 233, 21323, 11323, '2026-05-04', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(123, 28, 'sdad', 21323, 'Good', 0, 26, 'Petrol', 'Manual', 233, 21323, 11323, '2026-05-04', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(124, 29, 'truck', 20000, 'Good', 1, 0, 'Petrol', 'Automatic', 200, 20000, 10000, '2026-05-05', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(125, 29, 'truck', 20000, 'Good', 1, 0, 'Petrol', 'Automatic', 200, 20000, 10000, '2026-05-05', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(126, 30, 'CLIO', 8500, 'Good', 1, 0, 'Petrol', 'Manual', 1.5, 8500, 0, '2026-05-11', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(127, 30, 'CLIO', 8500, 'Good', 1, 0, 'Petrol', 'Manual', 1.5, 8500, 0, '2026-05-11', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(128, 31, 'scani20', 90000, 'Good', 0, 2, 'Diesel', 'Manual', 100, 90000, 80000, '2026-05-12', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(129, 31, 'scani20', 90000, 'Good', 0, 2, 'Diesel', 'Manual', 100, 90000, 80000, '2026-05-12', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(130, 10, 'benz', 1000200, 'Poor', 2, 15, 'Petrol', 'Manual', 200, 1000200, 990200, '2026-05-12', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(131, 12, 'DW', 1500, 'Good', 4, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-04-22', '2027-01-01', 'First', 1200, 4, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(132, 13, 'DVB', 30000, 'Good', 0, 14, 'Petrol', 'Manual', 3000, 30000, 20000, '2026-04-22', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(133, 12, 'DW', 1500, 'Good', 4, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-04-22', '2027-01-01', 'First', 1200, 4, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(134, 20, 'dsfg', 3432, 'Good', 0, 25, 'Petrol', 'Automatic', 234, 3432, 0, '2026-04-23', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(135, 26, 'asdas', 232, 'Good', 0, 814, 'Petrol', 'Automatic', 1323, 232, 0, '2026-05-03', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(136, 13, 'DVB', 30000, 'Good', 0, 14, 'Petrol', 'Manual', 3000, 30000, 20000, '2026-04-22', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(137, 27, 'sadas', 32443, 'Good', 2, 26, 'Diesel', 'Manual', 34324, 32443, 22443, '2026-05-04', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(138, 20, 'dsfg', 3432, 'Good', 0, 25, 'Petrol', 'Automatic', 234, 3432, 0, '2026-04-23', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(139, 28, 'sdad', 21323, 'Good', 0, 26, 'Petrol', 'Manual', 233, 21323, 11323, '2026-05-04', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(140, 26, 'asdas', 232, 'Good', 0, 814, 'Petrol', 'Automatic', 1323, 232, 0, '2026-05-03', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(141, 29, 'truck', 20000, 'Good', 1, 0, 'Petrol', 'Automatic', 200, 20000, 10000, '2026-05-05', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(142, 27, 'sadas', 32443, 'Good', 2, 26, 'Diesel', 'Manual', 34324, 32443, 22443, '2026-05-04', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(143, 30, 'CLIO', 8500, 'Good', 1, 0, 'Petrol', 'Manual', 1.5, 8500, 0, '2026-05-11', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(144, 28, 'sdad', 21323, 'Good', 0, 26, 'Petrol', 'Manual', 233, 21323, 11323, '2026-05-04', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(145, 31, 'scani20', 90000, 'Good', 0, 2, 'Diesel', 'Manual', 100, 90000, 80000, '2026-05-12', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(146, 29, 'truck', 20000, 'Good', 1, 0, 'Petrol', 'Automatic', 200, 20000, 10000, '2026-05-05', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(147, 30, 'CLIO', 8500, 'Good', 1, 0, 'Petrol', 'Manual', 1.5, 8500, 0, '2026-05-11', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(148, 31, 'scani20', 90000, 'Good', 0, 2, 'Diesel', 'Manual', 100, 90000, 80000, '2026-05-12', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(149, 10, 'benz', 1000200, 'Poor', 2, 15, 'Petrol', 'Manual', 200, 1000200, 990200, '2026-05-12', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(150, 10, 'benz', 1000200, 'Poor', 2, 15, 'Petrol', 'Manual', 200, 1000200, 990200, '2026-05-12', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(151, 10, 'benz', 1000200, 'Poor', 2, 15, 'Petrol', 'Manual', 200, 1000200, 990200, '2026-05-12', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(152, 12, 'DW', 1500, 'Good', 4, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-04-22', '2027-01-01', 'First', 1200, 4, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(153, 10, 'benz', 1000200, 'Poor', 2, 15, 'Petrol', 'Manual', 200, 1000200, 990200, '2026-05-12', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(154, 12, 'DW', 1500, 'Good', 4, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-04-22', '2027-01-01', 'First', 1200, 4, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(155, 13, 'DVB', 30000, 'Good', 0, 14, 'Petrol', 'Manual', 3000, 30000, 20000, '2026-04-22', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(156, 20, 'dsfg', 3432, 'Good', 0, 25, 'Petrol', 'Automatic', 234, 3432, 0, '2026-04-23', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(157, 26, 'asdas', 232, 'Good', 0, 814, 'Petrol', 'Automatic', 1323, 232, 0, '2026-05-03', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(158, 27, 'sadas', 32443, 'Good', 2, 26, 'Diesel', 'Manual', 34324, 32443, 22443, '2026-05-04', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(159, 28, 'sdad', 21323, 'Good', 0, 26, 'Petrol', 'Manual', 233, 21323, 11323, '2026-05-04', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(160, 29, 'truck', 20000, 'Good', 1, 0, 'Petrol', 'Automatic', 200, 20000, 10000, '2026-05-05', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(161, 30, 'CLIO', 8500, 'Good', 1, 0, 'Petrol', 'Manual', 1.5, 8500, 0, '2026-05-11', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(162, 31, 'scani20', 90000, 'Good', 0, 2, 'Diesel', 'Manual', 100, 90000, 80000, '2026-05-12', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(163, 10, 'benz', 1000200, 'Poor', 2, 15, 'Petrol', 'Manual', 200, 1000200, 990200, '2026-05-12', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(164, 12, 'DW', 1500, 'Good', 4, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-04-22', '2027-01-01', 'First', 1200, 4, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(165, 13, 'DVB', 30000, 'Good', 0, 14, 'Petrol', 'Manual', 3000, 30000, 20000, '2026-04-22', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(166, 20, 'dsfg', 3432, 'Good', 0, 25, 'Petrol', 'Automatic', 234, 3432, 0, '2026-04-23', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(167, 26, 'asdas', 232, 'Good', 0, 814, 'Petrol', 'Automatic', 1323, 232, 0, '2026-05-03', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(168, 27, 'sadas', 32443, 'Good', 2, 26, 'Diesel', 'Manual', 34324, 32443, 22443, '2026-05-04', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(169, 28, 'sdad', 21323, 'Good', 0, 26, 'Petrol', 'Manual', 233, 21323, 11323, '2026-05-04', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(170, 29, 'truck', 20000, 'Good', 1, 0, 'Petrol', 'Automatic', 200, 20000, 10000, '2026-05-05', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(171, 30, 'CLIO', 8500, 'Good', 1, 0, 'Petrol', 'Manual', 1.5, 8500, 0, '2026-05-11', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(172, 31, 'scani20', 90000, 'Good', 0, 2, 'Diesel', 'Manual', 100, 90000, 80000, '2026-05-12', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(173, 10, 'benz', 1000200, 'Poor', 2, 15, 'Petrol', 'Manual', 200, 1000200, 990200, '2026-05-12', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(174, 12, 'DW', 1500, 'Good', 4, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-04-22', '2027-01-01', 'First', 1200, 4, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(175, 13, 'DVB', 30000, 'Good', 0, 14, 'Petrol', 'Manual', 3000, 30000, 20000, '2026-04-22', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(176, 20, 'dsfg', 3432, 'Good', 0, 25, 'Petrol', 'Automatic', 234, 3432, 0, '2026-04-23', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(177, 26, 'asdas', 232, 'Good', 0, 814, 'Petrol', 'Automatic', 1323, 232, 0, '2026-05-03', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(178, 27, 'sadas', 32443, 'Good', 2, 26, 'Diesel', 'Manual', 34324, 32443, 22443, '2026-05-04', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(179, 28, 'sdad', 21323, 'Good', 0, 26, 'Petrol', 'Manual', 233, 21323, 11323, '2026-05-04', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(180, 29, 'truck', 20000, 'Good', 1, 0, 'Petrol', 'Automatic', 200, 20000, 10000, '2026-05-05', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(181, 30, 'CLIO', 8500, 'Good', 1, 0, 'Petrol', 'Manual', 1.5, 8500, 0, '2026-05-11', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(182, 31, 'scani20', 90000, 'Good', 0, 2, 'Diesel', 'Manual', 100, 90000, 80000, '2026-05-12', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(183, 10, 'benz', 1000200, 'Poor', 2, 15, 'Petrol', 'Manual', 200, 1000200, 990200, '2026-05-12', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(184, 12, 'DW', 1500, 'Good', 4, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-04-22', '2027-01-01', 'First', 1200, 4, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(185, 13, 'DVB', 30000, 'Good', 0, 14, 'Petrol', 'Manual', 3000, 30000, 20000, '2026-04-22', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(186, 20, 'dsfg', 3432, 'Good', 0, 25, 'Petrol', 'Automatic', 234, 3432, 0, '2026-04-23', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(187, 26, 'asdas', 232, 'Good', 0, 814, 'Petrol', 'Automatic', 1323, 232, 0, '2026-05-03', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(188, 27, 'sadas', 32443, 'Good', 2, 26, 'Diesel', 'Manual', 34324, 32443, 22443, '2026-05-04', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(189, 28, 'sdad', 21323, 'Good', 0, 26, 'Petrol', 'Manual', 233, 21323, 11323, '2026-05-04', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(190, 29, 'truck', 20000, 'Good', 1, 0, 'Petrol', 'Automatic', 200, 20000, 10000, '2026-05-05', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(191, 30, 'CLIO', 8500, 'Good', 1, 0, 'Petrol', 'Manual', 1.5, 8500, 0, '2026-05-11', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(192, 31, 'scani20', 90000, 'Good', 0, 2, 'Diesel', 'Manual', 100, 90000, 80000, '2026-05-12', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(193, 10, 'benz', 1000200, 'Poor', 2, 15, 'Petrol', 'Manual', 200, 1000200, 990200, '2026-05-12', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(194, 12, 'DW', 1500, 'Good', 4, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-04-22', '2027-01-01', 'First', 1200, 4, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(195, 13, 'DVB', 30000, 'Good', 0, 14, 'Petrol', 'Manual', 3000, 30000, 20000, '2026-04-22', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(196, 20, 'dsfg', 3432, 'Good', 0, 25, 'Petrol', 'Automatic', 234, 3432, 0, '2026-04-23', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(197, 26, 'asdas', 232, 'Good', 0, 814, 'Petrol', 'Automatic', 1323, 232, 0, '2026-05-03', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(198, 27, 'sadas', 32443, 'Good', 2, 26, 'Diesel', 'Manual', 34324, 32443, 22443, '2026-05-04', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(199, 28, 'sdad', 21323, 'Good', 0, 26, 'Petrol', 'Manual', 233, 21323, 11323, '2026-05-04', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(200, 29, 'truck', 20000, 'Good', 1, 0, 'Petrol', 'Automatic', 200, 20000, 10000, '2026-05-05', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(201, 30, 'CLIO', 8500, 'Good', 1, 0, 'Petrol', 'Manual', 1.5, 8500, 0, '2026-05-11', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(202, 31, 'scani20', 90000, 'Good', 0, 2, 'Diesel', 'Manual', 100, 90000, 80000, '2026-05-12', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(203, 10, 'benz', 1000200, 'Poor', 2, 15, 'Petrol', 'Manual', 200, 1000200, 990200, '2026-05-12', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(204, 12, 'DW', 1500, 'Good', 4, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-04-22', '2027-01-01', 'First', 1200, 4, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(205, 13, 'DVB', 30000, 'Good', 0, 14, 'Petrol', 'Manual', 3000, 30000, 20000, '2026-04-22', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(206, 20, 'dsfg', 3432, 'Good', 0, 25, 'Petrol', 'Automatic', 234, 3432, 0, '2026-04-23', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(207, 26, 'asdas', 232, 'Good', 0, 814, 'Petrol', 'Automatic', 1323, 232, 0, '2026-05-03', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(208, 27, 'sadas', 32443, 'Good', 2, 26, 'Diesel', 'Manual', 34324, 32443, 22443, '2026-05-04', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(209, 28, 'sdad', 21323, 'Good', 0, 26, 'Petrol', 'Manual', 233, 21323, 11323, '2026-05-04', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(210, 29, 'truck', 20000, 'Good', 3, 0, 'Petrol', 'Automatic', 200, 20000, 10000, '2026-05-05', '2027-01-01', 'First', 1200, 3, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(211, 30, 'CLIO', 8500, 'Good', 1, 0, 'Petrol', 'Manual', 1.5, 8500, 0, '2026-05-11', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(212, 31, 'scani20', 90000, 'Good', 0, 2, 'Diesel', 'Manual', 100, 90000, 80000, '2026-05-12', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(213, 29, 'truck', 20000, 'Good', 3, 0, 'Petrol', 'Automatic', 200, 20000, 10000, '2026-05-05', '2027-01-01', 'First', 1200, 3, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(214, 29, 'truck', 20000, 'Good', 3, 0, 'Petrol', 'Automatic', 200, 20000, 10000, '2026-05-05', '2027-01-01', 'First', 1200, 3, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(215, 10, 'benz', 1000200, 'Poor', 2, 15, 'Petrol', 'Manual', 200, 1000200, 990200, '2026-05-12', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(216, 12, 'DW', 1500, 'Good', 4, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-04-22', '2027-01-01', 'First', 1200, 4, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(217, 13, 'DVB', 30000, 'Good', 0, 14, 'Petrol', 'Manual', 3000, 30000, 20000, '2026-04-22', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(218, 20, 'dsfg', 3432, 'Good', 0, 25, 'Petrol', 'Automatic', 234, 3432, 0, '2026-04-23', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(219, 26, 'asdas', 232, 'Good', 0, 814, 'Petrol', 'Automatic', 1323, 232, 0, '2026-05-03', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(220, 27, 'sadas', 32443, 'Good', 2, 26, 'Diesel', 'Manual', 34324, 32443, 22443, '2026-05-04', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(221, 28, 'sdad', 21323, 'Good', 0, 26, 'Petrol', 'Manual', 233, 21323, 11323, '2026-05-04', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(222, 29, 'truck', 20000, 'Good', 3, 0, 'Petrol', 'Automatic', 200, 20000, 10000, '2026-05-05', '2027-01-01', 'First', 1200, 3, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(223, 30, 'CLIO', 8500, 'Good', 1, 0, 'Petrol', 'Manual', 1.5, 8500, 0, '2026-05-11', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(224, 31, 'scani20', 90000, 'Good', 0, 2, 'Diesel', 'Manual', 100, 90000, 80000, '2026-05-12', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(225, 10, 'benz', 1000200, 'Poor', 2, 15, 'Petrol', 'Manual', 200, 1000200, 990200, '2026-05-12', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(226, 10, 'benz', 1000200, 'Poor', 2, 15, 'Petrol', 'Manual', 200, 1000200, 990200, '2026-05-12', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(227, 12, 'DW', 1500, 'Good', 4, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-04-22', '2027-01-01', 'First', 1200, 4, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(228, 13, 'DVB', 30000, 'Good', 0, 14, 'Petrol', 'Manual', 3000, 30000, 20000, '2026-04-22', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(229, 20, 'dsfg', 3432, 'Good', 0, 25, 'Petrol', 'Automatic', 234, 3432, 0, '2026-04-23', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(230, 26, 'asdas', 232, 'Good', 0, 814, 'Petrol', 'Automatic', 1323, 232, 0, '2026-05-03', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(231, 27, 'sadas', 32443, 'Good', 2, 26, 'Diesel', 'Manual', 34324, 32443, 22443, '2026-05-04', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(232, 28, 'sdad', 21323, 'Good', 0, 26, 'Petrol', 'Manual', 233, 21323, 11323, '2026-05-04', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(233, 29, 'truck', 20000, 'Good', 3, 0, 'Petrol', 'Automatic', 200, 20000, 10000, '2026-05-05', '2027-01-01', 'First', 1200, 3, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(234, 30, 'CLIO', 8500, 'Good', 1, 0, 'Petrol', 'Manual', 1.5, 8500, 0, '2026-05-11', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(235, 31, 'scani20', 90000, 'Good', 0, 2, 'Diesel', 'Manual', 100, 90000, 80000, '2026-05-12', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(236, 12, 'DW', 1500, 'Good', 4, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-04-22', '2027-01-01', 'First', 1200, 4, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(237, 31, 'scani20', 90000, 'Good', 0, 2, 'Diesel', 'Manual', 100, 90000, 80000, '2026-05-12', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(238, 10, 'benz', 1000200, 'Poor', 2, 15, 'Petrol', 'Manual', 200, 1000200, 990200, '2026-05-12', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(239, 12, 'DW', 1500, 'Good', 4, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-04-22', '2027-01-01', 'First', 1200, 4, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(240, 13, 'DVB', 30000, 'Good', 0, 14, 'Petrol', 'Manual', 3000, 30000, 20000, '2026-04-22', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(241, 20, 'dsfg', 3432, 'Good', 0, 25, 'Petrol', 'Automatic', 234, 3432, 0, '2026-04-23', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(242, 26, 'asdas', 232, 'Good', 0, 814, 'Petrol', 'Automatic', 1323, 232, 0, '2026-05-03', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(243, 27, 'sadas', 32443, 'Good', 2, 26, 'Diesel', 'Manual', 34324, 32443, 22443, '2026-05-04', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(244, 28, 'sdad', 21323, 'Good', 0, 26, 'Petrol', 'Manual', 233, 21323, 11323, '2026-05-04', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(245, 29, 'truck', 20000, 'Good', 3, 0, 'Petrol', 'Automatic', 200, 20000, 10000, '2026-05-05', '2027-01-01', 'First', 1200, 3, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(246, 30, 'CLIO', 8500, 'Good', 1, 0, 'Petrol', 'Manual', 1.5, 8500, 0, '2026-05-11', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(247, 31, 'scani20', 90000, 'Good', 0, 2, 'Diesel', 'Manual', 100, 90000, 80000, '2026-05-12', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(248, 32, 'TRUCK', 85000, 'Good', 0, 1, 'Diesel', 'Manual', 1.5, 85000, 75000, '2026-05-12', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(249, 32, 'TRUCK', 85000, 'Good', 0, 1, 'Diesel', 'Manual', 1.5, 85000, 75000, '2026-05-12', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(250, 32, 'TRUCK', 85000, 'Good', 0, 1, 'Diesel', 'Manual', 1.5, 85000, 75000, '2026-05-12', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(251, 32, 'TRUCK', 85000, 'Good', 1, 1, 'Diesel', 'Manual', 1.5, 85000, 75000, '2026-05-12', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(252, 10, 'benz', 1000200, 'Poor', 2, 15, 'Petrol', 'Manual', 200, 1000200, 990200, '2026-05-12', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(253, 10, 'benz', 1000200, 'Poor', 2, 15, 'Petrol', 'Manual', 200, 1000200, 990200, '2026-05-12', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(254, 32, 'TRUCK', 85000, 'Good', 1, 1, 'Diesel', 'Manual', 1.5, 85000, 75000, '2026-05-12', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(255, 32, 'TRUCK', 85000, 'Good', 2, 1, 'Diesel', 'Manual', 1.5, 85000, 75000, '2026-05-12', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(256, 10, 'benz', 1000200, 'Poor', 2, 15, 'Petrol', 'Manual', 200, 1000200, 990200, '2026-05-12', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(257, 12, 'DW', 1500, 'Good', 4, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-04-22', '2027-01-01', 'First', 1200, 4, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(258, 13, 'DVB', 30000, 'Good', 0, 14, 'Petrol', 'Manual', 3000, 30000, 20000, '2026-04-22', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(259, 20, 'dsfg', 3432, 'Good', 0, 25, 'Petrol', 'Automatic', 234, 3432, 0, '2026-04-23', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(260, 26, 'asdas', 232, 'Good', 0, 814, 'Petrol', 'Automatic', 1323, 232, 0, '2026-05-03', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(261, 27, 'sadas', 32443, 'Good', 2, 26, 'Diesel', 'Manual', 34324, 32443, 22443, '2026-05-04', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(262, 28, 'sdad', 21323, 'Good', 0, 26, 'Petrol', 'Manual', 233, 21323, 11323, '2026-05-04', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(263, 29, 'truck', 20000, 'Good', 3, 0, 'Petrol', 'Automatic', 200, 20000, 10000, '2026-05-05', '2027-01-01', 'First', 1200, 3, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(264, 30, 'CLIO', 8500, 'Good', 1, 0, 'Petrol', 'Manual', 1.5, 8500, 0, '2026-05-11', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(265, 31, 'scani20', 90000, 'Good', 0, 2, 'Diesel', 'Manual', 100, 90000, 80000, '2026-05-12', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(266, 32, 'TRUCK', 85000, 'Good', 2, 1, 'Diesel', 'Manual', 1.5, 85000, 75000, '2026-05-12', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(267, 33, 'truck', 100000, 'Good', 0, 2, 'Diesel', 'Manual', 1.3, 100000, 90000, '2026-05-12', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(268, 10, 'benz', 1000200, 'Poor', 2, 15, 'Petrol', 'Manual', 200, 1000200, 990200, '2026-05-12', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(269, 12, 'DW', 1500, 'Good', 4, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-04-22', '2027-01-01', 'First', 1200, 4, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(270, 13, 'DVB', 30000, 'Good', 0, 14, 'Petrol', 'Manual', 3000, 30000, 20000, '2026-04-22', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(271, 20, 'dsfg', 3432, 'Good', 0, 25, 'Petrol', 'Automatic', 234, 3432, 0, '2026-04-23', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(272, 26, 'asdas', 232, 'Good', 0, 814, 'Petrol', 'Automatic', 1323, 232, 0, '2026-05-03', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(273, 27, 'sadas', 32443, 'Good', 2, 26, 'Diesel', 'Manual', 34324, 32443, 22443, '2026-05-04', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(274, 28, 'sdad', 21323, 'Good', 0, 26, 'Petrol', 'Manual', 233, 21323, 11323, '2026-05-04', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(275, 29, 'truck', 20000, 'Good', 4, 0, 'Petrol', 'Automatic', 200, 20000, 10000, '2026-05-05', '2027-01-01', 'First', 1200, 4, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(276, 30, 'CLIO', 8500, 'Good', 1, 0, 'Petrol', 'Manual', 1.5, 8500, 0, '2026-05-11', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(277, 31, 'scani20', 90000, 'Good', 0, 2, 'Diesel', 'Manual', 100, 90000, 80000, '2026-05-12', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(278, 32, 'TRUCK', 85000, 'Good', 2, 1, 'Diesel', 'Manual', 1.5, 85000, 75000, '2026-05-12', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(279, 33, 'truck', 100000, 'Good', 0, 2, 'Diesel', 'Manual', 1.3, 100000, 90000, '2026-05-12', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(280, 10, 'benz', 1000200, 'Poor', 2, 15, 'Petrol', 'Manual', 200, 1000200, 990200, '2026-05-12', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(281, 12, 'DW', 1500, 'Good', 4, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-04-22', '2027-01-01', 'First', 1200, 4, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(282, 13, 'DVB', 30000, 'Good', 0, 14, 'Petrol', 'Manual', 3000, 30000, 20000, '2026-04-22', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(283, 20, 'dsfg', 3432, 'Good', 0, 25, 'Petrol', 'Automatic', 234, 3432, 0, '2026-04-23', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(284, 26, 'asdas', 232, 'Good', 0, 814, 'Petrol', 'Automatic', 1323, 232, 0, '2026-05-03', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(285, 27, 'sadas', 32443, 'Good', 2, 26, 'Diesel', 'Manual', 34324, 32443, 22443, '2026-05-04', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(286, 28, 'sdad', 21323, 'Good', 0, 26, 'Petrol', 'Manual', 233, 21323, 11323, '2026-05-04', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(287, 29, 'truck', 20000, 'Good', 4, 0, 'Petrol', 'Automatic', 200, 20000, 10000, '2026-05-05', '2027-01-01', 'First', 1200, 4, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(288, 30, 'CLIO', 8500, 'Good', 1, 0, 'Petrol', 'Manual', 1.5, 8500, 0, '2026-05-11', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(289, 31, 'scani20', 90000, 'Good', 0, 2, 'Diesel', 'Manual', 100, 90000, 80000, '2026-05-12', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(290, 32, 'TRUCK', 85000, 'Good', 2, 1, 'Diesel', 'Manual', 1.5, 85000, 75000, '2026-05-12', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(291, 33, 'truck', 100000, 'Good', 0, 2, 'Diesel', 'Manual', 1.3, 100000, 90000, '2026-05-12', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(292, 34, 'Truck', 100000, 'Good', 0, 1, 'Diesel', 'Manual', 1500, 100000, 90000, '2026-05-13', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(293, 34, 'Truck', 100000, 'Good', 1, 1, 'Diesel', 'Manual', 1500, 100000, 90000, '2026-05-13', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(294, 10, 'benz', 1000200, 'Poor', 2, 15, 'Petrol', 'Manual', 200, 1000200, 990200, '2026-05-12', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(295, 35, 'Van', 230000, 'Good', 0, 4, 'Petrol', 'Automatic', 1500, 230000, 220000, '2026-05-14', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(296, 10, 'Car', 1000200, 'Poor', 2, 15, 'Petrol', 'Automatic', 200, 1000200, 990200, '2026-05-12', '2027-01-01', 'First', 1200, 2, '0', 15.5, 'Worn Out', 'Worn Out', 'Weak', 1),
(297, 12, 'Car', 1500, 'Poor', 4, 6, 'Petrol', 'Automatic', 200, 1500, 0, '2026-04-22', '2027-01-01', 'First', 1200, 4, '0', 15.5, 'Worn Out', 'Worn Out', 'Weak', 1),
(298, 10, 'benz', 1000200, 'Poor', 2, 15, 'Petrol', 'Manual', 200, 1000200, 990200, '2026-05-12', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(299, 10, 'Car', 1000200, 'Poor', 2, 15, 'Petrol', 'Automatic', 200, 1000200, 990200, '2026-05-12', '2027-01-01', 'First', 1200, 2, '0', 15.5, 'Worn Out', 'Worn Out', 'Weak', 1),
(300, 10, 'Car', 1000200, 'Poor', 2, 15, 'Petrol', 'Automatic', 200, 1000200, 990200, '2026-05-12', '2027-01-01', 'First', 1200, 2, '0', 15.5, 'Worn Out', 'Worn Out', 'Weak', 1),
(301, 13, 'Car', 30000, 'Good', 0, 14, 'Petrol', 'Automatic', 3000, 30000, 20000, '2026-04-22', '2027-01-01', 'First', 1200, 1, '0', 15.5, 'Good', 'Good', 'Good', 0),
(302, 28, 'Car', 21323, 'Good', 1, 26, 'Petrol', 'Manual', 233, 21323, 11323, '2026-05-04', '2027-01-01', 'First', 1200, 1, '0', 15.5, 'Good', 'Good', 'Good', 0),
(303, 10, 'benz', 1000200, 'Poor', 2, 15, 'Petrol', 'Manual', 200, 1000200, 990200, '2026-05-12', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(304, 12, 'DW', 1500, 'Good', 4, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-04-22', '2027-01-01', 'First', 1200, 4, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(305, 13, 'DVB', 30000, 'Good', 0, 14, 'Petrol', 'Manual', 3000, 30000, 20000, '2026-04-22', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(306, 20, 'dsfg', 3432, 'Good', 0, 25, 'Petrol', 'Automatic', 234, 3432, 0, '2026-04-23', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(307, 26, 'asdas', 232, 'Good', 0, 814, 'Petrol', 'Automatic', 1323, 232, 0, '2026-05-03', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(308, 27, 'sadas', 32443, 'Good', 2, 26, 'Diesel', 'Manual', 34324, 32443, 22443, '2026-05-04', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(309, 28, 'sdad', 21323, 'Good', 1, 26, 'Petrol', 'Manual', 233, 21323, 11323, '2026-05-04', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(310, 29, 'truck', 20000, 'Good', 4, 0, 'Petrol', 'Automatic', 200, 20000, 10000, '2026-05-05', '2027-01-01', 'First', 1200, 4, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(311, 30, 'CLIO', 8500, 'Good', 1, 0, 'Petrol', 'Manual', 1.5, 8500, 0, '2026-05-11', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(312, 31, 'scani20', 90000, 'Good', 0, 2, 'Diesel', 'Manual', 100, 90000, 80000, '2026-05-12', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(313, 32, 'TRUCK', 85000, 'Good', 2, 1, 'Diesel', 'Manual', 1.5, 85000, 75000, '2026-05-12', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(314, 33, 'truck', 100000, 'Good', 0, 2, 'Diesel', 'Manual', 1.3, 100000, 90000, '2026-05-12', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(315, 34, 'Truck', 100000, 'Good', 1, 1, 'Diesel', 'Manual', 1500, 100000, 90000, '2026-05-13', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(316, 35, 'Van', 230000, 'Good', 0, 4, 'Petrol', 'Automatic', 1500, 230000, 220000, '2026-05-14', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(317, 12, 'Car', 1500, 'Poor', 4, 6, 'Petrol', 'Automatic', 200, 1500, 0, '2026-04-22', '2027-01-01', 'First', 1200, 4, '0', 15.5, 'Worn Out', 'Worn Out', 'Weak', 1),
(318, 10, 'benz', 1000200, 'Poor', 2, 15, 'Petrol', 'Manual', 200, 1000200, 990200, '2026-05-12', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(319, 12, 'DW', 1500, 'Poor', 6, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-04-22', '2027-01-01', 'First', 1200, 6, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(320, 13, 'DVB', 30000, 'Good', 0, 14, 'Petrol', 'Manual', 3000, 30000, 20000, '2026-04-22', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(321, 20, 'dsfg', 3432, 'Good', 0, 25, 'Petrol', 'Automatic', 234, 3432, 0, '2026-04-23', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(322, 26, 'asdas', 232, 'Good', 0, 814, 'Petrol', 'Automatic', 1323, 232, 0, '2026-05-03', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(323, 27, 'sadas', 32443, 'Good', 2, 26, 'Diesel', 'Manual', 34324, 32443, 22443, '2026-05-04', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(324, 28, 'sdad', 21323, 'Good', 1, 26, 'Petrol', 'Manual', 233, 21323, 11323, '2026-05-04', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(325, 29, 'truck', 20000, 'Good', 4, 0, 'Petrol', 'Automatic', 200, 20000, 10000, '2026-05-05', '2027-01-01', 'First', 1200, 4, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(326, 30, 'CLIO', 8500, 'Good', 1, 0, 'Petrol', 'Manual', 1.5, 8500, 0, '2026-05-11', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(327, 31, 'scani20', 90000, 'Good', 0, 2, 'Diesel', 'Manual', 100, 90000, 80000, '2026-05-12', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(328, 32, 'TRUCK', 85000, 'Good', 2, 1, 'Diesel', 'Manual', 1.5, 85000, 75000, '2026-05-12', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(329, 33, 'truck', 100000, 'Good', 0, 2, 'Diesel', 'Manual', 1.3, 100000, 90000, '2026-05-12', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(330, 34, 'Truck', 100000, 'Good', 1, 1, 'Diesel', 'Manual', 1500, 100000, 90000, '2026-05-13', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(331, 35, 'Van', 230000, 'Good', 0, 4, 'Petrol', 'Automatic', 1500, 230000, 220000, '2026-05-14', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(332, 10, 'benz', 1000200, 'Poor', 2, 15, 'Petrol', 'Manual', 200, 1000200, 990200, '2026-05-12', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(333, 10, 'benz', 1000200, 'Poor', 2, 15, 'Petrol', 'Manual', 200, 1000200, 990200, '2026-05-12', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(334, 12, 'DW', 1500, 'Poor', 6, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-04-22', '2027-01-01', 'First', 1200, 6, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(335, 13, 'DVB', 30000, 'Good', 0, 14, 'Petrol', 'Manual', 3000, 30000, 20000, '2026-04-22', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(336, 20, 'dsfg', 3432, 'Good', 0, 25, 'Petrol', 'Automatic', 234, 3432, 0, '2026-04-23', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(337, 26, 'asdas', 232, 'Good', 0, 814, 'Petrol', 'Automatic', 1323, 232, 0, '2026-05-03', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(338, 27, 'sadas', 32443, 'Good', 2, 26, 'Diesel', 'Manual', 34324, 32443, 22443, '2026-05-04', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(339, 28, 'sdad', 21323, 'Good', 1, 26, 'Petrol', 'Manual', 233, 21323, 11323, '2026-05-04', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(340, 29, 'truck', 20000, 'Good', 4, 0, 'Petrol', 'Automatic', 200, 20000, 10000, '2026-05-05', '2027-01-01', 'First', 1200, 4, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(341, 30, 'CLIO', 8500, 'Good', 2, 0, 'Petrol', 'Manual', 1.5, 8500, 0, '2026-05-11', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(342, 31, 'scani20', 90000, 'Good', 0, 2, 'Diesel', 'Manual', 100, 90000, 80000, '2026-05-12', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(343, 32, 'TRUCK', 85000, 'Good', 2, 1, 'Diesel', 'Manual', 1.5, 85000, 75000, '2026-05-12', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(344, 33, 'truck', 100000, 'Good', 0, 2, 'Diesel', 'Manual', 1.3, 100000, 90000, '2026-05-12', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(345, 34, 'Truck', 100000, 'Good', 1, 1, 'Diesel', 'Manual', 1500, 100000, 90000, '2026-05-13', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(346, 35, 'Van', 230000, 'Good', 0, 4, 'Petrol', 'Automatic', 1500, 230000, 220000, '2026-05-14', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(347, 10, 'benz', 1000200, 'Poor', 2, 15, 'Petrol', 'Manual', 200, 1000200, 990200, '2026-05-12', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(348, 12, 'DW', 1500, 'Poor', 6, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-04-22', '2027-01-01', 'First', 1200, 6, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(349, 13, 'DVB', 30000, 'Good', 0, 14, 'Petrol', 'Manual', 3000, 30000, 20000, '2026-04-22', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(350, 20, 'dsfg', 3432, 'Good', 0, 25, 'Petrol', 'Automatic', 234, 3432, 0, '2026-04-23', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(351, 26, 'asdas', 232, 'Good', 0, 814, 'Petrol', 'Automatic', 1323, 232, 0, '2026-05-03', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(352, 27, 'sadas', 32443, 'Good', 2, 26, 'Diesel', 'Manual', 34324, 32443, 22443, '2026-05-04', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(353, 28, 'sdad', 21323, 'Good', 1, 26, 'Petrol', 'Manual', 233, 21323, 11323, '2026-05-04', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0);
INSERT INTO `vehicle_data` (`id`, `vehicule_id`, `vehicle_model`, `mileage`, `maintenance_history`, `reported_issues`, `vehicle_age`, `fuel_type`, `transmission_type`, `engine_size`, `odometer_reading`, `last_service_mileage`, `last_service_date`, `warranty_expiry_date`, `owner_type`, `insurance_premium`, `service_history`, `accident_history`, `fuel_efficiency`, `tire_condition`, `brake_condition`, `battery_status`, `need_maintenance`) VALUES
(354, 29, 'truck', 20000, 'Good', 4, 0, 'Petrol', 'Automatic', 200, 20000, 10000, '2026-05-05', '2027-01-01', 'First', 1200, 4, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(355, 30, 'CLIO', 8500, 'Good', 2, 0, 'Petrol', 'Manual', 1.5, 8500, 0, '2026-05-11', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(356, 31, 'scani20', 90000, 'Good', 0, 2, 'Diesel', 'Manual', 100, 90000, 80000, '2026-05-12', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(357, 32, 'TRUCK', 85000, 'Good', 2, 1, 'Diesel', 'Manual', 1.5, 85000, 75000, '2026-05-12', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(358, 33, 'truck', 100000, 'Good', 0, 2, 'Diesel', 'Manual', 1.3, 100000, 90000, '2026-05-12', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(359, 34, 'Truck', 100000, 'Good', 1, 1, 'Diesel', 'Manual', 1500, 100000, 90000, '2026-05-13', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(360, 35, 'Van', 230000, 'Good', 0, 4, 'Petrol', 'Automatic', 1500, 230000, 220000, '2026-05-14', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(361, 10, 'benz', 1000200, 'Poor', 2, 15, 'Petrol', 'Manual', 200, 1000200, 990200, '2026-05-12', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(362, 12, 'Car', 1500, 'Poor', 6, 6, 'Petrol', 'Automatic', 200, 1500, 0, '2026-04-22', '2027-01-01', 'First', 1200, 6, '0', 15.5, 'Worn Out', 'Worn Out', 'Weak', 1),
(363, 10, 'benz', 1000200, 'Poor', 2, 15, 'Petrol', 'Manual', 200, 1000200, 990200, '2026-05-12', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(364, 12, 'DW', 1500, 'Poor', 6, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-04-22', '2027-01-01', 'First', 1200, 6, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(365, 13, 'DVB', 30000, 'Good', 0, 14, 'Petrol', 'Manual', 3000, 30000, 20000, '2026-04-22', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(366, 20, 'dsfg', 3432, 'Good', 0, 25, 'Petrol', 'Automatic', 234, 3432, 0, '2026-04-23', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(367, 26, 'asdas', 232, 'Good', 0, 814, 'Petrol', 'Automatic', 1323, 232, 0, '2026-05-03', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(368, 27, 'sadas', 32443, 'Good', 2, 26, 'Diesel', 'Manual', 34324, 32443, 22443, '2026-05-04', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(369, 28, 'sdad', 21323, 'Good', 1, 26, 'Petrol', 'Manual', 233, 21323, 11323, '2026-05-04', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(370, 29, 'truck', 20000, 'Good', 4, 0, 'Petrol', 'Automatic', 200, 20000, 10000, '2026-05-05', '2027-01-01', 'First', 1200, 4, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(371, 30, 'CLIO', 8500, 'Good', 2, 0, 'Petrol', 'Manual', 1.5, 8500, 0, '2026-05-11', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(372, 31, 'scani20', 90000, 'Good', 0, 2, 'Diesel', 'Manual', 100, 90000, 80000, '2026-05-12', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(373, 32, 'TRUCK', 85000, 'Good', 2, 1, 'Diesel', 'Manual', 1.5, 85000, 75000, '2026-05-12', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(374, 33, 'truck', 100000, 'Good', 0, 2, 'Diesel', 'Manual', 1.3, 100000, 90000, '2026-05-12', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(375, 34, 'Truck', 100000, 'Good', 1, 1, 'Diesel', 'Manual', 1500, 100000, 90000, '2026-05-13', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(376, 35, 'Van', 230000, 'Good', 0, 4, 'Petrol', 'Automatic', 1500, 230000, 220000, '2026-05-14', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(377, 10, 'benz', 1000200, 'Poor', 2, 15, 'Petrol', 'Manual', 200, 1000200, 990200, '2026-05-12', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', NULL),
(378, 12, 'DW', 1500, 'Poor', 6, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-04-22', '2027-01-01', 'First', 1200, 6, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', NULL),
(379, 13, 'DVB', 30000, 'Good', 0, 14, 'Petrol', 'Manual', 3000, 30000, 20000, '2026-04-22', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', NULL),
(380, 20, 'dsfg', 3432, 'Good', 0, 25, 'Petrol', 'Automatic', 234, 3432, 0, '2026-04-23', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', NULL),
(381, 26, 'asdas', 232, 'Good', 0, 814, 'Petrol', 'Automatic', 1323, 232, 0, '2026-05-03', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', NULL),
(382, 27, 'sadas', 32443, 'Good', 2, 26, 'Diesel', 'Manual', 34324, 32443, 22443, '2026-05-04', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', NULL),
(383, 28, 'sdad', 21323, 'Good', 1, 26, 'Petrol', 'Manual', 233, 21323, 11323, '2026-05-04', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', NULL),
(384, 29, 'truck', 20000, 'Good', 4, 0, 'Petrol', 'Automatic', 200, 20000, 10000, '2026-05-05', '2027-01-01', 'First', 1200, 4, 'No', 15.5, 'Good', 'Good', 'Good', NULL),
(385, 30, 'CLIO', 8500, 'Good', 2, 0, 'Petrol', 'Manual', 1.5, 8500, 0, '2026-05-11', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', NULL),
(386, 31, 'scani20', 90000, 'Good', 0, 2, 'Diesel', 'Manual', 100, 90000, 80000, '2026-05-12', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', NULL),
(387, 32, 'TRUCK', 85000, 'Good', 2, 1, 'Diesel', 'Manual', 1.5, 85000, 75000, '2026-05-12', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', NULL),
(388, 33, 'truck', 100000, 'Good', 0, 2, 'Diesel', 'Manual', 1.3, 100000, 90000, '2026-05-12', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', NULL),
(389, 34, 'Truck', 100000, 'Good', 1, 1, 'Diesel', 'Manual', 1500, 100000, 90000, '2026-05-13', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', NULL),
(390, 35, 'Van', 230000, 'Good', 0, 4, 'Petrol', 'Automatic', 1500, 230000, 220000, '2026-05-14', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', NULL),
(391, 10, 'benz', 1000200, 'Poor', 2, 15, 'Petrol', 'Manual', 200, 1000200, 990200, '2026-05-12', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', NULL),
(392, 12, 'DW', 1500, 'Poor', 6, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-04-22', '2027-01-01', 'First', 1200, 6, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', NULL),
(393, 13, 'DVB', 30000, 'Good', 0, 14, 'Petrol', 'Manual', 3000, 30000, 20000, '2026-04-22', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', NULL),
(394, 20, 'dsfg', 3432, 'Good', 0, 25, 'Petrol', 'Automatic', 234, 3432, 0, '2026-04-23', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', NULL),
(395, 26, 'asdas', 232, 'Good', 0, 814, 'Petrol', 'Automatic', 1323, 232, 0, '2026-05-03', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', NULL),
(396, 27, 'sadas', 32443, 'Good', 2, 26, 'Diesel', 'Manual', 34324, 32443, 22443, '2026-05-04', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', NULL),
(397, 28, 'sdad', 21323, 'Good', 1, 26, 'Petrol', 'Manual', 233, 21323, 11323, '2026-05-04', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', NULL),
(398, 29, 'truck', 20000, 'Good', 4, 0, 'Petrol', 'Automatic', 200, 20000, 10000, '2026-05-05', '2027-01-01', 'First', 1200, 4, 'No', 15.5, 'Good', 'Good', 'Good', NULL),
(399, 30, 'CLIO', 8500, 'Good', 2, 0, 'Petrol', 'Manual', 1.5, 8500, 0, '2026-05-11', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', NULL),
(400, 31, 'scani20', 90000, 'Good', 0, 2, 'Diesel', 'Manual', 100, 90000, 80000, '2026-05-12', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', NULL),
(401, 32, 'TRUCK', 85000, 'Good', 2, 1, 'Diesel', 'Manual', 1.5, 85000, 75000, '2026-05-12', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', NULL),
(402, 33, 'truck', 100000, 'Good', 0, 2, 'Diesel', 'Manual', 1.3, 100000, 90000, '2026-05-12', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', NULL),
(403, 34, 'Truck', 100000, 'Good', 1, 1, 'Diesel', 'Manual', 1500, 100000, 90000, '2026-05-13', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', NULL),
(404, 35, 'Van', 230000, 'Good', 0, 4, 'Petrol', 'Automatic', 1500, 230000, 220000, '2026-05-14', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', NULL),
(405, 10, 'benz', 1000200, 'Poor', 2, 15, 'Petrol', 'Manual', 200, 1000200, 990200, '2026-05-12', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', NULL),
(406, 10, 'benz', 1000200, 'Good', 7, 15, 'Petrol', 'Manual', 200, 1000200, 990200, '2026-05-25', '2027-01-01', 'First', 1200, 7, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(407, 12, 'DW', 1500, 'Good', 7, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-05-22', '2027-01-01', 'First', 1200, 7, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(408, 12, 'Car', 1500, 'Poor', 7, 6, 'Petrol', 'Automatic', 200, 1500, 0, '2026-05-22', '2027-01-01', 'First', 1200, 7, '0', 15.5, 'Worn Out', 'Worn Out', 'Weak', 1),
(409, 10, 'benz', 1000200, 'Good', 7, 15, 'Petrol', 'Manual', 200, 1000200, 990200, '2026-05-25', '2027-01-01', 'First', 1200, 7, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(410, 34, 'Truck', 100000, 'Good', 1, 1, 'Diesel', 'Manual', 1500, 100000, 90000, '2026-05-22', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(411, 35, 'Van', 230000, 'Good', 6, 4, 'Petrol', 'Automatic', 1500, 230000, 220000, '2026-05-22', '2027-01-01', 'First', 1200, 6, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(412, 10, 'benz', 1000200, 'Good', 7, 15, 'Petrol', 'Manual', 200, 1000200, 990200, '2026-05-25', '2027-01-01', 'First', 1200, 7, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(413, 12, 'DW', 1500, 'Good', 7, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-05-22', '2027-01-01', 'First', 1200, 7, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(414, 13, 'DVB', 30000, 'Good', 1, 14, 'Petrol', 'Manual', 3000, 30000, 20000, '2026-05-22', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(415, 20, 'dsfg', 3432, 'Good', 0, 25, 'Petrol', 'Automatic', 234, 3432, 0, '2026-05-22', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(416, 26, 'asdas', 232, 'Good', 2, 814, 'Petrol', 'Automatic', 1323, 232, 0, '2026-05-22', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(417, 27, 'sadas', 32443, 'Good', 2, 26, 'Diesel', 'Manual', 34324, 32443, 22443, '2026-05-22', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(418, 28, 'sdad', 21323, 'Good', 1, 26, 'Petrol', 'Manual', 233, 21323, 11323, '2026-05-22', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(419, 29, 'truck', 20000, 'Good', 4, 0, 'Petrol', 'Automatic', 200, 20000, 10000, '2026-05-22', '2027-01-01', 'First', 1200, 4, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(420, 30, 'CLIO', 8500, 'Good', 3, 0, 'Petrol', 'Manual', 1.5, 8500, 0, '2026-05-22', '2027-01-01', 'First', 1200, 3, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(421, 31, 'scani20', 90000, 'Good', 0, 2, 'Diesel', 'Manual', 100, 90000, 80000, '2026-05-22', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(422, 32, 'TRUCK', 85000, 'Good', 2, 1, 'Diesel', 'Manual', 1.5, 85000, 75000, '2026-05-22', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(423, 33, 'truck', 100000, 'Good', 1, 2, 'Diesel', 'Manual', 1.3, 100000, 90000, '2026-05-22', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(424, 34, 'Truck', 100000, 'Good', 1, 1, 'Diesel', 'Manual', 1500, 100000, 90000, '2026-05-22', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(425, 35, 'Van', 230000, 'Good', 6, 4, 'Petrol', 'Automatic', 1500, 230000, 220000, '2026-05-22', '2027-01-01', 'First', 1200, 6, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(426, 10, 'benz', 1000200, 'Good', 7, 15, 'Petrol', 'Manual', 200, 1000200, 990200, '2026-05-25', '2027-01-01', 'First', 1200, 7, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(427, 12, 'DW', 1500, 'Good', 7, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-05-22', '2027-01-01', 'First', 1200, 7, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(428, 13, 'DVB', 30000, 'Good', 1, 14, 'Petrol', 'Manual', 3000, 30000, 20000, '2026-05-22', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(429, 20, 'dsfg', 3432, 'Good', 0, 25, 'Petrol', 'Automatic', 234, 3432, 0, '2026-05-22', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(430, 26, 'asdas', 232, 'Good', 2, 814, 'Petrol', 'Automatic', 1323, 232, 0, '2026-05-22', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(431, 27, 'sadas', 32443, 'Good', 2, 26, 'Diesel', 'Manual', 34324, 32443, 22443, '2026-05-22', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(432, 28, 'sdad', 21323, 'Good', 1, 26, 'Petrol', 'Manual', 233, 21323, 11323, '2026-05-22', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(433, 29, 'truck', 20000, 'Good', 4, 0, 'Petrol', 'Automatic', 200, 20000, 10000, '2026-05-22', '2027-01-01', 'First', 1200, 4, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(434, 30, 'CLIO', 8500, 'Good', 3, 0, 'Petrol', 'Manual', 1.5, 8500, 0, '2026-05-22', '2027-01-01', 'First', 1200, 3, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(435, 31, 'scani20', 90000, 'Good', 0, 2, 'Diesel', 'Manual', 100, 90000, 80000, '2026-05-22', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(436, 32, 'TRUCK', 85000, 'Good', 2, 1, 'Diesel', 'Manual', 1.5, 85000, 75000, '2026-05-22', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(437, 33, 'truck', 100000, 'Good', 1, 2, 'Diesel', 'Manual', 1.3, 100000, 90000, '2026-05-22', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(438, 34, 'Truck', 100000, 'Good', 1, 1, 'Diesel', 'Manual', 1500, 100000, 90000, '2026-05-22', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(439, 35, 'Van', 230000, 'Good', 6, 4, 'Petrol', 'Automatic', 1500, 230000, 220000, '2026-05-22', '2027-01-01', 'First', 1200, 6, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(440, 10, 'benz', 1000200, 'Good', 7, 15, 'Petrol', 'Manual', 200, 1000200, 990200, '2026-05-25', '2027-01-01', 'First', 1200, 7, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(441, 10, 'Car', 1000200, 'Poor', 7, 15, 'Petrol', 'Automatic', 200, 1000200, 990200, '2026-05-25', '2027-01-01', 'First', 1200, 7, '0', 15.5, 'Worn Out', 'Worn Out', 'Weak', 1),
(442, 12, 'DW', 1500, 'Good', 7, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-05-22', '2027-01-01', 'First', 1200, 7, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(443, 12, 'Car', 1500, 'Poor', 7, 6, 'Petrol', 'Automatic', 200, 1500, 0, '2026-05-22', '2027-01-01', 'First', 1200, 7, '0', 15.5, 'Worn Out', 'Worn Out', 'Weak', 1),
(444, 12, 'Car', 1500, 'Poor', 7, 6, 'Petrol', 'Automatic', 200, 1500, 0, '2026-05-22', '2027-01-01', 'First', 1200, 7, '0', 15.5, 'Worn Out', 'Worn Out', 'Weak', 1),
(445, 13, 'DVB', 30000, 'Good', 1, 14, 'Petrol', 'Manual', 3000, 30000, 20000, '2026-05-22', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(446, 13, 'Car', 30000, 'Good', 1, 14, 'Petrol', 'Automatic', 3000, 30000, 20000, '2026-05-22', '2027-01-01', 'First', 1200, 1, '0', 15.5, 'Good', 'Good', 'Good', 0),
(447, 13, 'DVB', 30000, 'Good', 1, 14, 'Petrol', 'Manual', 3000, 30000, 20000, '2026-05-22', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(448, 13, 'Car', 30000, 'Good', 1, 14, 'Petrol', 'Automatic', 3000, 30000, 20000, '2026-05-22', '2027-01-01', 'First', 1200, 1, '0', 15.5, 'Good', 'Good', 'Good', 0),
(449, 12, 'DW', 1500, 'Good', 7, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-05-22', '2027-01-01', 'First', 1200, 7, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(450, 12, 'Car', 1500, 'Poor', 7, 6, 'Petrol', 'Automatic', 200, 1500, 0, '2026-05-22', '2027-01-01', 'First', 1200, 7, '0', 15.5, 'Worn Out', 'Worn Out', 'Weak', 1),
(451, 26, 'asdas', 232, 'Good', 2, 814, 'Petrol', 'Automatic', 1323, 232, 0, '2026-05-22', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(452, 26, 'Car', 232, 'Good', 2, 814, 'Petrol', 'Automatic', 1323, 232, 0, '2026-05-22', '2027-01-01', 'First', 1200, 2, '0', 15.5, 'Good', 'Good', 'Good', 1),
(453, 10, 'benz', 1000200, 'Good', 7, 15, 'Petrol', 'Manual', 200, 1000200, 990200, '2026-05-25', '2027-01-01', 'First', 1200, 7, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(454, 10, 'Car', 1000200, 'Poor', 7, 15, 'Petrol', 'Automatic', 200, 1000200, 990200, '2026-05-25', '2027-01-01', 'First', 1200, 7, '0', 15.5, 'Worn Out', 'Worn Out', 'Weak', 1),
(455, 10, 'Car', 1000200, 'Poor', 7, 15, 'Petrol', 'Automatic', 200, 1000200, 990200, '2026-05-25', '2027-01-01', 'First', 1200, 7, '0', 15.5, 'Worn Out', 'Worn Out', 'Weak', 1),
(456, 36, 'Car', 8500, 'Good', 0, 2, 'Diesel', 'Automatic', 1600, 8500, 0, '2024-07-07', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(457, 36, 'Car', 8500, 'Good', 0, 2, 'Diesel', 'Automatic', 1600, 8500, 0, '2024-07-07', '2027-01-01', 'First', 1200, 1, '0', 15.5, 'Good', 'Good', 'Good', 0),
(458, 10, 'Truck', 1000200, 'Good', 7, 15, 'Diesel', 'Manual', 200, 1000200, 990200, '2026-05-24', '2027-01-01', 'First', 1200, 7, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(459, 12, 'Van', 1500, 'Good', 7, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-05-21', '2027-01-01', 'First', 1200, 7, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(460, 13, 'Truck', 30000, 'Good', 1, 14, 'Petrol', 'Manual', 3000, 30000, 20000, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(461, 20, 'Truck', 3432, 'Good', 0, 25, 'Petrol', 'Automatic', 234, 3432, 0, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(462, 26, 'Car', 232, 'Good', 2, 814, 'Petrol', 'Automatic', 1323, 232, 0, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(463, 27, 'Truck', 32443, 'Good', 2, 26, 'Petrol', 'Manual', 34324, 32443, 22443, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(464, 28, 'Truck', 21323, 'Good', 1, 26, 'Diesel', 'Manual', 233, 21323, 11323, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(465, 29, 'Truck', 20000, 'Good', 5, 0, 'Diesel', 'Automatic', 200, 20000, 10000, '2026-05-21', '2027-01-01', 'First', 1200, 5, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(466, 30, 'Truck', 8500, 'Good', 3, 0, 'Petrol', 'Manual', 1.5, 8500, 0, '2026-05-21', '2027-01-01', 'First', 1200, 3, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(467, 31, 'Van', 90000, 'Good', 1, 2, 'Petrol', 'Manual', 100, 90000, 80000, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(468, 32, 'Truck', 85000, 'Poor', 3, 1, 'Petrol', 'Manual', 1.5, 85000, 75000, '2026-05-21', '2027-01-01', 'First', 1200, 3, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(469, 33, 'Car', 100000, 'Good', 2, 2, 'Petrol', 'Manual', 1.3, 100000, 90000, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(470, 34, 'Truck', 100000, 'Good', 2, 1, 'Petrol', 'Manual', 1500, 100000, 90000, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(471, 35, 'Van', 230000, 'Poor', 7, 4, 'Petrol', 'Automatic', 1500, 230000, 220000, '2026-05-22', '2027-01-01', 'First', 1200, 7, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(472, 36, 'Car', 8500, 'Good', 0, 2, 'Diesel', 'Automatic', 1600, 8500, 0, '2024-07-07', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(473, 10, 'Truck', 1000200, 'Good', 7, 15, 'Diesel', 'Manual', 200, 1000200, 990200, '2026-05-24', '2027-01-01', 'First', 1200, 7, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(474, 12, 'Van', 1500, 'Good', 7, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-05-21', '2027-01-01', 'First', 1200, 7, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(475, 13, 'Truck', 30000, 'Good', 1, 14, 'Petrol', 'Manual', 3000, 30000, 20000, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(476, 20, 'Truck', 3432, 'Good', 0, 25, 'Petrol', 'Automatic', 234, 3432, 0, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(477, 26, 'Car', 232, 'Good', 2, 814, 'Petrol', 'Automatic', 1323, 232, 0, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(478, 27, 'Truck', 32443, 'Good', 2, 26, 'Petrol', 'Manual', 34324, 32443, 22443, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(479, 28, 'Truck', 21323, 'Good', 1, 26, 'Diesel', 'Manual', 233, 21323, 11323, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(480, 29, 'Truck', 20000, 'Good', 5, 0, 'Diesel', 'Automatic', 200, 20000, 10000, '2026-05-21', '2027-01-01', 'First', 1200, 5, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(481, 30, 'Truck', 8500, 'Good', 3, 0, 'Petrol', 'Manual', 1.5, 8500, 0, '2026-05-21', '2027-01-01', 'First', 1200, 3, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(482, 31, 'Van', 90000, 'Good', 1, 2, 'Petrol', 'Manual', 100, 90000, 80000, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(483, 32, 'Truck', 85000, 'Poor', 3, 1, 'Petrol', 'Manual', 1.5, 85000, 75000, '2026-05-21', '2027-01-01', 'First', 1200, 3, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(484, 33, 'Car', 100000, 'Good', 2, 2, 'Petrol', 'Manual', 1.3, 100000, 90000, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(485, 34, 'Truck', 100000, 'Good', 2, 1, 'Petrol', 'Manual', 1500, 100000, 90000, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(486, 35, 'Van', 230000, 'Poor', 7, 4, 'Petrol', 'Automatic', 1500, 230000, 220000, '2026-05-22', '2027-01-01', 'First', 1200, 7, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(487, 36, 'Car', 8500, 'Good', 0, 2, 'Diesel', 'Automatic', 1600, 8500, 0, '2024-07-07', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(488, 12, 'Van', 1500, 'Poor', 7, 6, 'Diesel', 'Automatic', 200, 1500, 0, '2026-05-21', '2027-01-01', 'First', 1200, 7, '0', 15.5, 'Worn Out', 'Worn Out', 'Weak', 1),
(489, 26, 'Car', 232, 'Good', 2, 814, 'Petrol', 'Automatic', 1323, 232, 0, '2026-05-21', '2027-01-01', 'First', 1200, 2, '0', 15.5, 'Good', 'Good', 'Good', 1),
(490, 10, 'Car', 100000, 'Good', 7, 5, 'Petrol', 'Manual', 1.6, 100000, 90000, '2023-01-01', '2025-01-01', 'First', 1000, 1, '0', 15, 'Good', 'Good', 'Good', 1),
(491, 10, 'Car', 100000, 'Good', 7, 5, 'Petrol', 'Manual', 1.6, 100000, 90000, '2023-01-01', '2025-01-01', 'First', 1000, 1, '0', 15, 'Good', 'Good', 'Good', 1),
(492, 29, 'Car', 100000, 'Good', 5, 5, 'Petrol', 'Manual', 1.6, 100000, 90000, '2023-01-01', '2025-01-01', 'First', 1000, 1, '1', 15, 'Average', 'Good', 'Weak', 1),
(493, 10, 'Car', 100000, 'Good', 7, 5, 'Petrol', 'Manual', 1.6, 100000, 90000, '2023-01-01', '2025-01-01', 'First', 1000, 1, '0', 15, 'Good', 'Good', 'Good', 1),
(494, 10, 'Truck', 1000200, 'Good', 7, 15, 'Diesel', 'Manual', 200, 1000200, 990200, '2026-05-24', '2027-01-01', 'First', 1200, 7, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(495, 12, 'Van', 1500, 'Good', 7, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-05-21', '2027-01-01', 'First', 1200, 7, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(496, 13, 'Truck', 30000, 'Good', 1, 14, 'Petrol', 'Manual', 3000, 30000, 20000, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(497, 20, 'Truck', 3432, 'Good', 0, 25, 'Petrol', 'Automatic', 234, 3432, 0, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(498, 26, 'Car', 232, 'Good', 2, 814, 'Petrol', 'Automatic', 1323, 232, 0, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(499, 27, 'Truck', 32443, 'Good', 2, 26, 'Petrol', 'Manual', 34324, 32443, 22443, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(500, 28, 'Truck', 21323, 'Good', 1, 26, 'Diesel', 'Manual', 233, 21323, 11323, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(501, 29, 'Truck', 20000, 'Good', 5, 0, 'Diesel', 'Automatic', 200, 20000, 10000, '2026-05-21', '2027-01-01', 'First', 1200, 5, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(502, 30, 'Truck', 8500, 'Good', 3, 0, 'Petrol', 'Manual', 1.5, 8500, 0, '2026-05-21', '2027-01-01', 'First', 1200, 3, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(503, 31, 'Van', 90000, 'Good', 1, 2, 'Petrol', 'Manual', 100, 90000, 80000, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(504, 32, 'Truck', 85000, 'Poor', 3, 1, 'Petrol', 'Manual', 1.5, 85000, 75000, '2026-05-21', '2027-01-01', 'First', 1200, 3, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(505, 33, 'Car', 100000, 'Good', 2, 2, 'Petrol', 'Manual', 1.3, 100000, 90000, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(506, 34, 'Truck', 100000, 'Good', 2, 1, 'Petrol', 'Manual', 1500, 100000, 90000, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(507, 35, 'Van', 230000, 'Poor', 7, 4, 'Petrol', 'Automatic', 1500, 230000, 220000, '2026-05-22', '2027-01-01', 'First', 1200, 7, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(508, 36, 'Car', 8500, 'Good', 0, 2, 'Diesel', 'Automatic', 1600, 8500, 0, '2024-07-07', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(509, 13, 'Car', 100000, 'Average', 1, 5, 'Petrol', 'Manual', 1.6, 100000, 90000, '2026-05-31', '2025-01-01', 'First', 1000, 1, '0', 15, 'Good', 'Good', 'Good', 0),
(510, 10, 'Car', 100000, 'Poor', 7, 5, 'Petrol', 'Manual', 1.6, 100000, 90000, '2026-06-04', '2025-01-01', 'First', 1000, 7, '0', 15, 'Good', 'Good', 'Good', 1),
(511, 10, 'Car', 100000, 'Poor', 7, 5, 'Petrol', 'Manual', 1.6, 100000, 90000, '2026-06-04', '2025-01-01', 'First', 1000, 7, '0', 15, 'Good', 'Good', 'Good', 1),
(512, 10, 'Car', 100000, 'Poor', 7, 5, 'Petrol', 'Manual', 1.6, 100000, 90000, '2026-06-04', '2025-01-01', 'First', 1000, 7, '0', 15, 'Good', 'Good', 'Good', 1),
(513, 10, 'Car', 100000, 'Poor', 7, 5, 'Petrol', 'Manual', 1.6, 100000, 90000, '2026-06-04', '2025-01-01', 'First', 1000, 7, '0', 15, 'Good', 'Good', 'Good', 1),
(514, 10, 'Truck', 1000200, 'Good', 7, 15, 'Diesel', 'Manual', 200, 1000200, 990200, '2026-05-24', '2027-01-01', 'First', 1200, 7, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(515, 10, 'Car', 100000, 'Poor', 7, 5, 'Petrol', 'Manual', 1.6, 100000, 90000, '2026-06-04', '2025-01-01', 'First', 1000, 7, '0', 15, 'Good', 'Good', 'Good', 1),
(516, 10, 'Car', 100000, 'Poor', 7, 5, 'Petrol', 'Manual', 1.6, 100000, 90000, '2026-06-04', '2025-01-01', 'First', 1000, 7, '0', 15, 'Good', 'Good', 'Good', 1),
(517, 10, 'Car', 100000, 'Poor', 7, 5, 'Petrol', 'Manual', 1.6, 100000, 90000, '2026-06-04', '2025-01-01', 'First', 1000, 7, '0', 15, 'Good', 'Good', 'Weak', 1),
(518, 34, 'Car', 100000, 'Average', 2, 5, 'Petrol', 'Manual', 1.6, 100000, 90000, '2026-06-22', '2025-01-01', 'First', 1000, 2, '0', 15, 'Good', 'Good', 'Good', 0),
(519, 34, 'Car', 100000, 'Average', 2, 5, 'Petrol', 'Manual', 1.6, 100000, 90000, '2026-06-22', '2025-01-01', 'First', 1000, 2, '0', 15, 'Good', 'Good', 'Weak', 1),
(520, 10, 'Truck', 1000200, 'Good', 7, 15, 'Petrol', 'Automatic', 200, 1000200, 990200, '2026-05-24', '2027-01-01', 'First', 1200, 7, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(521, 10, 'Truck', 1000200, 'Good', 7, 15, 'Petrol', 'Automatic', 200, 1000200, 990200, '2026-05-24', '2027-01-01', 'First', 1200, 7, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(522, 12, 'Van', 1500, 'Good', 7, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-05-21', '2027-01-01', 'First', 1200, 7, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(523, 13, 'Truck', 30000, 'Good', 1, 14, 'Petrol', 'Automatic', 3000, 30000, 20000, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(524, 20, 'Truck', 3432, 'Good', 0, 25, 'Petrol', 'Automatic', 234, 3432, 0, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(525, 26, 'Car', 232, 'Good', 2, 2, 'Petrol', 'Automatic', 1323, 232, 0, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(526, 27, 'Truck', 32443, 'Good', 2, 26, 'Petrol', 'Manual', 34324, 32443, 22443, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(527, 28, 'Truck', 21323, 'Good', 1, 26, 'Diesel', 'Manual', 233, 21323, 11323, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(528, 29, 'Truck', 20000, 'Good', 5, 0, 'Diesel', 'Automatic', 200, 20000, 10000, '2026-05-21', '2027-01-01', 'First', 1200, 5, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(529, 30, 'Truck', 8500, 'Good', 3, 0, 'Petrol', 'Manual', 1.5, 8500, 0, '2026-05-21', '2027-01-01', 'First', 1200, 3, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(530, 31, 'Van', 90000, 'Good', 1, 2, 'Petrol', 'Manual', 100, 90000, 80000, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(531, 32, 'Truck', 85000, 'Poor', 3, 1, 'Petrol', 'Manual', 1.5, 85000, 75000, '2026-05-21', '2027-01-01', 'First', 1200, 3, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(532, 33, 'Car', 100000, 'Good', 2, 2, 'Petrol', 'Manual', 1.3, 100000, 90000, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(533, 34, 'Truck', 100000, 'Good', 2, 1, 'Petrol', 'Manual', 1500, 100000, 90000, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(534, 35, 'Van', 230000, 'Poor', 7, 4, 'Petrol', 'Automatic', 1500, 230000, 220000, '2026-05-22', '2027-01-01', 'First', 1200, 7, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(535, 36, 'Car', 8500, 'Good', 0, 2, 'Diesel', 'Automatic', 1600, 8500, 0, '2024-07-07', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(536, 10, 'Car', 100000, 'Poor', 7, 5, 'Petrol', 'Manual', 1.6, 100000, 90000, '2026-06-04', '2025-01-01', 'First', 1000, 7, '0', 15, 'Good', 'Good', 'Dead', 1),
(537, 10, 'Car', 100000, 'Poor', 7, 5, 'Petrol', 'Manual', 1.6, 100000, 90000, '2026-06-04', '2025-01-01', 'First', 1000, 7, '0', 15, 'Good', 'Good', 'Dead', 1),
(538, 10, 'Truck', 1000200, 'Good', 7, 15, 'Petrol', 'Automatic', 200, 1000200, 990200, '2026-05-24', '2027-01-01', 'First', 1200, 7, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(539, 12, 'Van', 1500, 'Good', 7, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-05-21', '2027-01-01', 'First', 1200, 7, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(540, 13, 'Truck', 30000, 'Good', 1, 14, 'Petrol', 'Automatic', 3000, 30000, 20000, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(541, 20, 'Truck', 3432, 'Good', 0, 25, 'Petrol', 'Automatic', 234, 3432, 0, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(542, 26, 'Car', 232, 'Good', 2, 2, 'Petrol', 'Automatic', 1323, 232, 0, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(543, 27, 'Truck', 32443, 'Good', 2, 26, 'Petrol', 'Manual', 34324, 32443, 22443, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(544, 28, 'Truck', 21323, 'Good', 1, 26, 'Diesel', 'Manual', 233, 21323, 11323, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(545, 29, 'Truck', 20000, 'Good', 5, 0, 'Diesel', 'Automatic', 200, 20000, 10000, '2026-05-21', '2027-01-01', 'First', 1200, 5, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(546, 30, 'Truck', 8500, 'Good', 3, 0, 'Petrol', 'Manual', 1.5, 8500, 0, '2026-05-21', '2027-01-01', 'First', 1200, 3, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(547, 31, 'Van', 90000, 'Good', 1, 2, 'Petrol', 'Manual', 100, 90000, 80000, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(548, 32, 'Truck', 85000, 'Poor', 3, 1, 'Petrol', 'Manual', 1.5, 85000, 75000, '2026-05-21', '2027-01-01', 'First', 1200, 3, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(549, 33, 'Car', 100000, 'Good', 2, 2, 'Petrol', 'Manual', 1.3, 100000, 90000, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(550, 34, 'Truck', 100000, 'Good', 2, 1, 'Petrol', 'Manual', 1500, 100000, 90000, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(551, 35, 'Van', 230000, 'Poor', 7, 4, 'Petrol', 'Automatic', 1500, 230000, 220000, '2026-05-22', '2027-01-01', 'First', 1200, 7, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(552, 36, 'Car', 8500, 'Good', 0, 2, 'Diesel', 'Automatic', 1600, 8500, 0, '2024-07-07', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(553, 20, 'Car', 100000, 'Good', 0, 5, 'Petrol', 'Manual', 1.6, 100000, 90000, '2026-05-21', '2025-01-01', 'First', 1000, 1, '0', 15, 'Average', 'Average', 'Weak', 1),
(554, 10, 'Truck', 1000200, 'Good', 7, 15, 'Petrol', 'Automatic', 200, 1000200, 990200, '2026-05-24', '2027-01-01', 'First', 1200, 7, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(555, 12, 'Van', 1500, 'Good', 7, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-05-21', '2027-01-01', 'First', 1200, 7, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(556, 13, 'Truck', 30000, 'Good', 1, 14, 'Petrol', 'Automatic', 3000, 30000, 20000, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(557, 20, 'Truck', 3432, 'Good', 0, 25, 'Petrol', 'Automatic', 234, 3432, 0, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(558, 26, 'Car', 232, 'Good', 2, 2, 'Petrol', 'Automatic', 1323, 232, 0, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(559, 27, 'Truck', 32443, 'Good', 2, 26, 'Petrol', 'Manual', 34324, 32443, 22443, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(560, 28, 'Truck', 21323, 'Good', 1, 26, 'Diesel', 'Manual', 233, 21323, 11323, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(561, 29, 'Truck', 20000, 'Good', 5, 0, 'Diesel', 'Automatic', 200, 20000, 10000, '2026-05-21', '2027-01-01', 'First', 1200, 5, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(562, 30, 'Truck', 8500, 'Good', 3, 0, 'Petrol', 'Manual', 1.5, 8500, 0, '2026-05-21', '2027-01-01', 'First', 1200, 3, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(563, 31, 'Van', 90000, 'Good', 1, 2, 'Petrol', 'Manual', 100, 90000, 80000, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(564, 32, 'Truck', 85000, 'Poor', 3, 1, 'Petrol', 'Manual', 1.5, 85000, 75000, '2026-05-21', '2027-01-01', 'First', 1200, 3, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(565, 33, 'Car', 100000, 'Good', 2, 2, 'Petrol', 'Manual', 1.3, 100000, 90000, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(566, 34, 'Truck', 100000, 'Good', 2, 1, 'Petrol', 'Manual', 1500, 100000, 90000, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(567, 35, 'Van', 230000, 'Poor', 7, 4, 'Petrol', 'Automatic', 1500, 230000, 220000, '2026-05-22', '2027-01-01', 'First', 1200, 7, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(568, 36, 'Car', 8500, 'Good', 0, 2, 'Diesel', 'Automatic', 1600, 8500, 0, '2024-07-07', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(569, 36, 'Car', 8500, 'Good', 0, 2, 'Diesel', 'Automatic', 1600, 8500, 0, '2024-07-07', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(570, 36, 'Car', 100000, 'Good', 0, 5, 'Petrol', 'Manual', 1.6, 100000, 90000, '2024-07-07', '2025-01-01', 'First', 1000, 1, '0', 15, 'Average', 'Average', 'Dead', 0),
(571, 34, 'Car', 100000, 'Average', 2, 5, 'Petrol', 'Manual', 1.6, 100000, 90000, '2026-06-22', '2025-01-01', 'First', 1000, 2, '0', 15, 'Worn Out', 'Worn Out', 'Dead', 1),
(572, 10, 'Truck', 1000200, 'Good', 7, 15, 'Petrol', 'Automatic', 200, 1000200, 990200, '2026-05-24', '2027-01-01', 'First', 1200, 7, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(573, 12, 'Van', 1500, 'Good', 7, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-05-21', '2027-01-01', 'First', 1200, 7, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(574, 13, 'Truck', 30000, 'Good', 1, 14, 'Petrol', 'Automatic', 3000, 30000, 20000, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(575, 20, 'Truck', 3432, 'Good', 0, 25, 'Petrol', 'Automatic', 234, 3432, 0, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(576, 26, 'Car', 232, 'Good', 2, 2, 'Petrol', 'Automatic', 1323, 232, 0, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(577, 27, 'Truck', 32443, 'Good', 2, 26, 'Petrol', 'Manual', 34324, 32443, 22443, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(578, 28, 'Truck', 21323, 'Good', 1, 26, 'Diesel', 'Manual', 233, 21323, 11323, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(579, 29, 'Truck', 20000, 'Good', 5, 0, 'Diesel', 'Automatic', 200, 20000, 10000, '2026-05-21', '2027-01-01', 'First', 1200, 5, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(580, 30, 'Truck', 8500, 'Good', 3, 0, 'Petrol', 'Manual', 1.5, 8500, 0, '2026-05-21', '2027-01-01', 'First', 1200, 3, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(581, 31, 'Van', 90000, 'Good', 1, 2, 'Petrol', 'Manual', 100, 90000, 80000, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(582, 32, 'Truck', 85000, 'Poor', 3, 1, 'Petrol', 'Manual', 1.5, 85000, 75000, '2026-05-21', '2027-01-01', 'First', 1200, 3, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(583, 33, 'Car', 100000, 'Good', 2, 2, 'Petrol', 'Manual', 1.3, 100000, 90000, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(584, 34, 'Truck', 100000, 'Good', 2, 1, 'Petrol', 'Manual', 1500, 100000, 90000, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(585, 35, 'Van', 230000, 'Poor', 7, 4, 'Petrol', 'Automatic', 1500, 230000, 220000, '2026-05-22', '2027-01-01', 'First', 1200, 7, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(586, 36, 'Car', 8500, 'Good', 0, 2, 'Diesel', 'Automatic', 1600, 8500, 0, '2024-07-07', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(587, 20, 'Car', 100000, 'Good', 0, 5, 'Petrol', 'Manual', 1.6, 100000, 90000, '2026-05-21', '2025-01-01', 'First', 1000, 1, '0', 15, 'Good', 'Good', 'Good', 0),
(588, 10, 'Truck', 1000200, 'Good', 7, 15, 'Petrol', 'Automatic', 200, 1000200, 990200, '2026-05-24', '2027-01-01', 'First', 1200, 7, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(589, 12, 'Van', 1500, 'Good', 7, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-05-21', '2027-01-01', 'First', 1200, 7, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(590, 13, 'Truck', 30000, 'Good', 1, 14, 'Petrol', 'Automatic', 3000, 30000, 20000, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(591, 20, 'Truck', 3432, 'Good', 0, 25, 'Petrol', 'Automatic', 234, 3432, 0, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(592, 26, 'Car', 232, 'Good', 2, 2, 'Petrol', 'Automatic', 1323, 232, 0, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(593, 27, 'Truck', 32443, 'Good', 2, 26, 'Petrol', 'Manual', 34324, 32443, 22443, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(594, 28, 'Truck', 21323, 'Good', 1, 26, 'Diesel', 'Manual', 233, 21323, 11323, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(595, 29, 'Truck', 20000, 'Good', 5, 0, 'Diesel', 'Automatic', 200, 20000, 10000, '2026-05-21', '2027-01-01', 'First', 1200, 5, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(596, 30, 'Truck', 8500, 'Good', 3, 0, 'Petrol', 'Manual', 1.5, 8500, 0, '2026-05-21', '2027-01-01', 'First', 1200, 3, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(597, 31, 'Van', 90000, 'Good', 1, 2, 'Petrol', 'Manual', 100, 90000, 80000, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(598, 32, 'Truck', 85000, 'Poor', 3, 1, 'Petrol', 'Manual', 1.5, 85000, 75000, '2026-05-21', '2027-01-01', 'First', 1200, 3, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(599, 33, 'Car', 100000, 'Good', 2, 2, 'Petrol', 'Manual', 1.3, 100000, 90000, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(600, 34, 'Truck', 100000, 'Good', 2, 1, 'Petrol', 'Manual', 1500, 100000, 90000, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(601, 35, 'Van', 230000, 'Poor', 7, 4, 'Petrol', 'Automatic', 1500, 230000, 220000, '2026-05-22', '2027-01-01', 'First', 1200, 7, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(602, 36, 'Car', 8500, 'Good', 0, 2, 'Diesel', 'Automatic', 1600, 8500, 0, '2024-07-07', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(603, 10, 'Truck', 1000200, 'Good', 7, 15, 'Petrol', 'Automatic', 200, 1000200, 990200, '2026-05-24', '2027-01-01', 'First', 1200, 7, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(604, 12, 'Van', 1500, 'Good', 7, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-05-21', '2027-01-01', 'First', 1200, 7, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(605, 13, 'Truck', 30000, 'Good', 1, 14, 'Petrol', 'Automatic', 3000, 30000, 20000, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(606, 20, 'Truck', 3432, 'Good', 0, 25, 'Petrol', 'Automatic', 234, 3432, 0, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(607, 26, 'Car', 232, 'Good', 2, 2, 'Petrol', 'Automatic', 1323, 232, 0, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(608, 27, 'Truck', 32443, 'Good', 2, 26, 'Petrol', 'Manual', 34324, 32443, 22443, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(609, 28, 'Truck', 21323, 'Good', 1, 26, 'Diesel', 'Manual', 233, 21323, 11323, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(610, 29, 'Truck', 20000, 'Good', 5, 0, 'Diesel', 'Automatic', 200, 20000, 10000, '2026-05-21', '2027-01-01', 'First', 1200, 5, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(611, 30, 'Truck', 8500, 'Good', 3, 0, 'Petrol', 'Manual', 1.5, 8500, 0, '2026-05-21', '2027-01-01', 'First', 1200, 3, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(612, 31, 'Van', 90000, 'Good', 1, 2, 'Petrol', 'Manual', 100, 90000, 80000, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(613, 32, 'Truck', 85000, 'Poor', 3, 1, 'Petrol', 'Manual', 1.5, 85000, 75000, '2026-05-21', '2027-01-01', 'First', 1200, 3, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(614, 33, 'Car', 100000, 'Good', 2, 2, 'Petrol', 'Manual', 1.3, 100000, 90000, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(615, 34, 'Truck', 100000, 'Good', 2, 1, 'Petrol', 'Manual', 1500, 100000, 90000, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(616, 35, 'Van', 230000, 'Poor', 7, 4, 'Petrol', 'Automatic', 1500, 230000, 220000, '2026-05-22', '2027-01-01', 'First', 1200, 7, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(617, 36, 'Car', 8500, 'Good', 0, 2, 'Diesel', 'Automatic', 1600, 8500, 0, '2024-07-07', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(618, 10, 'Car', 100000, 'Poor', 7, 5, 'Petrol', 'Manual', 1.6, 100000, 90000, '2026-06-04', '2025-01-01', 'First', 1000, 7, '0', 15, 'Good', 'Good', 'Good', 1),
(619, 13, 'Car', 100000, 'Average', 1, 5, 'Petrol', 'Manual', 1.6, 100000, 90000, '2026-05-31', '2025-01-01', 'First', 1000, 1, '0', 15, 'Average', 'Worn Out', 'Weak', 1),
(620, 10, 'Truck', 1000200, 'Good', 8, 15, 'Petrol', 'Automatic', 200, 1000200, 990200, '2026-05-24', '2027-01-01', 'First', 1200, 8, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(621, 12, 'Van', 1500, 'Good', 7, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-05-21', '2027-01-01', 'First', 1200, 7, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(622, 13, 'Truck', 30000, 'Good', 1, 14, 'Petrol', 'Automatic', 3000, 30000, 20000, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(623, 20, 'Truck', 3432, 'Good', 0, 25, 'Petrol', 'Automatic', 234, 3432, 0, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(624, 26, 'Car', 232, 'Good', 2, 2, 'Petrol', 'Automatic', 1323, 232, 0, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(625, 27, 'Truck', 32443, 'Good', 2, 26, 'Petrol', 'Manual', 34324, 32443, 22443, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(626, 28, 'Truck', 21323, 'Good', 1, 26, 'Diesel', 'Manual', 233, 21323, 11323, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(627, 29, 'Truck', 20000, 'Good', 5, 0, 'Diesel', 'Automatic', 200, 20000, 10000, '2026-05-21', '2027-01-01', 'First', 1200, 5, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(628, 30, 'Truck', 8500, 'Good', 3, 0, 'Petrol', 'Manual', 1.5, 8500, 0, '2026-05-21', '2027-01-01', 'First', 1200, 3, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(629, 31, 'Van', 90000, 'Good', 1, 2, 'Petrol', 'Manual', 100, 90000, 80000, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(630, 32, 'Truck', 85000, 'Poor', 3, 1, 'Petrol', 'Manual', 1.5, 85000, 75000, '2026-05-21', '2027-01-01', 'First', 1200, 3, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(631, 33, 'Car', 100000, 'Good', 2, 2, 'Petrol', 'Manual', 1.3, 100000, 90000, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(632, 34, 'Truck', 100000, 'Good', 2, 1, 'Petrol', 'Manual', 1500, 100000, 90000, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(633, 35, 'Van', 230000, 'Poor', 7, 4, 'Petrol', 'Automatic', 1500, 230000, 220000, '2026-05-22', '2027-01-01', 'First', 1200, 7, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(634, 36, 'Car', 8500, 'Good', 0, 2, 'Diesel', 'Automatic', 1600, 8500, 0, '2024-07-07', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(635, 13, 'Car', 100000, 'Average', 1, 5, 'Petrol', 'Manual', 1.6, 100000, 90000, '2026-05-31', '2025-01-01', 'First', 1000, 1, '0', 15, 'Worn Out', 'Average', 'Weak', 1),
(636, 10, 'Truck', 1000200, 'Good', 8, 15, 'Petrol', 'Automatic', 200, 1000200, 990200, '2026-05-24', '2027-01-01', 'First', 1200, 8, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(637, 12, 'Van', 1500, 'Good', 7, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-05-21', '2027-01-01', 'First', 1200, 7, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(638, 13, 'Truck', 30000, 'Good', 1, 14, 'Petrol', 'Automatic', 3000, 30000, 20000, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(639, 20, 'Truck', 3432, 'Good', 0, 25, 'Petrol', 'Automatic', 234, 3432, 0, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(640, 26, 'Car', 232, 'Good', 2, 2, 'Petrol', 'Automatic', 1323, 232, 0, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(641, 27, 'Truck', 32443, 'Good', 2, 26, 'Petrol', 'Manual', 34324, 32443, 22443, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(642, 28, 'Truck', 21323, 'Good', 1, 26, 'Diesel', 'Manual', 233, 21323, 11323, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(643, 29, 'Truck', 20000, 'Good', 5, 0, 'Diesel', 'Automatic', 200, 20000, 10000, '2026-05-21', '2027-01-01', 'First', 1200, 5, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(644, 30, 'Truck', 8500, 'Good', 3, 0, 'Petrol', 'Manual', 1.5, 8500, 0, '2026-05-21', '2027-01-01', 'First', 1200, 3, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(645, 31, 'Van', 90000, 'Good', 1, 2, 'Petrol', 'Manual', 100, 90000, 80000, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(646, 32, 'Truck', 85000, 'Poor', 3, 1, 'Petrol', 'Manual', 1.5, 85000, 75000, '2026-05-21', '2027-01-01', 'First', 1200, 3, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(647, 33, 'Car', 100000, 'Good', 2, 2, 'Petrol', 'Manual', 1.3, 100000, 90000, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(648, 34, 'Truck', 100000, 'Good', 2, 1, 'Petrol', 'Manual', 1500, 100000, 90000, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(649, 35, 'Van', 230000, 'Poor', 7, 4, 'Petrol', 'Automatic', 1500, 230000, 220000, '2026-05-22', '2027-01-01', 'First', 1200, 7, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(650, 36, 'Car', 8500, 'Good', 0, 2, 'Diesel', 'Automatic', 1600, 8500, 0, '2024-07-07', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(651, 10, 'Truck', 1000200, 'Good', 8, 15, 'Petrol', 'Automatic', 200, 1000200, 990200, '2026-05-24', '2027-01-01', 'First', 1200, 8, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(652, 12, 'Van', 1500, 'Good', 7, 6, 'Diesel', 'Manual', 200, 1500, 0, '2026-05-21', '2027-01-01', 'First', 1200, 7, 'No', 15.5, 'Good', 'Good', 'Good', 1);
INSERT INTO `vehicle_data` (`id`, `vehicule_id`, `vehicle_model`, `mileage`, `maintenance_history`, `reported_issues`, `vehicle_age`, `fuel_type`, `transmission_type`, `engine_size`, `odometer_reading`, `last_service_mileage`, `last_service_date`, `warranty_expiry_date`, `owner_type`, `insurance_premium`, `service_history`, `accident_history`, `fuel_efficiency`, `tire_condition`, `brake_condition`, `battery_status`, `need_maintenance`) VALUES
(653, 13, 'Truck', 30000, 'Good', 1, 14, 'Petrol', 'Automatic', 3000, 30000, 20000, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(654, 20, 'Truck', 3432, 'Good', 0, 25, 'Petrol', 'Automatic', 234, 3432, 0, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(655, 26, 'Car', 232, 'Good', 2, 2, 'Petrol', 'Automatic', 1323, 232, 0, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(656, 27, 'Truck', 32443, 'Good', 2, 26, 'Petrol', 'Manual', 34324, 32443, 22443, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(657, 28, 'Truck', 21323, 'Good', 1, 26, 'Diesel', 'Manual', 233, 21323, 11323, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(658, 29, 'Truck', 20000, 'Good', 5, 0, 'Diesel', 'Automatic', 200, 20000, 10000, '2026-05-21', '2027-01-01', 'First', 1200, 5, 'No', 15.5, 'Good', 'Good', 'Good', 1),
(659, 30, 'Truck', 8500, 'Good', 3, 0, 'Petrol', 'Manual', 1.5, 8500, 0, '2026-05-21', '2027-01-01', 'First', 1200, 3, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(660, 31, 'Van', 90000, 'Good', 1, 2, 'Petrol', 'Manual', 100, 90000, 80000, '2026-05-21', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(661, 32, 'Truck', 85000, 'Poor', 3, 1, 'Petrol', 'Manual', 1.5, 85000, 75000, '2026-05-21', '2027-01-01', 'First', 1200, 3, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(662, 33, 'Car', 100000, 'Good', 2, 2, 'Petrol', 'Manual', 1.3, 100000, 90000, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(663, 34, 'Truck', 100000, 'Good', 2, 1, 'Petrol', 'Manual', 1500, 100000, 90000, '2026-05-21', '2027-01-01', 'First', 1200, 2, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(664, 35, 'Van', 230000, 'Poor', 7, 4, 'Petrol', 'Automatic', 1500, 230000, 220000, '2026-05-22', '2027-01-01', 'First', 1200, 7, 'No', 15.5, 'Worn Out', 'Needs Replacement', 'Weak', 1),
(665, 36, 'Car', 8500, 'Good', 0, 2, 'Diesel', 'Automatic', 1600, 8500, 0, '2024-07-07', '2027-01-01', 'First', 1200, 1, 'No', 15.5, 'Good', 'Good', 'Good', 0),
(666, 13, 'Car', 100000, 'Average', 1, 5, 'Petrol', 'Manual', 1.6, 100000, 90000, '2026-05-31', '2025-01-01', 'First', 1000, 1, '0', 15, 'Average', 'Average', 'Weak', 1);

-- --------------------------------------------------------

--
-- Structure de la table `vehicule`
--

CREATE TABLE `vehicule` (
  `id` bigint(20) NOT NULL,
  `immatriculation` varchar(50) NOT NULL,
  `marque` varchar(100) DEFAULT NULL,
  `modele` varchar(100) DEFAULT NULL,
  `annee` int(11) DEFAULT NULL,
  `kilometrage` double DEFAULT NULL,
  `carburant` varchar(50) DEFAULT NULL,
  `transmission` varchar(50) DEFAULT NULL,
  `engine_size` double DEFAULT NULL,
  `statut` varchar(50) DEFAULT NULL,
  `date_mise_service` datetime(6) DEFAULT NULL,
  `client_id` bigint(20) DEFAULT NULL,
  `adresse_proprietaire_carte_grise` varchar(255) DEFAULT NULL,
  `carte_grise_url` varchar(255) DEFAULT NULL,
  `categorie_carte_grise` varchar(255) DEFAULT NULL,
  `cin_proprietaire_carte_grise` varchar(255) DEFAULT NULL,
  `nom_proprietaire_carte_grise` varchar(255) DEFAULT NULL,
  `numero_carte_grise` varchar(255) DEFAULT NULL,
  `numero_chassis` varchar(255) DEFAULT NULL,
  `type_carte_grise` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `vehicule`
--

INSERT INTO `vehicule` (`id`, `immatriculation`, `marque`, `modele`, `annee`, `kilometrage`, `carburant`, `transmission`, `engine_size`, `statut`, `date_mise_service`, `client_id`, `adresse_proprietaire_carte_grise`, `carte_grise_url`, `categorie_carte_grise`, `cin_proprietaire_carte_grise`, `nom_proprietaire_carte_grise`, `numero_carte_grise`, `numero_chassis`, `type_carte_grise`) VALUES
(10, '17723', 'toyata', 'Truck', 2011, 1000200, 'Electric', 'Automatic', 200, 'ACTIVE', '2026-05-25 01:00:00.000000', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(12, '11123', 'SCANIA', 'Van', 2020, 1500, 'Diesel', 'Manual', 200, 'ACTIVE', '2026-05-22 01:00:00.000000', 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(13, '253754', 'SCANIA', 'Truck', 2012, 30000, 'Petrol', 'Automatic', 3000, 'ACTIVE', '2026-05-22 01:00:00.000000', 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(20, 'edf', 'dgf', 'Truck', 2001, 3432, 'Petrol', 'Automatic', 234, 'ACTIVE', '2026-05-22 01:00:00.000000', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(26, '12324', 'toyota', 'Car', 2024, 232, 'Petrol', 'Automatic', 1323, 'ACTIVE', '2026-05-22 01:00:00.000000', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(27, '235435', 'sad', 'Truck', 2000, 32443, 'Petrol', 'MANUELLE', 34324, 'ACTIVE', '2026-05-22 01:00:00.000000', 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(28, '124324', 'dasd', 'Truck', 2000, 21323, 'Diesel', 'MANUELLE', 233, 'ACTIVE', '2026-05-22 01:00:00.000000', 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(29, '1234567890', 'scania', 'Truck', 2026, 20000, 'Diesel', 'AUTOMATIQUE', 200, 'ACTIVE', '2026-05-22 01:00:00.000000', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(30, '173263', 'SCANIA', 'Truck', 2026, 8500, 'Petrol', 'MANUELLE', 1.5, 'ACTIVE', '2026-05-22 01:00:00.000000', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(31, '1234jjhdg', 'benz', 'Van', 2024, 90000, 'Petrol', 'MANUELLE', 100, 'ACTIVE', '2026-05-22 01:00:00.000000', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(32, '54654', 'FORD', 'Truck', 2025, 85000, 'Petrol', 'MANUELLE', 1.5, 'MAINTENANCE', '2026-05-22 01:00:00.000000', 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(33, '358794', 'renault', 'Car', 2024, 100000, 'Electric', 'MANUELLE', 1.3, 'ACTIVE', '2026-05-22 01:00:00.000000', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(34, '1983645', 'ford', 'Truck', 2025, 100000, 'Petrol', 'MANUELLE', 1500, 'ACTIVE', '2026-05-22 01:00:00.000000', 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(35, '1263548', 'scamia', 'Van', 2022, 230000, 'Petrol', 'Automatic', 1500, 'MAINTENANCE', '2026-05-22 03:05:53.000000', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(36, '124357465', 'ford', 'Car', 2024, 8500, 'Diesel', 'Automatic', 1600, 'ACTIVE', '2024-07-08 01:00:00.000000', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `achat`
--
ALTER TABLE `achat`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fournisseur_id` (`fournisseur_id`),
  ADD KEY `FKf3xgpms1xud3munr2udxuyuud` (`piece_id`);

--
-- Index pour la table `alerte`
--
ALTER TABLE `alerte`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `prediction_id` (`prediction_id`);

--
-- Index pour la table `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `devis`
--
ALTER TABLE `devis`
  ADD PRIMARY KEY (`id`),
  ADD KEY `intervention_id` (`intervention_id`);

--
-- Index pour la table `document`
--
ALTER TABLE `document`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vehicule_id` (`vehicule_id`);

--
-- Index pour la table `facture`
--
ALTER TABLE `facture`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `numero` (`numero`),
  ADD KEY `intervention_id` (`intervention_id`);

--
-- Index pour la table `fournisseur`
--
ALTER TABLE `fournisseur`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `intervention`
--
ALTER TABLE `intervention`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_skulikqgvcy6avmnh23pt06vj` (`numero_ordre_reparation`),
  ADD KEY `idx_intervention_vehicule` (`vehicule_id`),
  ADD KEY `fk_technicien` (`technicien_id`),
  ADD KEY `FKqsvbr9uyh0ckqqnft1v0js28l` (`intervention_id`);

--
-- Index pour la table `ligne_intervention_piece`
--
ALTER TABLE `ligne_intervention_piece`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_intervention_piece` (`intervention_id`,`piece_id`),
  ADD KEY `piece_id` (`piece_id`);

--
-- Index pour la table `ordre_reparation_besoins`
--
ALTER TABLE `ordre_reparation_besoins`
  ADD KEY `FKnf2a8g1ssqp3hk959sio1jkrj` (`intervention_id`);

--
-- Index pour la table `photo`
--
ALTER TABLE `photo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `intervention_id` (`intervention_id`);

--
-- Index pour la table `piece`
--
ALTER TABLE `piece`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fournisseur_id` (`fournisseur_id`);

--
-- Index pour la table `prediction_panne`
--
ALTER TABLE `prediction_panne`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `vehicle_data_id` (`vehicle_data_id`),
  ADD KEY `idx_prediction_vehicle_data` (`vehicle_data_id`);

--
-- Index pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `vehicle_data`
--
ALTER TABLE `vehicle_data`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_vehicle_data_vehicule` (`vehicule_id`);

--
-- Index pour la table `vehicule`
--
ALTER TABLE `vehicule`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `immatriculation` (`immatriculation`),
  ADD KEY `fk_vehicule_client` (`client_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `achat`
--
ALTER TABLE `achat`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT pour la table `alerte`
--
ALTER TABLE `alerte`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `client`
--
ALTER TABLE `client`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `devis`
--
ALTER TABLE `devis`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT pour la table `document`
--
ALTER TABLE `document`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `facture`
--
ALTER TABLE `facture`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT pour la table `fournisseur`
--
ALTER TABLE `fournisseur`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `intervention`
--
ALTER TABLE `intervention`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=85;

--
-- AUTO_INCREMENT pour la table `ligne_intervention_piece`
--
ALTER TABLE `ligne_intervention_piece`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=184;

--
-- AUTO_INCREMENT pour la table `photo`
--
ALTER TABLE `photo`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT pour la table `piece`
--
ALTER TABLE `piece`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT pour la table `prediction_panne`
--
ALTER TABLE `prediction_panne`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=636;

--
-- AUTO_INCREMENT pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT pour la table `vehicle_data`
--
ALTER TABLE `vehicle_data`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=667;

--
-- AUTO_INCREMENT pour la table `vehicule`
--
ALTER TABLE `vehicule`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `achat`
--
ALTER TABLE `achat`
  ADD CONSTRAINT `FKf3xgpms1xud3munr2udxuyuud` FOREIGN KEY (`piece_id`) REFERENCES `piece` (`id`),
  ADD CONSTRAINT `achat_ibfk_1` FOREIGN KEY (`fournisseur_id`) REFERENCES `fournisseur` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `alerte`
--
ALTER TABLE `alerte`
  ADD CONSTRAINT `alerte_ibfk_1` FOREIGN KEY (`prediction_id`) REFERENCES `prediction_panne` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `devis`
--
ALTER TABLE `devis`
  ADD CONSTRAINT `devis_ibfk_1` FOREIGN KEY (`intervention_id`) REFERENCES `intervention` (`id`);

--
-- Contraintes pour la table `document`
--
ALTER TABLE `document`
  ADD CONSTRAINT `document_ibfk_1` FOREIGN KEY (`vehicule_id`) REFERENCES `vehicule` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `facture`
--
ALTER TABLE `facture`
  ADD CONSTRAINT `facture_ibfk_1` FOREIGN KEY (`intervention_id`) REFERENCES `intervention` (`id`);

--
-- Contraintes pour la table `intervention`
--
ALTER TABLE `intervention`
  ADD CONSTRAINT `FKps6djh8xnqhrb6epvvjau4n0r` FOREIGN KEY (`technicien_id`) REFERENCES `utilisateur` (`id`),
  ADD CONSTRAINT `FKqsvbr9uyh0ckqqnft1v0js28l` FOREIGN KEY (`intervention_id`) REFERENCES `intervention` (`id`),
  ADD CONSTRAINT `fk_technicien` FOREIGN KEY (`technicien_id`) REFERENCES `utilisateur` (`id`),
  ADD CONSTRAINT `intervention_ibfk_1` FOREIGN KEY (`vehicule_id`) REFERENCES `vehicule` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `ligne_intervention_piece`
--
ALTER TABLE `ligne_intervention_piece`
  ADD CONSTRAINT `fk_intervention` FOREIGN KEY (`intervention_id`) REFERENCES `intervention` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `ligne_intervention_piece_ibfk_2` FOREIGN KEY (`piece_id`) REFERENCES `piece` (`id`);

--
-- Contraintes pour la table `ordre_reparation_besoins`
--
ALTER TABLE `ordre_reparation_besoins`
  ADD CONSTRAINT `FKnf2a8g1ssqp3hk959sio1jkrj` FOREIGN KEY (`intervention_id`) REFERENCES `intervention` (`id`);

--
-- Contraintes pour la table `photo`
--
ALTER TABLE `photo`
  ADD CONSTRAINT `photo_ibfk_1` FOREIGN KEY (`intervention_id`) REFERENCES `intervention` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `piece`
--
ALTER TABLE `piece`
  ADD CONSTRAINT `piece_ibfk_1` FOREIGN KEY (`fournisseur_id`) REFERENCES `fournisseur` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `prediction_panne`
--
ALTER TABLE `prediction_panne`
  ADD CONSTRAINT `prediction_panne_ibfk_1` FOREIGN KEY (`vehicle_data_id`) REFERENCES `vehicle_data` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `vehicle_data`
--
ALTER TABLE `vehicle_data`
  ADD CONSTRAINT `vehicle_data_ibfk_1` FOREIGN KEY (`vehicule_id`) REFERENCES `vehicule` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `vehicule`
--
ALTER TABLE `vehicule`
  ADD CONSTRAINT `fk_vehicule_client` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
