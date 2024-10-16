/*
  Warnings:

  - The primary key for the `Charge` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Charge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "stripeChargeId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Charge" ("amount", "createdAt", "id", "status", "stripeChargeId", "updatedAt") SELECT "amount", "createdAt", "id", "status", "stripeChargeId", "updatedAt" FROM "Charge";
DROP TABLE "Charge";
ALTER TABLE "new_Charge" RENAME TO "Charge";
CREATE UNIQUE INDEX "Charge_stripeChargeId_key" ON "Charge"("stripeChargeId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
