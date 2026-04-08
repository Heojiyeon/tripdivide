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
    const { value: id, checked } = e.target;

    setSplits((prevSplits) => {
      if (checked) {
        return [...prevSplits, { participantId: id, shareAmount: amount }];
      }

      return prevSplits.filter((split) => split.participantId !== id);
    });
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

      setAmount(0);
      setSplitEqualMode(true);
      setSplits([]);

      router.refresh();
    }
  };

  useEffect(() => {
    if (!splitEqualMode) return;
    calculateEqualSplits(amount);
  }, [amount, splitEqualMode, splits.length]);

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* 지출명 / 금액 */}
      <div className="flex flex-col gap-3">
        <input
          type="text"
          name="title"
          id="expense-title"
          placeholder="지출명"
          className="h-11 rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          required
        />

        <input
          type="number"
          name="amount"
          id="expense-amount"
          placeholder="지출 금액"
          onChange={(e) => setAmount(Number(e.target.value))}
          className="h-11 rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          required
        />
      </div>

      {/* 참여자 */}
      <div>
        <p className="mb-2 text-sm font-medium text-gray-500">정산 참여자</p>
        <div className="flex flex-wrap gap-2">
          {participants.map((participant) => (
            <label
              key={participant.id}
              className="flex cursor-pointer items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800"
            >
              <input
                type="checkbox"
                name="expense-participants"
                value={participant.id}
                onChange={handleSplits}
                checked={splits.some((split) => split.participantId === participant.id)}
              />
              {participant.name}
            </label>
          ))}
        </div>
      </div>

      {/* 결제자 */}
      <div>
        <p className="mb-2 text-sm font-medium text-gray-500">정산 책임자</p>
        <select
          name="paidby"
          id="expense-paidby"
          defaultValue=""
          className="h-11 w-full rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          required
        >
          <option value="">선택</option>
          {participants.map((participant) => (
            <option key={participant.id} value={participant.id}>
              {participant.name}
            </option>
          ))}
        </select>
      </div>

      {/* 정산 방식 */}
      <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-500">정산</p>

          <label className="flex items-center gap-2 text-sm font-semibold text-blue-500">
            균등 분배
            <input type="checkbox" id="checkEqual" defaultChecked onChange={handleSetSplits} />
          </label>
        </div>

        <div className="flex flex-col gap-2">
          {splits.map((split) => (
            <div
              key={split.participantId}
              className="flex items-center justify-between rounded-lg bg-white px-3 py-2"
            >
              <span className="text-sm font-medium text-gray-700">
                {getNameById(split.participantId)}
              </span>

              <input
                type="number"
                onChange={(e) => handleManualSplits(e, split)}
                value={split.shareAmount}
                disabled={splitEqualMode}
                className="w-24 rounded-lg border border-gray-300 px-2 py-1 text-right text-sm outline-none disabled:bg-gray-100"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 버튼 */}
      <button
        type="submit"
        className="mt-2 h-11 w-full rounded-xl bg-blue-500 text-sm font-semibold text-white transition hover:bg-blue-600"
      >
        지출 추가
      </button>
    </form>
  );
}
