import { apiError } from "@/lib/api-error";
import { prisma } from "@/lib/prisma";
import { ErrorCode } from "@/types/api";
import { NextRequest } from "next/server";

/**
 * GET /demo/:demoKey/trips/:tripId/expenses/:expenseId (지출 상세 조회)
 * return split
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ demoKey: string; tripId: string; expenseId: string }> },
) {
  const { demoKey, tripId, expenseId } = await params;
  if (!demoKey || !tripId || !expenseId) return apiError(ErrorCode.BAD_REQUEST, 400);

  const expense = await prisma.expense.findFirst({
    where: {
      id: expenseId,
      tripId,
      trip: {
        demoKey,
      },
    },
    include: {
      paidBy: {
        select: {
          id: true,
          name: true,
        },
      },
      splits: {
        select: {
          shareAmount: true,
          participant: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!expense) {
    return apiError(ErrorCode.EXPENSE_NOT_FOUND, 404);
  }

  return Response.json({ data: expense }, { status: 200 });
}
