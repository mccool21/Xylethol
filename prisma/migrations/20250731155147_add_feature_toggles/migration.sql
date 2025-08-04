-- CreateTable
CREATE TABLE "feature_toggles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "description" TEXT,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "environment" TEXT NOT NULL DEFAULT 'all',
    "rollout_percentage" INTEGER NOT NULL DEFAULT 100,
    "is_active_from" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active_to" DATETIME NOT NULL DEFAULT '2099-12-31 23:59:59.999 +00:00',
    "targeting_enabled" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "created_by" TEXT
);

-- CreateTable
CREATE TABLE "feature_segments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "feature_id" TEXT NOT NULL,
    "user_type" TEXT,
    "location" TEXT,
    "account_age" TEXT,
    "activity_level" TEXT,
    "plan_tier" TEXT,
    "target_page" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "feature_segments_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "feature_toggles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "feature_toggles_name_key" ON "feature_toggles"("name");
