-- CreateTable
CREATE TABLE "DemoSession" (
    "demoKey" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Trip" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "demoKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Trip_demoKey_fkey" FOREIGN KEY ("demoKey") REFERENCES "DemoSession" ("demoKey") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Trip" ("createdAt", "demoKey", "id", "status", "title") SELECT "createdAt", "demoKey", "id", "status", "title" FROM "Trip";
DROP TABLE "Trip";
ALTER TABLE "new_Trip" RENAME TO "Trip";
CREATE INDEX "Trip_demoKey_idx" ON "Trip"("demoKey");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
