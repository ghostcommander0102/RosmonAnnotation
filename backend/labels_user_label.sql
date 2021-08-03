/*
 Navicat Premium Data Transfer

 Source Server         : db
 Source Server Type    : SQLite
 Source Server Version : 3030001
 Source Schema         : main

 Target Server Type    : SQLite
 Target Server Version : 3030001
 File Encoding         : 65001

 Date: 24/07/2021 02:22:12
*/

PRAGMA foreign_keys = false;

-- ----------------------------
-- Table structure for labels_user_label
-- ----------------------------
DROP TABLE IF EXISTS "labels_user_label";
CREATE TABLE "labels_user_label" (
  "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  "lebels_id" bigint NOT NULL,
  "user_id" integer NOT NULL,
  "video_id" bigint NOT NULL,
  "startPos" real NOT NULL,
  "endPos" real NOT NULL,
  "width" real NOT NULL,
  "height" real NOT NULL,
  "relativeLength" real NOT NULL,
  "type_id" bigint NOT NULL,
  "finish_flg" integer NOT NULL,
  FOREIGN KEY ("lebels_id") REFERENCES "labels_label" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY ("user_id") REFERENCES "auth_user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY ("video_id") REFERENCES "labels_video" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION DEFERRABLE INITIALLY DEFERRED,
  FOREIGN KEY ("type_id") REFERENCES "labels_label_types" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION DEFERRABLE INITIALLY DEFERRED
);

-- ----------------------------
-- Records of labels_user_label
-- ----------------------------
INSERT INTO "labels_user_label" VALUES (15, 11, 1, 2, 60.0, 112.0, 136.0, 0.0, 1332.0, 5, 0);
INSERT INTO "labels_user_label" VALUES (16, 13, 1, 2, 10.0, 904.0, 196.0, 0.0, 1332.0, 5, 0);

-- ----------------------------
-- Auto increment value for labels_user_label
-- ----------------------------
UPDATE "sqlite_sequence" SET seq = 17 WHERE name = 'labels_user_label';

-- ----------------------------
-- Indexes structure for table labels_user_label
-- ----------------------------
CREATE INDEX "labels_user_label_lebels_id_cf4ec8d0"
ON "labels_user_label" (
  "lebels_id" ASC
);
CREATE INDEX "labels_user_label_type_id_f77a694d"
ON "labels_user_label" (
  "type_id" ASC
);
CREATE INDEX "labels_user_label_user_id_bb274bae"
ON "labels_user_label" (
  "user_id" ASC
);
CREATE INDEX "labels_user_label_video_id_73873218"
ON "labels_user_label" (
  "video_id" ASC
);

PRAGMA foreign_keys = true;
