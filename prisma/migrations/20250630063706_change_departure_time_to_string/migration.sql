/*
  Warnings:

  - Changed the type of `departure_time` on the `Departure` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Departure" DROP COLUMN "departure_time",
ADD COLUMN     "departure_time" VARCHAR(5) NOT NULL;

-- CreateIndex
CREATE INDEX "Departure_dayType_direction_departure_time_idx" ON "Departure"("dayType", "direction", "departure_time");
