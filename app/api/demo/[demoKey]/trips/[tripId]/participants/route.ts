import { apiError } from "@/app/lib/api-error";
import { prisma } from "@/app/lib/prisma";
import { ErrorCode } from "@/app/types/api";

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
  if (!name?.trim()) return apiError(ErrorCode.BAD_REQUEST, 400);

  const participant = await prisma.participant.create({
    data: {
      tripId,
      name,
    },
  });

  return Response.json({ participant });
}
