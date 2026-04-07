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
    <div className="flex w-full flex-col gap-4">
      {/* 헤더 */}
      <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
        <p className="mb-1 text-sm font-medium text-gray-500">지출 정보</p>
        <div className="flex items-center justify-between gap-3">
          <h4 className="text-lg font-semibold text-gray-900">{selectedExpense.title}</h4>
          <span className="shrink-0 text-base font-bold text-gray-900">
            {formatAmount(selectedExpense.amount)}원
          </span>
        </div>
      </div>

      {/* 결제자 */}
      <div className="rounded-xl border border-gray-100 bg-white p-4">
        <p className="mb-2 text-sm font-medium text-gray-500">정산 책임자</p>
        <div className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600">
          {selectedExpense.paidBy?.name}
        </div>
      </div>

      {/* 정산 내용 */}
      <div className="rounded-xl border border-gray-100 bg-white p-4">
        <p className="mb-3 text-sm font-medium text-gray-500">정산 내용</p>

        <div className="flex flex-col gap-2">
          {selectedExpense.splits?.map((split) => (
            <div
              key={split.participant.id}
              className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
            >
              <span className="text-sm font-medium text-gray-700">{split.participant.name}</span>
              <span className="text-sm font-semibold text-gray-900">
                {formatAmount(split.shareAmount)}원
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
