import { apiError } from "@/lib/api-error";
import { prisma } from "@/lib/prisma";
import { ErrorCode } from "@/types/api";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

/**
 * GET /demo/:demokey/trips (여행 리스트 조회)
 *
 * demoKey 파라미터
 * @returns Trip[]
 */
export async function GET(request: Request, { params }: { params: Promise<{ demoKey: string }> }) {
  const { demoKey } = await params;
  if (!demoKey) return apiError(ErrorCode.BAD_REQUEST, 400);

  const trips = await prisma.trip.findMany({
    where: {
      demoKey: demoKey,
    },
  });

  return Response.json({ data: trips }, { status: 200 });
}

/**
 * POST /demo/:demoKey/trips (여행 리스트 추가)
 *
 * demoKey 파라미터
 * return Trip
 */
export async function POST(request: Request, { params }: { params: Promise<{ demoKey: string }> }) {
  const { demoKey } = await params;
  if (!demoKey) return apiError(ErrorCode.BAD_REQUEST, 400);

  const { title } = await request.json();

  if (typeof title !== "string" || !title.trim()) return apiError(ErrorCode.BAD_REQUEST, 400);

  const res = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const createdTrip = await tx.trip.create({
      data: {
        demoKey,
        title,
      },
    });

    await tx.participant.create({
      data: {
        tripId: createdTrip.id,
        name: "나(본인)",
      },
    });

    return createdTrip;
  });

  revalidatePath(`/demo/${demoKey}/trips`);

  return Response.json({ data: res }, { status: 201 });
}
