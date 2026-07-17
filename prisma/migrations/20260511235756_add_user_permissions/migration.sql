/*
  Warnings:

  - You are about to drop the column `adminId` on the `Demande` table. All the data in the column will be lost.
  - Added the required column `codePostal` to the `Demande` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nom` to the `Demande` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rue` to the `Demande` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telephone` to the `Demande` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ville` to the `Demande` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Disponibilite" DROP CONSTRAINT "Disponibilite_trsId_fkey";

-- DropForeignKey
ALTER TABLE "Performance" DROP CONSTRAINT "Performance_trsId_fkey";

-- DropForeignKey
ALTER TABLE "TRS" DROP CONSTRAINT "TRS_ressourceId_fkey";

-- AlterTable
ALTER TABLE "Demande" DROP COLUMN "adminId",
ADD COLUMN     "codePostal" TEXT NOT NULL,
ADD COLUMN     "nom" TEXT NOT NULL,
ADD COLUMN     "rue" TEXT NOT NULL,
ADD COLUMN     "telephone" TEXT NOT NULL,
ADD COLUMN     "ville" TEXT NOT NULL,
ALTER COLUMN "statut" SET DEFAULT 'EN_ATTENTE';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "adminId" INTEGER;

-- CreateTable
CREATE TABLE "UserPermission" (
    "userId" INTEGER NOT NULL,
    "permissionId" INTEGER NOT NULL,

    CONSTRAINT "UserPermission_pkey" PRIMARY KEY ("userId","permissionId")
);

-- CreateTable
CREATE TABLE "Objectif" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "valeurCible" DOUBLE PRECISION NOT NULL,
    "dateDebut" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateFin" TIMESTAMP(3),
    "ressourceId" INTEGER NOT NULL,

    CONSTRAINT "Objectif_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TRS" ADD CONSTRAINT "TRS_ressourceId_fkey" FOREIGN KEY ("ressourceId") REFERENCES "Ressource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disponibilite" ADD CONSTRAINT "Disponibilite_trsId_fkey" FOREIGN KEY ("trsId") REFERENCES "TRS"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Performance" ADD CONSTRAINT "Performance_trsId_fkey" FOREIGN KEY ("trsId") REFERENCES "TRS"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Objectif" ADD CONSTRAINT "Objectif_ressourceId_fkey" FOREIGN KEY ("ressourceId") REFERENCES "Ressource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
