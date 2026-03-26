import { apiError } from "@/lib/api-error";
import { prisma } from "@/lib/prisma";
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

  if (!res) return apiError(ErrorCode.SETTLEMENT_NOT_FOUND, 400);

  /** 총 사용 금액 , 최소 송금 관계 계산 로직 필요
   *
   * participants 기준으로..
   * paidAmount(결제 금액), owedAmount(부담해야하는 금액) 을 가지는 데이터 구조 생성
   * 해당 중간 결과 데이터를 기반으로 참가자 별 balance를 생성해 +/- 기준으로 송금 관계 부여!!!
   */
  let totalAmount = 0;
  const participantMap = new Map<
    string,
    {
      name: string;
      paidAmount: number;
      owedAmount: number;
      balance: number;
    }
  >();

  res.participants.forEach((participant) => {
    participantMap.set(participant.id, {
      name: participant.name,
      paidAmount: 0,
      owedAmount: 0,
      balance: 0,
    });
  });

  for (const { amount, paidById, splits } of res.expenses) {
    totalAmount += amount;

    // 결제자 확인
    const paidBy = participantMap.get(paidById);
    if (!paidBy) return apiError(ErrorCode.SETTLEMENT_NOT_FOUND, 400);

    paidBy.paidAmount += amount;

    // 정산 참여자 확인
    for (const split of splits) {
      const sender = participantMap.get(split.participantId);
      if (!sender) return apiError(ErrorCode.SETTLEMENT_NOT_FOUND, 400);

      sender.owedAmount += split.shareAmount;
    }
  }

  // 최소 송금 계산
  participantMap.forEach((p) => {
    p.balance = p.paidAmount - p.owedAmount;
  });

  const result = [...participantMap].map(([id, p]) => ({ id, ...p }));

  const creditors = result.filter((p) => p.balance > 0);
  const debtors = result.filter((p) => p.balance < 0);

  const transactions = [];

  for (const debtor of debtors) {
    let remaining = Math.abs(debtor.balance);

    for (const creditor of creditors) {
      if (remaining === 0 || creditor.balance === 0) break;

      const amount = Math.min(remaining, creditor.balance);
      transactions.push({ from: debtor.name, to: creditor.name, amount });

      remaining -= amount;
      creditor.balance -= amount;
    }
  }

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
