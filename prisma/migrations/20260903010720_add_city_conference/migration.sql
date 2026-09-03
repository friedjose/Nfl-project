/*
  Warnings:

  - Added the required column `city` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `conference` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Team" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "conference" TEXT NOT NULL,
    "image" TEXT NOT NULL
);
INSERT INTO "new_Team" ("id", "image", "name") SELECT "id", "image", "name" FROM "Team";
DROP TABLE "Team";
ALTER TABLE "new_Team" RENAME TO "Team";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
