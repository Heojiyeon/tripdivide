import { apiError } from "@/lib/api-error";
import { prisma } from "@/lib/prisma";
import { ErrorCode } from "@/types/api";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /demo/:demoKey/trips/:tripId/expenses (지출 추가)
 * returns splits
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ demoKey: string; tripId: string }> },
) {
  // 1. 타입 체크 및 참여자 검증
  const { demoKey, tripId } = await params;
  if (!demoKey || !tripId) return apiError(ErrorCode.BAD_REQUEST, 400);

  const { title, amount, paidById, splits } = await request.json();

  if (
    typeof title !== "string" ||
    !title.trim() ||
    typeof amount !== "number" ||
    !Number.isFinite(amount) ||
    amount <= 0 ||
    typeof paidById !== "string" ||
    !paidById.trim()
  ) {
    return apiError(ErrorCode.BAD_REQUEST, 400);
  }

  if (!Array.isArray(splits) || splits.length === 0) return apiError(ErrorCode.BAD_REQUEST, 400);

  for (const split of splits) {
    if (
      !split ||
      typeof split.participantId !== "string" ||
      !split.participantId.trim() ||
      typeof split.shareAmount !== "number" ||
      !Number.isFinite(split.shareAmount) ||
      split.shareAmount < 0
    ) {
      return apiError(ErrorCode.BAD_REQUEST, 400);
    }
  }

  // 1. trip 존재 검증 및 SETTLED 상태 검증
  const currentTrip = await prisma.trip.findFirst({
    where: {
      demoKey,
      id: tripId,
    },
  });

  if (!currentTrip) return apiError(ErrorCode.TRIP_NOT_FOUND, 404);
  if (currentTrip.status === "SETTLED") return apiError(ErrorCode.TRIP_ALREADY_SETTLED, 409);

  // 2. 정산 참여자 검증
  const participantIds = [...new Set(splits.map((split) => split.participantId))];
  const validParticipants = await prisma.participant.findMany({
    where: {
      tripId,
      id: { in: participantIds },
    },
    select: { id: true },
  });

  if (participantIds.length !== validParticipants.length)
    return apiError(ErrorCode.PARTICIPANT_NOT_FOUND, 404);

  // 3. 결제자 검증
  const participant = await prisma.participant.findFirst({
    where: { id: paidById, tripId },
  });

  if (!participant) return apiError(ErrorCode.PARTICIPANT_NOT_FOUND, 404);

  // 4. 정합성 체크
  const total = splits.reduce((sum, s) => sum + s.shareAmount, 0);
  if (total !== amount) {
    return apiError(ErrorCode.INVALID_SPLIT_SUM, 400);
  }

  // 5. expense 값 생성
  const res = await prisma.expense.create({
    data: {
      title,
      amount,
      tripId,
      paidById,
      splits: {
        create: splits.map((s) => ({
          participantId: s.participantId,
          shareAmount: s.shareAmount,
        })),
      },
    },
  });

  revalidatePath(`/demo/${demoKey}/trips/${tripId}`);
  return NextResponse.json({ data: res }, { status: 201 });
}
