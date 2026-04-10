"use client";

import { formatAmount } from "@/lib/format";
import { ApiResponse, ExpenseDetailResponse, TripDetailResponse } from "@/types/api";
import { useMemo, useState } from "react";
import ExpenseCheck from "./ExpenseCheck";
import ExpenseForm from "./ExpenseForm";
import { HiOutlineCurrencyDollar } from "react-icons/hi";
import { toaster } from "@/components/ui/toaster";

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

    try {
      const res = await fetch(`/api/demo/${demoKey}/trips/${tripId}/expenses/${id}`);
      const result = await res.json().catch(() => null);

      if (!res.ok) {
        const message = result.message ?? "여행 상세 조회 중 오류가 발생했습니다.";

        toaster.create({
          title: "조회 실패",
          description: message,
          type: "error",
        });
      }

      const { data } = result as ApiResponse<ExpenseDetailResponse>;
      setSelectedExpense(data);
    } catch (error) {
      console.error(error);

      toaster.create({
        title: "조회 실패",
        description: "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        type: "error",
      });
    }
  };

  return (
    <div className="w-full overflow-x-hidden rounded-2xl border border-gray-200 bg-white px-5 py-5">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        {/* 지출 내역 헤더 */}
        <section className="flex min-w-0 flex-col">
          <div className="mb-4 flex min-w-0 gap-3 justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                <HiOutlineCurrencyDollar className="text-lg" />
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-lg font-semibold text-gray-900">지출 내역</h3>
              </div>
            </div>
            {canAddExpense && (
              <button
                type="button"
                onClick={handleClickAddExpense}
                className="shrink-0 self-start rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:border-blue-300 hover:text-blue-600 sm:self-auto"
              >
                <span className="sm:hidden">추가 +</span>
                <span className="hidden sm:inline">지출 내역 추가하기 +</span>
              </button>
            )}
          </div>
          {/* 지출 내역 */}
          <div className="max-h-[420px] min-w-0 overflow-y-auto rounded-2xl border border-gray-100 bg-gray-50 p-4">
            {expenses.length === 0 ? (
              <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
                <p className="text-base font-medium text-gray-700">
                  지출 내역이 존재하지 않습니다.
                </p>
                <p className="mt-1 text-sm text-gray-400">첫 번째 지출을 추가해보세요.</p>
              </div>
            ) : (
              <div className="flex min-w-0 flex-col gap-5">
                {grouppingExpenses.map((group) => (
                  <div key={group.date} className="min-w-0">
                    <p className="mb-3 truncate text-sm font-semibold text-gray-400">
                      {group.date}
                    </p>
                    <div className="flex min-w-0 flex-col gap-2">
                      {group.items.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleClickExpense(item.id)}
                          className="flex w-full min-w-0 items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 text-left transition hover:border-blue-200 hover:bg-blue-50"
                        >
                          <div className="min-w-0 flex-1">
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
        {/* 지출 추가 폼  */}
        <aside className="min-w-0 rounded-2xl border border-gray-100 bg-gray-50 p-5">
          <div className="mb-4 min-w-0">
            <h3 className="truncate text-lg font-semibold text-gray-900">
              {status === "SETTLED"
                ? "정산 상세 내역"
                : canEdit && canAddExpense
                  ? "지출 추가"
                  : "지출 정보"}
            </h3>
          </div>

          <div className="min-w-0 rounded-2xl bg-white p-4">
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
