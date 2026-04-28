import { apiError } from "@/lib/api-error";
import { prisma } from "@/lib/prisma";
import { ErrorCode } from "@/types/api";
import { revalidatePath } from "next/cache";

/**
 * DELETE /demo/:demoKey/trips/:tripId/participants/:participantId (참여자 삭제)
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ demoKey: string; tripId: string; participantId: string }> },
) {
  const { demoKey, tripId, participantId } = await params;

  if (!demoKey || !tripId || !participantId) {
    return apiError(ErrorCode.BAD_REQUEST, 400);
  }

  const currentTrip = await prisma.trip.findFirst({
    where: {
      demoKey,
      id: tripId,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!currentTrip) return apiError(ErrorCode.TRIP_NOT_FOUND, 404);
  if (currentTrip.status === "SETTLED") return apiError(ErrorCode.TRIP_ALREADY_SETTLED, 409);

  const existingParticipant = await prisma.participant.findFirst({
    where: {
      id: participantId,
      tripId,
      trip: {
        demoKey,
      },
    },
    select: {
      id: true,
    },
  });

  if (!existingParticipant) return apiError(ErrorCode.PARTICIPANT_NOT_FOUND, 404);

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
    },
  });

  revalidatePath(`/demo/${demoKey}/trips/${tripId}`);
  return new Response(null, { status: 204 });
}
