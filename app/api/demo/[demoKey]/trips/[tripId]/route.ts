import { apiError } from "@/lib/api-error";
import { prisma } from "@/lib/prisma";
import { ErrorCode } from "@/types/api";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

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
  if (!demoKey || !tripId) return apiError(ErrorCode.BAD_REQUEST, 400);

  // 여행 상세 정보 조회
  const trip = await prisma.trip.findFirst({
    where: {
      id: tripId,
      demoKey: demoKey,
    },
    include: {
      participants: true,
      expenses: {
        select: {
          id: true,
          title: true,
          amount: true,
          createdAt: true,
        },
      },
    },
  });

  if (!trip) {
    return apiError(ErrorCode.TRIP_NOT_FOUND, 404);
  }

  return Response.json({ data: trip }, { status: 200 });
}

/**
 * PATCH /demo/:demoKey/trips/:tripId (여행 상세 정보 업데이트)
 *
 * demoKey 파라미터
 * tripId 파라미터
 * return Trip 상세 정보
 */

const VALID_STATUS = ["OPEN", "SETTLED"] as const;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ demoKey: string; tripId: string }> },
) {
  const { demoKey, tripId } = await params;
  if (!demoKey || !tripId) return apiError(ErrorCode.BAD_REQUEST, 400);

  // 1. trip 존재 검증
  const validTrip = await prisma.trip.findFirst({
    where: {
      id: tripId,
      demoKey,
    },
    include: {
      expenses: {
        include: {
          splits: true,
        },
      },
    },
  });

  if (!validTrip) return apiError(ErrorCode.TRIP_NOT_FOUND, 404);

  // 2. 지출 내역 존재 검증
  if (validTrip.expenses.length === 0) return apiError(ErrorCode.EXPENSE_NOT_FOUND, 400);

  // 3. 상태 검증
  const { status } = await request.json();

  if (!status || !VALID_STATUS.includes(status)) {
    return apiError(ErrorCode.BAD_REQUEST, 400);
  }

  const res = await prisma.trip.update({
    where: {
      id: tripId,
    },
    data: {
      status,
    },
  });

  return NextResponse.json({ data: res }, { status: 200 });
}

/**
 * DELETE /demo/:demoKey/trips/:tripId (여행 삭제)
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ demoKey: string; tripId: string }> },
) {
  const { demoKey, tripId } = await params;
  if (!demoKey || !tripId) return apiError(ErrorCode.BAD_REQUEST, 400);

  const isExistedTrip = await prisma.trip.findFirst({
    where: {
      demoKey,
      id: tripId,
    },
  });

  if (!isExistedTrip) return apiError(ErrorCode.TRIP_NOT_FOUND, 404);

  await prisma.trip.delete({
    where: {
      id: tripId,
    },
  });

  revalidatePath(`/demo/${demoKey}/trips`);
  return new Response(null, { status: 204 });
}
