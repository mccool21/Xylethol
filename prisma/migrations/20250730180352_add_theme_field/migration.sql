-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_alerts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "is_active_from" DATETIME NOT NULL,
    "is_active_to" DATETIME NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'default',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "targeting_enabled" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_alerts" ("body", "created_at", "id", "is_active_from", "is_active_to", "is_enabled", "targeting_enabled", "title", "updated_at") SELECT "body", "created_at", "id", "is_active_from", "is_active_to", "is_enabled", "targeting_enabled", "title", "updated_at" FROM "alerts";
DROP TABLE "alerts";
ALTER TABLE "new_alerts" RENAME TO "alerts";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
