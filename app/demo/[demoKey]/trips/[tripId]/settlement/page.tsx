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
    <Modal title={"📃 정산 결과서"}>
      <div className="py-10 text-center">
        <p>여행 제목 | {title}</p>
        <p>총 지출 금액 | {formatAmount(totalAmount)}원</p>
        <div>
          여행 참여자 |&nbsp;
          {participants.map((participant) => (
            <span key={participant.id}>{participant.name} </span>
          ))}
        </div>
      </div>
      <div className="py-10 text-center">
        정산 내역
        {transactions.map((transaction, idx) => (
          <p key={idx} className="font-semibold">
            <span>{transaction.from}</span> ➡️&nbsp;
            <span>{transaction.to}</span> | {formatAmount(transaction.amount)}원 송금
          </p>
        ))}
      </div>
    </Modal>
  );
}
