import { apiError } from "@/lib/api-error";
import { prisma } from "@/lib/prisma";
import { ErrorCode } from "@/types/api";
import { revalidatePath } from "next/cache";

/**
 * GET /demo/:demoKey/trips/:tripId/participants (참가자 조회)
 *
 * return Participants
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ demoKey: string; tripId: string }> },
) {
  const { demoKey, tripId } = await params;
  if (!demoKey || !tripId) return apiError(ErrorCode.BAD_REQUEST, 400);

  const participants = await prisma.participant.findMany({
    where: {
      trip: {
        demoKey,
      },
      tripId,
    },
  });

  return Response.json({ data: participants }, { status: 200 });
}

/**
 * POST /demo/:demoKey/trips/:tripId/participants (참가자 추가)
 *
 * return Participant
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ demoKey: string; tripId: string }> },
) {
  const { demoKey, tripId } = await params;
  if (!demoKey || !tripId) return apiError(ErrorCode.BAD_REQUEST, 400);

  const { name } = await request.json();

  if (typeof name !== "string" || !name.trim()) return apiError(ErrorCode.BAD_REQUEST, 400);

  //  SETTLED 상태인 경우 체크
  const currentTrip = await prisma.trip.findFirst({
    where: {
      demoKey,
      id: tripId,
    },
  });

  if (currentTrip?.status === "SETTLED") return apiError(ErrorCode.TRIP_ALREADY_SETTLED, 409);

  const res = await prisma.participant.create({
    data: {
      tripId,
      name,
    },
  });

  revalidatePath(`/demo/${demoKey}/trips/${tripId}`);
  return Response.json({ data: res }, { status: 201 });
}
