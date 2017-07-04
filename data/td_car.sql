/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : td_car

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2017-03-16 19:05:12
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for approval
-- ----------------------------
DROP TABLE IF EXISTS `approval`;
CREATE TABLE `approval` (
  `id` int(32) NOT NULL AUTO_INCREMENT,
  `resid` varchar(255) NOT NULL,
  `operateDt` datetime DEFAULT NULL,
  `sequence` int(32) NOT NULL,
  `userid` varchar(255) NOT NULL,
  `result` int(32) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=205 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for car
-- ----------------------------
DROP TABLE IF EXISTS `car`;
CREATE TABLE `car` (
  `carid` int(8) NOT NULL AUTO_INCREMENT,
  `plateNumber` varchar(20) NOT NULL,
  `brand` varchar(20) NOT NULL,
  `imageSrc` varchar(2048) NOT NULL DEFAULT 'https://static.dingtalk.com/media/lALObKjV5M0Bo80Byw_459_419.png',
  `model` varchar(20) NOT NULL,
  `seating` int(11) NOT NULL,
  `level` varchar(20) NOT NULL,
  `gearbox` varchar(10) NOT NULL,
  `gasoline` int(11) NOT NULL,
  PRIMARY KEY (`carid`)
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for cc
-- ----------------------------
DROP TABLE IF EXISTS `cc`;
CREATE TABLE `cc` (
  `id` int(32) NOT NULL AUTO_INCREMENT,
  `resid` varchar(255) NOT NULL,
  `userid` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for reservation
-- ----------------------------
DROP TABLE IF EXISTS `reservation`;
CREATE TABLE `reservation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `resid` varchar(255) NOT NULL,
  `createDt` datetime NOT NULL,
  `applicant` varchar(255) NOT NULL,
  `car` varchar(255) NOT NULL,
  `usage` varchar(255) NOT NULL,
  `driver` varchar(255) NOT NULL,
  `accompanist` varchar(255) DEFAULT NULL,
  `startpoint` varchar(255) NOT NULL,
  `endpoint` varchar(255) NOT NULL,
  `schedule-start` datetime NOT NULL,
  `schedule-end` datetime NOT NULL,
  `remark` varchar(140) DEFAULT NULL,
  `status` int(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=186 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `emplId` varchar(1024) NOT NULL,
  `name` varchar(255) NOT NULL,
  `avatar` varchar(1024) DEFAULT NULL,
  `isAdmin` int(1) unsigned zerofill NOT NULL DEFAULT '0',
  `admin_level` int(1) unsigned zerofill DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
