/*
  Warnings:

  - You are about to drop the column `userId` on the `Charge` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Charge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "stripeChargeId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "receiptUrl" TEXT,
    "stripeCustomerId" TEXT
);
INSERT INTO "new_Charge" ("amount", "id", "receiptUrl", "status", "stripeChargeId", "stripeCustomerId") SELECT "amount", "id", "receiptUrl", "status", "stripeChargeId", "stripeCustomerId" FROM "Charge";
DROP TABLE "Charge";
ALTER TABLE "new_Charge" RENAME TO "Charge";
CREATE UNIQUE INDEX "Charge_stripeChargeId_key" ON "Charge"("stripeChargeId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
