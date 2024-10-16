/*
  Warnings:

  - Added the required column `stripeChargeId` to the `PaymentIntent` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PaymentIntent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "stripeChargeId" TEXT NOT NULL,
    "stripePaymentIntentId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_PaymentIntent" ("amount", "createdAt", "id", "status", "stripePaymentIntentId", "updatedAt") SELECT "amount", "createdAt", "id", "status", "stripePaymentIntentId", "updatedAt" FROM "PaymentIntent";
DROP TABLE "PaymentIntent";
ALTER TABLE "new_PaymentIntent" RENAME TO "PaymentIntent";
CREATE UNIQUE INDEX "PaymentIntent_stripeChargeId_key" ON "PaymentIntent"("stripeChargeId");
CREATE UNIQUE INDEX "PaymentIntent_stripePaymentIntentId_key" ON "PaymentIntent"("stripePaymentIntentId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
