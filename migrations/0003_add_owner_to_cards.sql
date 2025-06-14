-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CardSet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cards" JSONB NOT NULL,
    "ownerId" INTEGER NOT NULL,
    CONSTRAINT "CardSet_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CardSet" ("cards", "id") SELECT "cards", "id" FROM "CardSet";
DROP TABLE "CardSet";
ALTER TABLE "new_CardSet" RENAME TO "CardSet";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
