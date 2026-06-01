/*
  Warnings:

  - You are about to drop the column `workflowId` on the `Analyse` table. All the data in the column will be lost.
  - You are about to drop the column `ressourceId` on the `Workflow` table. All the data in the column will be lost.
  - The `statut` column on the `Workflow` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `ressourceId` to the `Analyse` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Analyse` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `nom` to the `Workflow` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valeurTrsGlobal` to the `Workflow` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Analyse" DROP CONSTRAINT "Analyse_workflowId_fkey";

-- DropForeignKey
ALTER TABLE "Objectif" DROP CONSTRAINT "Objectif_ressourceId_fkey";

-- DropForeignKey
ALTER TABLE "PlanAction" DROP CONSTRAINT "PlanAction_workflowId_fkey";

-- DropForeignKey
ALTER TABLE "Qualite" DROP CONSTRAINT "Qualite_trsId_fkey";

-- DropForeignKey
ALTER TABLE "Workflow" DROP CONSTRAINT "Workflow_ressourceId_fkey";

-- AlterTable
ALTER TABLE "Analyse" DROP COLUMN "workflowId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ressourceId" INTEGER NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER COLUMN "dateDebut" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Ressource" ADD COLUMN     "initialDisponibilite" DOUBLE PRECISION,
ADD COLUMN     "initialPerformance" DOUBLE PRECISION,
ADD COLUMN     "initialQualite" DOUBLE PRECISION,
ADD COLUMN     "initialTRS" DOUBLE PRECISION,

-- AlterTable
ALTER TABLE "Workflow" DROP COLUMN "ressourceId",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "nom" TEXT NOT NULL,
ADD COLUMN     "valeurTrsGlobal" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "dateDebut" SET DEFAULT CURRENT_TIMESTAMP,


-- CreateTable
CREATE TABLE "CalculatedMetric" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" "ParameterCategory" NOT NULL,
    "valeur" DOUBLE PRECISION NOT NULL,
    "ressourceId" INTEGER NOT NULL,

    CONSTRAINT "CalculatedMetric_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CalculatedMetric" ADD CONSTRAINT "CalculatedMetric_ressourceId_fkey" FOREIGN KEY ("ressourceId") REFERENCES "Ressource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Qualite" ADD CONSTRAINT "Qualite_trsId_fkey" FOREIGN KEY ("trsId") REFERENCES "TRS"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Analyse" ADD CONSTRAINT "Analyse_ressourceId_fkey" FOREIGN KEY ("ressourceId") REFERENCES "Ressource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanAction" ADD CONSTRAINT "PlanAction_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Objectif" ADD CONSTRAINT "Objectif_ressourceId_fkey" FOREIGN KEY ("ressourceId") REFERENCES "Ressource"("id") ON DELETE CASCADE ON UPDATE CASCADE;
