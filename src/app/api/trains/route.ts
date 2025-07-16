import { NextResponse } from "next/server";
import { PrismaClient, Direction, DayType, Departure } from "@prisma/client";
import * as holiday_jp from "@holiday-jp/holiday_jp";

const prisma = new PrismaClient();

async function getNextTrains(
  direction: Direction,
  dayType: DayType,
): Promise<Departure[]> {
  return prisma.$queryRaw<Departure[]>`
    SELECT
      "id",
      "direction",
      "dayType",
      "departure_time" AS "departureTime",
      "destination",
      "note"
    FROM "Departure"
    WHERE
      "direction" = ${direction}::"Direction"
      AND "dayType"   = ${dayType}::"DayType"
    ORDER BY
      CASE
        WHEN "departure_time"::time >= (NOW() AT TIME ZONE 'Asia/Tokyo')::time
        THEN
          EXTRACT(EPOCH FROM "departure_time"::time - (NOW() AT TIME ZONE 'Asia/Tokyo')::time)
        ELSE
          EXTRACT(EPOCH FROM "departure_time"::time - (NOW() AT TIME ZONE 'Asia/Tokyo')::time) + 86400
      END
    LIMIT 3;
  `;
}

export async function GET() {
  const now = new Date();
  const dayType = holiday_jp.isHoliday(now) ? "HOLIDAY" : "WEEKDAY";
  try {
    const upTrains = await getNextTrains(Direction.UP, dayType as DayType);
    const downTrains = await getNextTrains(Direction.DOWN, dayType as DayType);
    return NextResponse.json({ upTrains, downTrains });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to load trains" },
      { status: 500 },
    );
  }
}
