import { apiError } from "@/lib/api-error";
import { prisma } from "@/lib/prisma";
import { ErrorCode } from "@/types/api";
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
  if (!demoKey) return apiError(ErrorCode.BAD_REQUEST, 400);

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

  return Response.json({ data: trip });
}

/**
 * PATCH /demo/:demoKey/trips/:tripId (여행 상세 정보 업데이트)
 *
 * demoKey 파라미터
 * tripId 파라미터
 * return Trip 상세 정보
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ demoKey: string; tripId: string }> },
) {
  const { demoKey, tripId } = await params;
  if (!demoKey || !tripId) return apiError(ErrorCode.BAD_REQUEST, 400);

  const { status } = await request.json();

  const VALID_STATUS = ["OPEN", "SETTLED"];

  if (!status || !VALID_STATUS.includes(status)) {
    return apiError(ErrorCode.BAD_REQUEST, 400);
  }

  const res = await prisma.trip.update({
    where: {
      id: tripId,
      demoKey,
    },
    data: {
      status,
    },
  });
  return NextResponse.json({ data: res }, { status: 200 });
}
