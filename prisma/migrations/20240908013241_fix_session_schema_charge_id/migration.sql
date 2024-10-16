/*
  Warnings:

  - You are about to drop the column `sessionId` on the `Charge` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Charge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "stripeChargeId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "userId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Charge" ("amount", "createdAt", "id", "status", "stripeChargeId", "updatedAt", "userId") SELECT "amount", "createdAt", "id", "status", "stripeChargeId", "updatedAt", "userId" FROM "Charge";
DROP TABLE "Charge";
ALTER TABLE "new_Charge" RENAME TO "Charge";
CREATE UNIQUE INDEX "Charge_stripeChargeId_key" ON "Charge"("stripeChargeId");
CREATE UNIQUE INDEX "Charge_userId_key" ON "Charge"("userId");
CREATE TABLE "new_Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    "chargeId" TEXT,
    CONSTRAINT "Session_chargeId_fkey" FOREIGN KEY ("chargeId") REFERENCES "Charge" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Session" ("expires", "id", "sessionToken", "userId") SELECT "expires", "id", "sessionToken", "userId" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "emailVerified" DATETIME,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "stripeSubscriptionStatus" TEXT,
    "stripePriceId" TEXT,
    "hasDownloaded" BOOLEAN NOT NULL DEFAULT false,
    "chargeId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_chargeId_fkey" FOREIGN KEY ("chargeId") REFERENCES "Charge" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("chargeId", "email", "emailVerified", "hasDownloaded", "id", "stripeCustomerId", "stripePriceId", "stripeSubscriptionId", "stripeSubscriptionStatus") SELECT "chargeId", "email", "emailVerified", "hasDownloaded", "id", "stripeCustomerId", "stripePriceId", "stripeSubscriptionId", "stripeSubscriptionStatus" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_chargeId_key" ON "User"("chargeId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
