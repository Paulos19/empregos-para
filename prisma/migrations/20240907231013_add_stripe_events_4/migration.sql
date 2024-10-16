/*
  Warnings:

  - You are about to drop the column `chargeStatus` on the `Charge` table. All the data in the column will be lost.
  - Added the required column `status` to the `Charge` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Charge" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "stripeChargeId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Charge" ("amount", "createdAt", "id", "stripeChargeId", "updatedAt") SELECT "amount", "createdAt", "id", "stripeChargeId", "updatedAt" FROM "Charge";
DROP TABLE "Charge";
ALTER TABLE "new_Charge" RENAME TO "Charge";
CREATE UNIQUE INDEX "Charge_stripeChargeId_key" ON "Charge"("stripeChargeId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
