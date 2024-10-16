/*
  Warnings:

  - The primary key for the `Charge` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `receiptUrl` on the `Charge` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `Charge` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `updatedAt` to the `Charge` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "PaymentIntent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "stripePaymentIntentId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CheckoutSession" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "stripeSessionId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "amountTotal" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

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
INSERT INTO "new_Charge" ("amount", "id", "status", "stripeChargeId") SELECT "amount", "id", "status", "stripeChargeId" FROM "Charge";
DROP TABLE "Charge";
ALTER TABLE "new_Charge" RENAME TO "Charge";
CREATE UNIQUE INDEX "Charge_stripeChargeId_key" ON "Charge"("stripeChargeId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "PaymentIntent_stripePaymentIntentId_key" ON "PaymentIntent"("stripePaymentIntentId");

-- CreateIndex
CREATE UNIQUE INDEX "CheckoutSession_stripeSessionId_key" ON "CheckoutSession"("stripeSessionId");
