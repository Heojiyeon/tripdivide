import Modal from "@/components/ui/Modal";
import { formatAmount } from "@/lib/format";
import { ApiResponse, SettlementResponse } from "@/types/api";

export default async function Settlement({
  params,
}: {
  params: Promise<{ demoKey: string; tripId: string }>;
}) {
  const { demoKey, tripId } = await params;

  const res = await fetch(`${process.env.API_URL}/api/demo/${demoKey}/trips/${tripId}/settlement`);

  if (!res.ok) {
    console.error("지출 결과 조회 실패");
    return;
  }

  const { data } = (await res.json()) as ApiResponse<SettlementResponse>;
  const { title, totalAmount, participants, transactions } = data;

  return (
    <Modal title="📃 정산 결과서">
      <div className="flex flex-col gap-6">
        {/* 상단 요약 */}
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
          <div className="mb-3">
            <p className="text-sm text-gray-500">여행</p>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">총 지출 금액</p>
            <p className="text-lg font-bold text-gray-900">{formatAmount(totalAmount)}원</p>
          </div>

          <div>
            <p className="mb-2 text-sm text-gray-500">참여자</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {participants.map((participant) => (
                <span
                  key={participant.id}
                  className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-gray-800 border border-gray-200"
                >
                  {participant.name}
                </span>
              ))}
            </div>
          </div>
          {/* 정산 내역 */}
          <div>
            <p className="mb-3 text-sm font-medium text-gray-500">정산 내역</p>
            {transactions.length === 0 ? (
              <div className="rounded-xl border border-gray-100 bg-gray-50 py-10 text-center text-sm text-gray-400">
                정산할 금액이 없습니다.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {transactions.map((transaction, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl bg-white px-4 py-3 border border-gray-100"
                  >
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                      <span>{transaction.from}</span>
                      <span className="text-gray-400">→</span>
                      <span>{transaction.to}</span>
                    </div>

                    <span className="text-sm font-semibold text-gray-900">
                      {formatAmount(transaction.amount)}원
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
