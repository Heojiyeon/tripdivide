import { apiError } from "@/lib/api-error";
import { prisma } from "@/lib/prisma";
import { ErrorCode } from "@/types/api";

/**
 * GET /demo/:demoKey/trips/:tripId (여행 상세 정보 조회)
 *
 * demoKey 파라미터
 * tripId 파라미터
 * return Trip 상세 정보
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ demoKey: string; tripId: string }> },
) {
  const { demoKey, tripId } = await params;
  if (!demoKey) return apiError(ErrorCode.BAD_REQUEST, 400);

  const trip = await prisma.trip.findFirst({
    where: {
      id: tripId,
      demoKey: demoKey,
    },
    include: {
      participants: true,
      expenses: true,
    },
  });

  if (!trip) {
    return apiError(ErrorCode.TRIP_NOT_FOUND, 404);
  }

  return Response.json({ trip });
}
