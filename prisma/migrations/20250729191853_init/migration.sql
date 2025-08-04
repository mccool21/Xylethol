-- CreateTable
CREATE TABLE "alerts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "is_active_from" DATETIME NOT NULL,
    "is_active_to" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "targeting_enabled" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "alert_segments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "alert_id" TEXT NOT NULL,
    "user_type" TEXT,
    "location" TEXT,
    "account_age" TEXT,
    "activity_level" TEXT,
    "plan_tier" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "alert_segments_alert_id_fkey" FOREIGN KEY ("alert_id") REFERENCES "alerts" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "user_type" TEXT,
    "location" TEXT,
    "account_age" TEXT,
    "activity_level" TEXT,
    "plan_tier" TEXT,
    "last_seen" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_user_id_key" ON "user_profiles"("user_id");
