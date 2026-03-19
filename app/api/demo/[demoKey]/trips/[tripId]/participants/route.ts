import { apiError } from "@/lib/api-error";
import { prisma } from "@/lib/prisma";
import { ErrorCode } from "@/types/api";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

  const formData = await request.formData();
  const name = formData.get("name");

  if (typeof name !== "string" || !name.trim()) return apiError(ErrorCode.BAD_REQUEST, 400);

  await prisma.participant.create({
    data: {
      tripId,
      name,
    },
  });

  revalidatePath(`/demo/${demoKey}/trips/${tripId}`);
  redirect(`/demo/${demoKey}/trips/${tripId}`);
}
