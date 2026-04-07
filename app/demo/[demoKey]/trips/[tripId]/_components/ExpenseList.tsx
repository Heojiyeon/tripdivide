"use client";

import { formatAmount } from "@/lib/format";
import { ApiResponse, ExpenseDetailResponse, TripDetailResponse } from "@/types/api";
import { useMemo, useState } from "react";
import ExpenseCheck from "./ExpenseCheck";
import ExpenseForm from "./ExpenseForm";
import { HiOutlineCurrencyDollar } from "react-icons/hi";

/**
 *
 * @param demoKey
 * @param tripId
 * @param expenses
 * @param participants
 * @returns 지출 리스트 컴포넌트
 */
export default function ExpenseList({
  demoKey,
  tripId,
  expenses,
  participants,
  status,
}: {
  demoKey: string;
  tripId: string;
  expenses: TripDetailResponse["expenses"];
  participants: TripDetailResponse["participants"];
  status: TripDetailResponse["status"];
}) {
  const [canEdit, setCanEdit] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseDetailResponse | null>(null);

  const canAddExpense = useMemo(() => (status === "OPEN" ? true : false), [status]);
  const grouppingExpenses = useMemo(() => {
    const map = new Map<string, TripDetailResponse["expenses"]>();

    for (const expense of expenses) {
      const dateKey = expense.createdAt.slice(0, 10);

      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }

      map.get(dateKey)!.push(expense);
    }

    return Array.from(map.entries()).map(([date, items]) => ({
      date,
      items,
    }));
  }, [expenses]);

  const handleClickAddExpense = () => {
    setCanEdit(true);
  };

  const handleClickExpense = async (id: string) => {
    setCanEdit(false);

    const res = await fetch(`/api/demo/${demoKey}/trips/${tripId}/expenses/${id}`);

    if (!res.ok) {
      console.error("지출 상세 조회 실패");
      return;
    }

    const { data } = (await res.json()) as ApiResponse<ExpenseDetailResponse>;

    setSelectedExpense(data);
  };

  return (
    <div className="w-ful rounded-2xl border border-gray-200 bg-white px-5 py-5">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <section className="min-w-0">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                <HiOutlineCurrencyDollar className="text-lg" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">지출 내역</h3>
              </div>
            </div>
            {canAddExpense && (
              <button
                type="button"
                onClick={handleClickAddExpense}
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:border-blue-300 hover:text-blue-600"
              >
                지출 내역 추가하기 +
              </button>
            )}
          </div>
          <div className="max-h-[420px] overflow-y-auto rounded-2xl border border-gray-100 bg-gray-50 p-4">
            {expenses.length === 0 ? (
              <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
                <p className="text-base font-medium text-gray-700">
                  지출 내역이 존재하지 않습니다.
                </p>
                <p className="mt-1 text-sm text-gray-400">첫 번째 지출을 추가해보세요.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {grouppingExpenses.map((group) => (
                  <div key={group.date}>
                    <p className="mb-3 text-sm font-semibold text-gray-400">{group.date}</p>
                    <div className="flex flex-col gap-2">
                      {group.items.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleClickExpense(item.id)}
                          className="flex w-full items-center justify-between rounded-xl bg-white px-4 py-3 text-left transition hover:border-blue-200 hover:bg-blue-50"
                        >
                          <div className="min-w-0">
                            <p className="truncate font-medium text-gray-900">{item.title}</p>
                          </div>
                          <span className="shrink-0 text-sm font-semibold text-gray-700">
                            {formatAmount(item.amount)}원
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
        <aside className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {status === "SETTLED"
                ? "정산 상세 내역"
                : canEdit && canAddExpense
                  ? "지출 추가"
                  : "지출 정보"}
            </h3>
          </div>
          <div className="rounded-2xl bg-white p-4">
            {canEdit && canAddExpense ? (
              <ExpenseForm demoKey={demoKey} tripId={tripId} participants={participants} />
            ) : selectedExpense ? (
              <ExpenseCheck selectedExpense={selectedExpense} />
            ) : (
              <div className="flex min-h-[260px] items-center justify-center text-center text-sm text-gray-400">
                확인할 지출을 선택해 주세요.
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
