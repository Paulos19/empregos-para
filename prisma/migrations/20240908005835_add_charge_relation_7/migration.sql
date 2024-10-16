/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Charge` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Charge" ADD COLUMN "userId" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "stripeSubscriptionStatus" TEXT,
    "stripePriceId" TEXT,
    "chargeId" TEXT,
    CONSTRAINT "User_chargeId_fkey" FOREIGN KEY ("chargeId") REFERENCES "Charge" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("chargeId", "email", "emailVerified", "id", "image", "name", "stripeCustomerId", "stripePriceId", "stripeSubscriptionId", "stripeSubscriptionStatus") SELECT "chargeId", "email", "emailVerified", "id", "image", "name", "stripeCustomerId", "stripePriceId", "stripeSubscriptionId", "stripeSubscriptionStatus" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");
CREATE UNIQUE INDEX "User_chargeId_key" ON "User"("chargeId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Charge_userId_key" ON "Charge"("userId");
