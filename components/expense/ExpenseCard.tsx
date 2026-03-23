"use client";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Fragment } from "react/jsx-runtime";

/**
 *
 * @returns 지출 추가 컴포넌트
 */
export default function ExpenseCard({
  demoKey,
  tripId,
  canEdit = false,
  participants,
}: {
  demoKey: string;
  tripId: string;
  canEdit: boolean;
  participants: {
    id: string;
    name: string;
  }[];
}) {
  const router = useRouter();

  const formRef = useRef<HTMLFormElement>(null);
  const [amount, setAmount] = useState(0);
  const [splits, setSplits] = useState<{ participantId: string; shareAmount: number }[]>([]);
  const [splitEqualMode, setSplitEqualMode] = useState(true);

  /** participantId 에 따른 이름 리턴 함수 */
  const getNameById = (id: string) =>
    participants.find((participant) => participant.id === id)?.name ?? "알 수 없음";

  /** 지출 금액을 균등 분배하는 함수 */
  const calculateEqualSplits = (currentAmount: number) => {
    setSplits((prevSplits) => {
      const n = prevSplits.length;
      if (n === 0) return prevSplits;

      const base = Math.floor(currentAmount / n);
      const remainder = currentAmount % n;

      return prevSplits.map((split, idx) => ({
        ...split,
        shareAmount: idx < remainder ? base + 1 : base,
      }));
    });
  };

  /** 정산 리스트 생성 함수 */
  const handleSplits = (e: ChangeEvent<HTMLInputElement>) => {
    const { value: id } = e.target;
    const isAlreadySplits = splits.some((value) => value.participantId === id);

    if (isAlreadySplits) {
      setSplits((prevSplits) => prevSplits.filter((split) => split.participantId !== id));
    } else {
      setSplits((prevSplits) => [...prevSplits, { participantId: id, shareAmount: amount }]);
    }
  };

  /** 균등 분배 체크 여부에 따른 함수 */
  const handleSetSplits = (e: ChangeEvent<HTMLInputElement>) => {
    setSplitEqualMode(e.target.checked);

    if (e.target.checked) {
      calculateEqualSplits(amount);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const paidById = formData.get("paidby") as string;

    const res = await fetch(`/api/demo/${demoKey}/trips/${tripId}/expenses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, amount, paidById, splits }),
    });

    if (res.status === 201) {
      formRef.current?.reset();

      setSplits([]);
      router.refresh();
    }
  };

  useEffect(() => {
    if (!splitEqualMode) return;
    calculateEqualSplits(amount);
  }, [amount, splitEqualMode, splits.length]);

  return (
    <div className="border border-orange-500 flex flex-col items-center w-xl">
      <p className="font-bold text-l">{canEdit ? "지출 추가" : "지출 정보"}</p>
      <form ref={formRef} onSubmit={handleSubmit}>
        <fieldset disabled={!canEdit} className="flex flex-col justify-center items-center gap-2">
          <input type="text" name="title" id="expense-title" placeholder="지출명" />
          <input
            type="number"
            name="amount"
            id="expense-amount"
            placeholder="지출 금액"
            onChange={(e) => setAmount(Number(e.target.value))}
          />
          <p>
            정산 참여자 |&nbsp;
            {participants.map((participant) => (
              <Fragment key={participant.id}>
                <input
                  type="checkbox"
                  name="expense-participants"
                  id={participant.id}
                  value={participant.id}
                  onChange={handleSplits}
                />
                <label htmlFor={participant.id}>{participant.name}</label>
              </Fragment>
            ))}
          </p>
          <p>
            정산 책임자 |&nbsp;
            <select name="paidby" id="expense-paidby" defaultValue={""}>
              <option value="">선택</option>
              {participants.map((participant) => (
                <option key={participant.id} value={participant.id}>
                  {participant.name}
                </option>
              ))}
            </select>
          </p>
          <div className="w-full">
            <div className="flex justify-between">
              정산 |&nbsp;
              <div>
                <label htmlFor="checkEqual" className="font-semibold text-pink-300">
                  균등 분배
                </label>
                <input type="checkbox" id="checkEqual" defaultChecked onChange={handleSetSplits} />
              </div>
            </div>
            {splits.map((split) => (
              <div key={split.participantId}>
                <span>{getNameById(split.participantId)}</span>
                <span>{split.shareAmount}원</span>
              </div>
            ))}
          </div>
          {canEdit && <button type="submit">지출 추가</button>}
        </fieldset>
      </form>
    </div>
  );
}
