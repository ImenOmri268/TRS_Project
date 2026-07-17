-- CreateEnum
CREATE TYPE "ParameterCategory" AS ENUM ('DISPONIBILITE', 'PERFORMANCE', 'QUALITE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userRole" TEXT;

-- CreateTable
CREATE TABLE "ResourceParameter" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "category" "ParameterCategory" NOT NULL,
    "ressourceId" INTEGER NOT NULL,

    CONSTRAINT "ResourceParameter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyValue" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "value" DOUBLE PRECISION NOT NULL,
    "parameterId" INTEGER NOT NULL,

    CONSTRAINT "DailyValue_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ResourceParameter" ADD CONSTRAINT "ResourceParameter_ressourceId_fkey" FOREIGN KEY ("ressourceId") REFERENCES "Ressource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyValue" ADD CONSTRAINT "DailyValue_parameterId_fkey" FOREIGN KEY ("parameterId") REFERENCES "ResourceParameter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
