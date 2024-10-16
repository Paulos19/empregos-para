/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Charge` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Charge` table. All the data in the column will be lost.
  - Made the column `receiptUrl` on table `Charge` required. This step will fail if there are existing NULL values in that column.
  - Made the column `stripeChargeId` on table `Charge` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Charge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "stripeChargeId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "receiptUrl" TEXT NOT NULL,
    "stripeCustomerId" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Charge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Charge" ("amount", "id", "receiptUrl", "status", "stripeChargeId", "userId") SELECT "amount", "id", "receiptUrl", "status", "stripeChargeId", "userId" FROM "Charge";
DROP TABLE "Charge";
ALTER TABLE "new_Charge" RENAME TO "Charge";
CREATE UNIQUE INDEX "Charge_stripeChargeId_key" ON "Charge"("stripeChargeId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
