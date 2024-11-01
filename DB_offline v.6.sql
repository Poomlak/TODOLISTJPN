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
  `diary_id` int NOT NULL AUTO_INCREMENT,
  `diary_namebook` varchar(45) NOT NULL,
  `diary_todoTopic` varchar(2555) NOT NULL,
  `diary_todo` varchar(2555) NOT NULL,
  `diary_reminder` varchar(45) NOT NULL,
  `diary_created` varchar(45) NOT NULL,
  `diary_color` varchar(255) NOT NULL,
  `diary_textColor` varchar(45) DEFAULT NULL,
  `diary_username` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`diary_id`)
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `diary_list`
--

LOCK TABLES `diary_list` WRITE;
/*!40000 ALTER TABLE `diary_list` DISABLE KEYS */;
INSERT INTO `diary_list` VALUES (6,'test','valorant1','เล่น valo กับเพื่อน','30/09/2024, 23:42:00','สร้างตอนไหน','#000000','white',NULL),(20,'donut','ไปคอนโดไทเก้อ','หาไทเก้อ','23/10/2024, 21:03:00','22/10/2024, 15:55:54','#f584b5','',NULL),(21,'donut','เเ','เเ','09/10/2024, 17:56:00','22/10/2024, 15:56:44','#000000','',NULL),(41,'test','gg','gg','30/09/2024, 17:01:00','29/10/2024, 16:02:04','#000000','white',NULL),(42,'test','sasdasxxxx','asdasdxxxx','11/10/2024, 16:03:00','29/10/2024, 16:02:45','#000000','white',NULL),(43,'test','เเเ','เเเ','02/10/2024, 18:04:00','29/10/2024, 16:04:48','#000000','white',NULL),(44,'test','gg','ด','02/10/2024, 19:05:00','29/10/2024, 16:05:41','#000000','white',NULL),(45,'test','sdasdasd','asdasdasd','01/10/2024, 19:07:00','29/10/2024, 16:07:11','#000000','white',NULL),(46,'test','laset test','asdasd','17/10/2024, 16:09:00','29/10/2024, 16:07:33','#000000','white',NULL),(47,'test','หดฟหดxxxxxx111','ฟหดฟหดxxxx111','05/10/2024, 16:09:00','29/10/2024, 16:09:22','#000000','white',NULL),(48,'่่่ด','gg','gg','16/10/2024, 18:22:00','29/10/2024, 16:22:52','#000000','white',NULL),(49,'่่่ด','g','g','09/10/2024, 19:23:00','29/10/2024, 16:23:32','#000000','white',NULL),(51,'test','testหี','xxx','2024-10-17T12:29:00.000Z','29/10/2024, 16:29:53','#ff0000','white',NULL),(52,'test','xxx','xxx','2024-10-09T09:33:00.000Z','29/10/2024, 16:30:23','#000000','white',NULL),(53,'test','หกหกหกหี','หกหกหกห','15/10/2024, 16:33:00','29/10/2024, 16:33:15','#000000','white',NULL),(63,'d','เทส2 ','#@!#@#@!#!#@!','17/08/2024, 23:11:00','01/11/2024, 13:44:48','#e4b4b4','black',NULL),(64,'d','เท3','ๅ/-ๅ/-/ๅ-/ๅ-/ๅ-/ๅ-/ๅ-/ๅ-/ๅ-/ๅ-/ๅ-/ๅ-/ๅ','07/11/2024, 14:48:00','01/11/2024, 13:47:25','#000000','white',NULL),(73,'Dairy Todo2','fdf','dfdf','30/10/2024, 18:55:00','01/11/2024, 14:55:41','#000000','white',NULL),(75,'Dairy Todo2','ds','ds','28/10/2024, 16:58:00','01/11/2024, 14:58:51','#471f1f','white',NULL),(77,'Dairy Todo2','หก','หก','06/11/2024, 16:24:00','01/11/2024, 15:25:02','#000000','white','admin'),(78,'Dairy Todo2','เจ็ด','1321321321','02/11/2024, 16:29:00','01/11/2024, 15:28:56','#000000','white','test2'),(79,'Dairy Todo2','fff','ffff','06/11/2024, 17:29:00','01/11/2024, 15:29:33','#000000','white','admin'),(80,'Dairy Poom','แปด','เทสระบบ123456789','06/11/2024, 20:35:00','01/11/2024, 15:31:14','#6eb1cf','black','test2'),(81,'Dairy Todo2','sdsa','asdasd','29/10/2024, 16:32:00','01/11/2024, 15:32:15','#000000','white','admin'),(82,'Dairy Poom','เจ็ด','เทสระบบ123456789','14/11/2024, 16:40:00','01/11/2024, 15:35:19','#92dd36','black','test2'),(83,'Dairy Todo2','เทส2 ','เทสระบบ123456789','08/11/2024, 17:40:00','01/11/2024, 15:35:55','#000000','white','test2'),(84,'Dairy Todo2','asd','asd','06/11/2024, 18:41:00','01/11/2024, 15:41:06','#000000','white','admin'),(85,'Dairy Poom','เจ็ด','1321321321','01/11/2024, 17:50:00','01/11/2024, 15:47:02','#f7db4a','black','test2');
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
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_diary`
--

LOCK TABLES `member_diary` WRITE;
/*!40000 ALTER TABLE `member_diary` DISABLE KEYS */;
INSERT INTO `member_diary` VALUES (19,'admindonut','donut','2024-10-22 15:54:55','2024-10-22 15:56:21'),(21,'admin','่่่กกก','2024-10-29 00:01:15','2024-10-29 00:01:15'),(26,'admin','d','2024-10-29 16:25:06','2024-10-29 16:25:06'),(37,'test1','Dairy Todo2','2024-11-01 14:09:46','2024-11-01 14:13:54'),(39,'test2','Dairy Todo2','2024-11-01 14:39:39','2024-11-01 15:36:04'),(40,'admin','Dairy Todo2','2024-11-01 14:40:39','2024-11-01 15:41:08'),(41,'test2','Dairy Poom','2024-11-01 14:56:33','2024-11-01 15:47:54');
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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_id`
--

LOCK TABLES `member_id` WRITE;
/*!40000 ALTER TABLE `member_id` DISABLE KEYS */;
INSERT INTO `member_id` VALUES (1,'Patcharapon','Kajornklin','2002-05-30','patcharaphol.pp@gmail.com','0882086897','admin','$2b$10$VzdOwO1xvuL2fBTlr4KzLOKtlEAGYxvBCzGGlLD5Koki.0WMcGKwC','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxiVGxWbteERBoEU52oMP0lRF9GGPa3zAg8A&s'),(2,'jame','xxx','123213213-12321321-12321312','patcharaphol.pp@gmail.com1','323123','test1','$2b$10$VzmlbPHB6PffFfDy71zZK.NhwwmM0k/hOQ4R6borCULSVdt1vcHVy','https://img2.pic.in.th/pic/b9cfef973c9eff705e1a6a1f3e9feb41.jpg'),(3,'ห','s','2002-02-22','patcharaphol.pp@gmail.com111','23','s','$2b$10$rvfY823OX84Bh4xkL2rZG.Wo9rFsm4RuK4GghhZhyS.2DDWqyw.Yy',NULL),(4,'1','1','2002-02-22','tvmych3030@gmail.com1','1','1','$2b$10$KYphPOuLCcWaNNT/NOkzLueyHiglVr18R.1qz/uYF8lPovz38vnbe',NULL),(5,'s','s','2002-02-02','patcharaphol.pp@gmail.com11','1ๅ','ss','$2b$10$UbWJ7v19v2k9Ysy0OjjFFuO19flaIOUgzYGfuxMQmwu02eOsSW6Xe',NULL),(6,'1','3213','2002-02-22','patcharaphol.pp@gmail.com11111','08820868971','1231','$2b$10$LtrvDdXApVH2KJ2ZxvsLPuXDNxTGMPrOwTgew5YcPBJ0juwy500W.',NULL),(7,'Poom','lak','2024-12-31','poomlak.p@ku.th','099','test2','$2b$10$U8BKguonp8eR88.3zFIdcepTc.GnpmUmdXlknBX2oTyMXzlpk/8xu','https://img2.pic.in.th/pic/b9cfef973c9eff705e1a6a1f3e9feb41.jpg'),(8,'tiger','eiei','2003-01-31','kannipit.p@ku.th','062','admintiger','$2b$10$/SlV2cccUeuH3n3bDWuQ2OmOMgQvPczD4WWppH3Dyk9JryMs6p/By','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjm_jZPEMlb7L5f53jcyc95kBwbB1Bd62EMA&s'),(9,'donut','wiphawee','2003-09-17','wiphawee.la@ku.th','xxx','admindonut','$2b$10$G9ECJKjLkAovkEh.qOUaNuPlT/CGEbv433zU7ZNuL0Dv9JW0gKEya','https://sugargeekshow.com/wp-content/uploads/2020/10/baked_donut_recipe_featured.jpg'),(10,'dsad','asdasd','2024-10-16','tvmych30301111@gmail.com','adminnew00000','admin1','$2b$10$xGzRMEzeQb/HXOFMqvXTHePiOz0uMZaQen2vvKlr3.XwDBksLY/T6',NULL),(11,'jameeee','jameeee','2024-10-02','patcharaphol.pp@gmail.com12','323123122','we','$2b$10$FaJu/8ZfnDBkLe82NfKkruZ1UyvAd9s05dLxfMB53hPwX9RUew4nW',NULL),(12,'qwer','asdf','2024-11-01','test@hotmail.com','1111111111','zxc','$2b$10$v3zOZMkbVh5pFm2a5P0e2.GXW0Es5vKDukoN5kljuYIE9pkbaWloO',NULL);
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
INSERT INTO `otp_table` VALUES ('kannipit.p@ku.th','871088','2024-10-21 05:50:22'),('patcharaphol.pp@gmail.com','933920','2024-10-18 08:02:43'),('patcharaphol.pp@gmail.com1','592265','2024-11-01 06:15:59'),('poomlak.p@ku.th','163378','2024-10-18 08:04:15'),('sadsa@tera.com','310211','2024-10-18 08:03:39'),('tvmych3030@gmail.com','422553','2024-10-18 10:32:12'),('wiphawee.la@ku.th','317289','2024-10-22 08:52:51');
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

-- Dump completed on 2024-11-01 16:18:57
