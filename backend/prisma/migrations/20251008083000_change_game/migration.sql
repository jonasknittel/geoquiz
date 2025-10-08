/*
  Warnings:

  - You are about to drop the `MouseMeasurements` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `startTime` on the `Game` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "MouseMeasurements";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "MouseCoordinates" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "gameId" INTEGER NOT NULL,
    "time" INTEGER NOT NULL,
    "lng" REAL NOT NULL,
    "lat" REAL NOT NULL,
    "click" BOOLEAN NOT NULL,
    CONSTRAINT "MouseCoordinates_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "mapId" INTEGER NOT NULL,
    "score" REAL NOT NULL,
    CONSTRAINT "Game_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Game_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "Map" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Game" ("id", "mapId", "score", "userId") SELECT "id", "mapId", "score", "userId" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
