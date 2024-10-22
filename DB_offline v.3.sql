-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: jpn-project
-- ------------------------------------------------------
-- Server version	9.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `diary_list`
--

DROP TABLE IF EXISTS `diary_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `diary_list` (
  `diary_id` varchar(45) NOT NULL,
  `diary_namebook` varchar(45) NOT NULL,
  `diary_todoTopic` varchar(2555) NOT NULL,
  `diary_todo` varchar(2555) NOT NULL,
  `diary_reminder` varchar(45) NOT NULL,
  `diary_created` varchar(45) NOT NULL,
  PRIMARY KEY (`diary_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `diary_list`
--

LOCK TABLES `diary_list` WRITE;
/*!40000 ALTER TABLE `diary_list` DISABLE KEYS */;
INSERT INTO `diary_list` VALUES ('0','poom','valorant','เล่น valo กับเพื่อน','เตือนว่าจะเล่นวันไหน','สร้างตอนไหน'),('1','test','cs','เล่น cs กับเพื่อน','เตือนว่าจะเล่นวันไหน','สร้างตอนไหน'),('2','test','xshot','เล่น xshot กับเพื่อน','เตือนว่าจะเล่นวันไหน','สร้างตอนไหน'),('3','poom','pb','เล่น pb กับเพื่อน','เตือนว่าจะเล่นวันไหน','สร้างตอนไหน');
/*!40000 ALTER TABLE `diary_list` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_diary`
--

DROP TABLE IF EXISTS `member_diary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member_diary` (
  `diary_no` int NOT NULL AUTO_INCREMENT,
  `diary_username` varchar(45) NOT NULL,
  `diary_namebook` varchar(45) NOT NULL,
  `member_createdbook` varchar(30) DEFAULT NULL,
  `member_lastupdatedbook` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`diary_no`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_diary`
--

LOCK TABLES `member_diary` WRITE;
/*!40000 ALTER TABLE `member_diary` DISABLE KEYS */;
INSERT INTO `member_diary` VALUES (8,'test2','poom1','2024-10-21 18:08:30','2024-10-21 23:13:29'),(10,'admin','้ำสสน tersdt','2024-10-21 20:44:43','2024-10-21 22:52:42'),(11,'admin','test','2024-10-21 20:45:09','2024-10-21 22:52:42'),(16,'test2','123','2024-10-21 22:10:45','2024-10-21 22:26:59');
/*!40000 ALTER TABLE `member_diary` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_id`
--

DROP TABLE IF EXISTS `member_id`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member_id` (
  `member_id` int NOT NULL AUTO_INCREMENT,
  `member_fname` varchar(45) NOT NULL,
  `member_lname` varchar(45) NOT NULL,
  `member_birthday` varchar(45) NOT NULL,
  `member_email` varchar(45) NOT NULL,
  `member_tel` varchar(45) NOT NULL,
  `member_username` varchar(45) NOT NULL,
  `member_password` varchar(500) NOT NULL,
  `member_image_url` longtext,
  PRIMARY KEY (`member_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_id`
--

LOCK TABLES `member_id` WRITE;
/*!40000 ALTER TABLE `member_id` DISABLE KEYS */;
INSERT INTO `member_id` VALUES (1,'Patcharapon','Kajornklin','2002-05-30','patcharaphol.pp@gmail.com','0882086897','admin','$2b$10$mez01rB27yo4jPOjTvKDs.QVK2ca06c78orpOksGoDzu74QRHKQyi','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxiVGxWbteERBoEU52oMP0lRF9GGPa3zAg8A&s'),(2,'jame','xxx','2002-12-31','patcharaphol.pp@gmail.com1','323123','test1','$2b$10$ZTgq4Qm/ms9PF4y0ZvjZw.1B/CeoHAOeJ2FHTA3hzgdU7u9.EkZkK',NULL),(3,'ห','s','2002-02-22','patcharaphol.pp@gmail.com111','23','s','$2b$10$rvfY823OX84Bh4xkL2rZG.Wo9rFsm4RuK4GghhZhyS.2DDWqyw.Yy',NULL),(4,'1','1','2002-02-22','tvmych3030@gmail.com1','1','1','$2b$10$KYphPOuLCcWaNNT/NOkzLueyHiglVr18R.1qz/uYF8lPovz38vnbe',NULL),(5,'s','s','2002-02-02','patcharaphol.pp@gmail.com11','1ๅ','ss','$2b$10$UbWJ7v19v2k9Ysy0OjjFFuO19flaIOUgzYGfuxMQmwu02eOsSW6Xe',NULL),(6,'1','3213','2002-02-22','patcharaphol.pp@gmail.com11111','08820868971','1231','$2b$10$LtrvDdXApVH2KJ2ZxvsLPuXDNxTGMPrOwTgew5YcPBJ0juwy500W.',NULL),(7,'Poom','lak','2024-12-31','poomlak.p@ku.th','099','test2','$2b$10$U8BKguonp8eR88.3zFIdcepTc.GnpmUmdXlknBX2oTyMXzlpk/8xu','https://m.media-amazon.com/images/M/MV5BMjMyOTM4MDMxNV5BMl5BanBnXkFtZTcwNjIyNzExOA@@._V1_FMjpg_UX1000_.jpg'),(8,'tiger','eiei','2003-01-31','kannipit.p@ku.th','062','admintiger','$2b$10$/SlV2cccUeuH3n3bDWuQ2OmOMgQvPczD4WWppH3Dyk9JryMs6p/By','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjm_jZPEMlb7L5f53jcyc95kBwbB1Bd62EMA&s');
/*!40000 ALTER TABLE `member_id` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `otp_table`
--

DROP TABLE IF EXISTS `otp_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `otp_table` (
  `email` varchar(255) NOT NULL,
  `otp` varchar(6) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otp_table`
--

LOCK TABLES `otp_table` WRITE;
/*!40000 ALTER TABLE `otp_table` DISABLE KEYS */;
INSERT INTO `otp_table` VALUES ('kannipit.p@ku.th','871088','2024-10-21 05:50:22'),('patcharaphol.pp@gmail.com','742916','2024-10-18 08:02:43'),('poomlak.p@ku.th','277396','2024-10-18 08:04:15'),('sadsa@tera.com','310211','2024-10-18 08:03:39'),('tvmych3030@gmail.com','422553','2024-10-18 10:32:12');
/*!40000 ALTER TABLE `otp_table` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-22 10:37:45
