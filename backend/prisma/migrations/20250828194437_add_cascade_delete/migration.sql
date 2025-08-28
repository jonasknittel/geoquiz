-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MouseMeasurements" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "gameId" INTEGER NOT NULL,
    "time" INTEGER NOT NULL,
    "xPosition" INTEGER NOT NULL,
    "yPosition" INTEGER NOT NULL,
    "click" BOOLEAN NOT NULL,
    CONSTRAINT "MouseMeasurements_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_MouseMeasurements" ("click", "gameId", "id", "time", "xPosition", "yPosition") SELECT "click", "gameId", "id", "time", "xPosition", "yPosition" FROM "MouseMeasurements";
DROP TABLE "MouseMeasurements";
ALTER TABLE "new_MouseMeasurements" RENAME TO "MouseMeasurements";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
