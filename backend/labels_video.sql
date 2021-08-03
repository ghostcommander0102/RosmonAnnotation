/*
 Navicat Premium Data Transfer

 Source Server         : db
 Source Server Type    : SQLite
 Source Server Version : 3030001
 Source Schema         : main

 Target Server Type    : SQLite
 Target Server Version : 3030001
 File Encoding         : 65001

 Date: 24/07/2021 02:27:20
*/

PRAGMA foreign_keys = false;

-- ----------------------------
-- Table structure for labels_video
-- ----------------------------
DROP TABLE IF EXISTS "labels_video";
CREATE TABLE "labels_video" (
  "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  "caption" varchar(100) NOT NULL,
  "video" varchar(100) NOT NULL,
  "show_to_id" integer NOT NULL,
  FOREIGN KEY ("show_to_id") REFERENCES "auth_user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION DEFERRABLE INITIALLY DEFERRED
);

-- ----------------------------
-- Records of labels_video
-- ----------------------------
INSERT INTO "labels_video" VALUES (1, '123', 'video/21/bandicam_2021-07-20_20-53-06-214_2b304oG.mp4', 1);
INSERT INTO "labels_video" VALUES (2, '523', 'video/21/bandicam_2021-07-20_20-53-33-298_PHoyqId.mp4', 1);

-- ----------------------------
-- Auto increment value for labels_video
-- ----------------------------
UPDATE "sqlite_sequence" SET seq = 2 WHERE name = 'labels_video';

-- ----------------------------
-- Indexes structure for table labels_video
-- ----------------------------
CREATE INDEX "labels_video_show_to_id_9732d078"
ON "labels_video" (
  "show_to_id" ASC
);

PRAGMA foreign_keys = true;
