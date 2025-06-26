/*
  Warnings:

  - You are about to drop the column `roomSlug` on the `Shape` table. All the data in the column will be lost.
  - Added the required column `roomId` to the `Shape` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Shape" DROP CONSTRAINT "Shape_roomSlug_fkey";

-- AlterTable
ALTER TABLE "Shape" DROP COLUMN "roomSlug",
ADD COLUMN     "roomId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Shape" ADD CONSTRAINT "Shape_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
