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

  if (!name || typeof name !== "string" || !name.trim())
    return apiError(ErrorCode.BAD_REQUEST, 400);

  // 1. trip 존재 검증 및 SETTLED 상태인 경우 체크
  const currentTrip = await prisma.trip.findFirst({
    where: {
      demoKey,
      id: tripId,
    },
  });
  if (!currentTrip) return apiError(ErrorCode.TRIP_NOT_FOUND, 404);
  if (currentTrip.status === "SETTLED") return apiError(ErrorCode.TRIP_ALREADY_SETTLED, 409);

  // 2. 참여자 중복 확인
  const isAlreadyExistedParticipant = await prisma.participant.findUnique({
    where: {
      name_tripId: {
        tripId,
        name: name.trim(),
      },
    },
  });
  if (isAlreadyExistedParticipant) return apiError(ErrorCode.PARTICIPANT_ALREADY_EXISTED, 409);

  // 3. 참여자 생성
  const res = await prisma.participant.create({
    data: {
      tripId,
      name: name.trim(),
    },
  });

  revalidatePath(`/demo/${demoKey}/trips/${tripId}`);
  return Response.json({ data: res }, { status: 201 });
}

/**
 * DELETE /demo/:demoKey/trips/:trip/participants/:participantId (참여자 삭제)
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ demoKey: string; tripId: string; participantId: string }> },
) {
  // 1. 참여자 유효성 체크
  const { demoKey, tripId, participantId } = await params;

  if (!demoKey || !tripId || !participantId) {
    return apiError(ErrorCode.BAD_REQUEST, 400);
  }

  const existingParticipant = await prisma.participant.findFirst({
    where: {
      id: participantId,
      tripId,
    },
  });

  if (!existingParticipant) return apiError(ErrorCode.PARTICIPANT_NOT_FOUND, 404);

  // 2. 정산 참여자로 등록 되어 있는지 체크
  const linkedExpense = await prisma.expense.findFirst({
    where: {
      tripId,
      trip: {
        demoKey,
      },
      OR: [
        { paidById: participantId },
        {
          splits: {
            some: {
              participantId,
            },
          },
        },
      ],
    },
    select: { id: true },
  });

  if (linkedExpense) return apiError(ErrorCode.PARTICIPANT_HAS_EXPENSE_HISTORY, 409);

  await prisma.participant.delete({
    where: {
      id: participantId,
      tripId,
      trip: {
        demoKey,
      },
    },
  });
  return new Response(null, { status: 204 });
}
