import { ErrorCode, Participant, SettlementExpense } from "../types/api";

export function calculateSettlement({
  participants,
  expenses,
}: {
  participants: Participant[];
  expenses: SettlementExpense[];
}): {
  totalAmount: number;
  transactions: { from: string; to: string; amount: number }[];
} {
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

  participants.forEach((participant) => {
    participantMap.set(participant.id, {
      name: participant.name,
      paidAmount: 0,
      owedAmount: 0,
      balance: 0,
    });
  });

  for (const { amount, paidById, splits } of expenses) {
    totalAmount += amount;

    // 결제자 확인
    const paidBy = participantMap.get(paidById);
    if (!paidBy) throw new Error(ErrorCode.PARTICIPANT_NOT_FOUND);

    paidBy.paidAmount += amount;

    // 정산 참여자 확인
    for (const split of splits) {
      const sender = participantMap.get(split.participantId);
      if (!sender) throw new Error(ErrorCode.PARTICIPANT_NOT_FOUND);

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

  return { totalAmount, transactions };
}
