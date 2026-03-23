import { apiError } from "@/lib/api-error";
import { prisma } from "@/lib/prisma";
import { ErrorCode } from "@/types/api";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /demo/:demoKey/trips/:tripId/expenses (지출 추가)
 * returns splits
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ demoKey: string; tripId: string }> },
) {
  // 1. 타입 체크
  const { demoKey, tripId } = await params;
  if (!demoKey || !tripId) return apiError(ErrorCode.BAD_REQUEST, 400);

  const { title, amount, paidById, splits } = await request.json();

  if (typeof title !== "string" || typeof amount !== "number" || typeof paidById !== "string")
    return apiError(ErrorCode.BAD_REQUEST, 400);

  if (!Array.isArray(splits) || splits.length === 0) return apiError(ErrorCode.BAD_REQUEST, 400);

  for (const split of splits) {
    if (
      !split ||
      typeof split.participantId !== "string" ||
      typeof split.shareAmount !== "number"
    ) {
      return apiError(ErrorCode.BAD_REQUEST, 400);
    }
  }

  // 2. 정합성 체크
  const total = splits.reduce((sum, s) => sum + s.shareAmount, 0);
  if (total !== amount) {
    return apiError(ErrorCode.BAD_REQUEST, 400);
  }
  // 3. expense 값 생성
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

  return NextResponse.json({ data: res }, { status: 201 });
}
