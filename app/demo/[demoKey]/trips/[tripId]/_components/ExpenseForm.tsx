"use client";

import { toaster } from "@/components/ui/toaster";
import { TripDetailResponse } from "@/types/api";
import { useRouter } from "next/navigation";
import { ChangeEvent, useRef, useState } from "react";

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

  const [amount, setAmount] = useState("");
  const [splitEqualMode, setSplitEqualMode] = useState(true);
  const [splits, setSplits] = useState<{ participantId: string; shareAmount: number }[]>([]);

  const [loading, setLoading] = useState(false);

  const parseCurrency = (value: string) => Number(value.replaceAll(",", "") || 0);

  const formatCurrency = (value: string | number) => {
    const numeric = typeof value === "number" ? value : parseCurrency(value);
    if (!numeric) return "";
    return numeric.toLocaleString("ko-KR");
  };

  const amountValue = parseCurrency(amount);

  /** participantId 에 따른 이름 리턴 함수 */
  const getNameById = (id: string) =>
    participants.find((participant) => participant.id === id)?.name ?? "알 수 없음";

  /** 메인 금액 입력 핸들러 */
  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replaceAll(",", "").replace(/\D/g, "");
    const nextAmount = Number(raw || 0);

    setAmount(raw ? nextAmount.toLocaleString("ko-KR") : "");

    if (splitEqualMode) {
      setSplits((prevSplits) => getEqualSplits(nextAmount, prevSplits));
    }
  };

  /** 지출 균등 분배 함수 */
  const getEqualSplits = (
    currentAmount: number,
    currentSplits: { participantId: string; shareAmount: number }[],
  ) => {
    const n = currentSplits.length;
    if (n === 0) return currentSplits;

    const base = Math.floor(currentAmount / n);
    const remainder = currentAmount % n;

    return currentSplits.map((split, idx) => ({
      ...split,
      shareAmount: idx < remainder ? base + 1 : base,
    }));
  };

  /** 지출 수동 분배 핸들링 함수 */
  const handleManualSplits = (
    e: ChangeEvent<HTMLInputElement>,
    split: { participantId: string; shareAmount: number },
  ) => {
    const raw = e.target.value.replaceAll(",", "").replace(/\D/g, "");
    const nextValue = Number(raw || 0);

    setSplits((prevSplits) =>
      prevSplits.map((prevSplit) => {
        if (prevSplit.participantId === split.participantId) {
          return {
            ...prevSplit,
            shareAmount: nextValue,
          };
        }
        return prevSplit;
      }),
    );
  };

  /** 정산 리스트 생성 함수
   * 정산 참여자 추가 시, 실행되는 함수 -> 금액이 문제임
   */
  const handleSplits = (e: ChangeEvent<HTMLInputElement>) => {
    const { value: id, checked } = e.target;

    setSplits((prevSplits) => {
      const nextSplits = checked
        ? [...prevSplits, { participantId: id, shareAmount: 0 }]
        : prevSplits.filter((split) => split.participantId !== id);

      if (splitEqualMode) {
        return getEqualSplits(amountValue, nextSplits);
      }

      return nextSplits;
    });
  };

  /** 균등 분배 체크 여부에 따른 함수 */
  const handleSetSplits = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSplitEqualMode(checked);

    if (checked) {
      setSplits((prevSplits) => getEqualSplits(amountValue, prevSplits));
    }
  };

  /** 정산 추가 제출 함수 */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const title = formData.get("title") as string;
      const paidById = formData.get("paidby") as string;

      const res = await fetch(`/api/demo/${demoKey}/trips/${tripId}/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          amount: amountValue,
          paidById,
          splits,
        }),
      });

      const result = await res.json().catch(() => null);

      if (!res.ok) {
        const message = result?.message ?? "지출 추가 중 오류가 발생했습니다.";

        toaster.create({
          title: "추가 실패",
          description: message,
          type: "error",
        });
      } else {
        toaster.create({
          title: "추가 성공",
          description: "지출이 추가되었습니다.",
          type: "success",
        });

        formRef.current?.reset();

        setAmount("");
        setSplitEqualMode(true);
        setSplits([]);

        router.refresh();
      }
    } catch (error) {
      console.error(error);

      toaster.create({
        title: "추가 실패",
        description: "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form ref={formRef} onSubmit={handleSubmit} className="flex w-full min-w-0 flex-col">
        <fieldset disabled={loading} className="flex min-w-0 flex-col gap-4">
          {/* 지출명 / 금액 */}
          <div className="min-w-0 flex flex-col gap-3">
            <input
              type="text"
              name="title"
              id="expense-title"
              placeholder="지출명"
              className="h-11 rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              required
            />

            <div className="relative">
              <input
                type="text"
                name="amount"
                id="expense-amount"
                inputMode="numeric"
                placeholder="지출 금액"
                value={amount}
                onChange={handleAmountChange}
                className="h-11 w-full rounded-xl border border-gray-300 px-4 pr-10 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                required
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                원
              </span>
            </div>
          </div>

          {/* 참여자 */}
          <div className="min-w-0">
            <p className="mb-2 text-sm font-medium text-gray-500">정산 참여자</p>
            <div className="flex flex-wrap gap-2">
              {participants.map((participant) => (
                <label
                  key={participant.id}
                  className="flex min-w-0 max-w-full cursor-pointer items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800"
                >
                  <input
                    type="checkbox"
                    name="expense-participants"
                    value={participant.id}
                    onChange={handleSplits}
                    checked={splits.some((split) => split.participantId === participant.id)}
                  />
                  <span className="truncate">{participant.name}</span>
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
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium text-gray-500">정산</p>

              <label className="flex items-center gap-2 text-sm font-semibold text-blue-500">
                균등 분배
                <input
                  type="checkbox"
                  id="checkEqual"
                  checked={splitEqualMode}
                  onChange={handleSetSplits}
                />
              </label>
            </div>

            <div className="flex flex-col gap-2">
              {splits.map((split) => (
                <div
                  key={split.participantId}
                  className="flex min-w-0 flex-wrap items-center justify-between gap-2 rounded-lg bg-white px-3 py-2 sm:flex-nowrap"
                >
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-700">
                    {getNameById(split.participantId)}
                  </span>

                  <div className="relative ml-auto w-28 shrink-0">
                    <input
                      type="text"
                      inputMode="numeric"
                      onChange={(e) => handleManualSplits(e, split)}
                      value={formatCurrency(split.shareAmount)}
                      disabled={splitEqualMode}
                      className="w-full rounded-lg border border-gray-300 px-2 py-1 pr-7 text-right text-sm outline-none disabled:bg-gray-100"
                    />
                    <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                      원
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 h-11 w-full rounded-xl bg-blue-500 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            {loading ? "loading..." : "지출 추가"}
          </button>
        </fieldset>
      </form>
    </>
  );
}
