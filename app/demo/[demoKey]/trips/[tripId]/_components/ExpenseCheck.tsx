import { formatAmount } from "@/lib/format";
import { ExpenseDetailResponse } from "@/types/api";

/**
 *
 * @returns 지출 상세 조회 컴포넌트
 */
export default function ExpenseCheck({
  selectedExpense,
}: {
  selectedExpense?: ExpenseDetailResponse;
}) {
  if (!selectedExpense) {
    return <div>지출 정보를 선택해 주세요.</div>;
  }

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div>
        {selectedExpense.title} | {formatAmount(selectedExpense.amount)}원
      </div>
      <div>결제자: {selectedExpense.paidBy?.name}</div>
      <div>
        정산 내용:
        {selectedExpense.splits?.map((split, idx) => (
          <div key={idx}>
            {split.participant.name} || {formatAmount(split.shareAmount)}원
          </div>
        ))}
      </div>
    </div>
  );
}
