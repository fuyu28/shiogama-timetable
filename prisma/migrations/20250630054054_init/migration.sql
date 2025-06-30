-- CreateEnum
CREATE TYPE "Direction" AS ENUM ('UP', 'DOWN');

-- CreateEnum
CREATE TYPE "DayType" AS ENUM ('WEEKDAY', 'HOLIDAY');

-- CreateTable
CREATE TABLE "Departure" (
    "id" SERIAL NOT NULL,
    "direction" "Direction" NOT NULL,
    "dayType" "DayType" NOT NULL,
    "departure_time" TIMESTAMP(3) NOT NULL,
    "destination" TEXT NOT NULL,
    "note" TEXT,

    CONSTRAINT "Departure_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Departure_dayType_direction_departure_time_idx" ON "Departure"("dayType", "direction", "departure_time");
