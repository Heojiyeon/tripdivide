"use client";

import { TripDetailResponse } from "@/types/api";
import { useRouter } from "next/navigation";
import { ChangeEvent, Fragment, useEffect, useRef, useState } from "react";

/**
 *
 * @returns 지출 추가 폼 컴포넌트
 */
export default function ExpenseForm({
  demoKey,
  tripId,
  participants,
}: {
  demoKey: string;
  tripId: string;
  participants: TripDetailResponse["participants"];
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [amount, setAmount] = useState(0);
  const [splitEqualMode, setSplitEqualMode] = useState(true);
  const [splits, setSplits] = useState<{ participantId: string; shareAmount: number }[]>([]);

  /** participantId 에 따른 이름 리턴 함수 */
  const getNameById = (id: string) =>
    participants.find((participant) => participant.id === id)?.name ?? "알 수 없음";

  /** 지출 금액을 분배하는 함수 */
  const calculateEqualSplits = (currentAmount: number) => {
    // 균등 분배
    if (splitEqualMode) {
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
    }
  };

  /** 지출 수동 분배 핸들링 함수 */
  const handleManualSplits = (
    e: ChangeEvent<HTMLInputElement>,
    split: { participantId: string; shareAmount: number },
  ) => {
    setSplits((prevSplits) => {
      const changed = prevSplits.map((prevSplit) => {
        if (prevSplit.participantId === split.participantId)
          return {
            ...prevSplit,
            shareAmount: Number(e.target.value),
          };
        return { ...prevSplit };
      });

      return changed;
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

  /** 정산 추가 제출 함수 */
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
    <form ref={formRef} onSubmit={handleSubmit}>
      <fieldset className="flex flex-col justify-center items-center gap-2">
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
              <input
                type="number"
                onChange={(e) => handleManualSplits(e, split)}
                value={split.shareAmount}
                disabled={splitEqualMode}
              />
            </div>
          ))}
        </div>
        <button type="submit">지출 추가</button>
      </fieldset>
    </form>
  );
}
