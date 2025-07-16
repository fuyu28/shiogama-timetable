import { NextResponse } from "next/server";
import { PrismaClient, Direction, DayType, Departure } from "@prisma/client";
import * as holiday_jp from "@holiday-jp/holiday_jp";

const prisma = new PrismaClient();

async function getNextTrains(
  direction: Direction,
  dayType: DayType,
): Promise<Departure[]> {
  return prisma.departure.findMany({
    where: { AND: { direction, dayType } },
  });
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
