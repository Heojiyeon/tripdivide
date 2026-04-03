import { apiError } from "@/lib/api-error";
import { prisma } from "@/lib/prisma";
import { calculateSettlement } from "@/lib/settlement";
import { ErrorCode } from "@/types/api";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /demo/:demoKey/trips/:tripId/settlement (정산 결과 조회)
 *
 * 해당 여행에 관련된 정보를 가져와, 결과를 가공해서 리턴
 * - 여행 제목
 * - 여행 참여자
 * - 총 사용 금액
 * - 정산 관계 (최소 송금 관계)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ demoKey: string; tripId: string }> },
) {
  const { demoKey, tripId } = await params;
  if (!demoKey || !tripId) return apiError(ErrorCode.BAD_REQUEST, 400);

  const res = await prisma.trip.findFirst({
    where: {
      id: tripId,
      demoKey,
    },
    include: {
      participants: true,
      expenses: {
        include: {
          paidBy: true,
          splits: {
            include: {
              participant: true,
            },
          },
        },
      },
    },
  });

  if (!res) return apiError(ErrorCode.SETTLEMENT_NOT_FOUND, 404);

  const { totalAmount, transactions } = calculateSettlement({
    participants: res.participants,
    expenses: res.expenses,
  });

  return NextResponse.json({
    data: {
      id: res.id,
      title: res.title,
      totalAmount,
      participants: res.participants,
      transactions,
    },
  });
}
