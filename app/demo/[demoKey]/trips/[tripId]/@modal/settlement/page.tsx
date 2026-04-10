import Modal from "@/components/ui/Modal";
import { formatAmount } from "@/lib/format";
import { ApiResponse, SettlementResponse } from "@/types/api";
import { redirect } from "next/navigation";
import TripSettlementShareButton from "../../_components/TripSettlementShareButton";

export default async function Settlement({
  params,
}: {
  params: Promise<{ demoKey: string; tripId: string }>;
}) {
  const { demoKey, tripId } = await params;

  const res = await fetch(`${process.env.API_URL}/api/demo/${demoKey}/trips/${tripId}/settlement`);

  if (res.status === 404) {
    redirect(`/demo/${demoKey}/trips/${tripId}?notice=settlement-not-found`);
  }

  const result = await res.json().catch(() => null);

  if (!res.ok) {
    return (
      <Modal title="📃 정산 결과서" closeHref="/">
        <div className="flex flex-col gap-6 text-sm text-gray-600">
          정산 결과를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
        </div>
      </Modal>
    );
  }
  const { data } = result as ApiResponse<SettlementResponse>;
  const { title, totalAmount, participants, transactions } = data;

  return (
    <Modal title="📃 정산 결과서" closeHref="/">
      <div className="flex flex-col gap-6">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-gray-500">여행</p>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">총 지출 금액</p>
            <p className="text-lg font-bold text-gray-900">{formatAmount(totalAmount)}원</p>
          </div>
          <div>
            <p className="mb-2 text-sm text-gray-500">참여자</p>
            <div className="mb-3 flex flex-wrap gap-2">
              {participants.map((participant) => (
                <span
                  key={participant.id}
                  className="rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-semibold text-gray-800"
                >
                  {participant.name}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">정산 내역</h4>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-600 border border-blue-100">
              총 {transactions.length}건
            </span>
          </div>
          {transactions.length === 0 ? (
            <div className="rounded-xl border border-blue-100 bg-white py-10 text-center text-sm text-gray-400">
              정산할 금액이 없습니다.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {transactions.map((transaction, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-2xl border border-blue-100 bg-white px-4 py-4 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-sm font-bold">
                      {idx + 1}
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-semibold text-gray-900">
                          {transaction.from} → {transaction.to}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl px-3 py-2 text-sm font-bold text-blue-500">
                    {formatAmount(transaction.amount)}원
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="w-full flex flex-col gap-1 sm:flex-row sm:justify-end">
          <TripSettlementShareButton demoKey={demoKey} tripId={tripId} />
        </div>
      </div>
    </Modal>
  );
}
