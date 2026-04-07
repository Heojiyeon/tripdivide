"use client";

import { formatAmount } from "@/lib/format";
import { ApiResponse, ExpenseDetailResponse, TripDetailResponse } from "@/types/api";
import { useMemo, useState } from "react";
import ExpenseForm from "./ExpenseForm";
import ExpenseCheck from "./ExpenseCheck";

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

  const canAddExpense = useMemo<boolean>(() => (status === "OPEN" ? true : false), [status]);
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
    <div className="flex justify-between border border-yellow-300">
      <div>
        <p className="flex justify-between">
          지출 내역 |&nbsp;
          {canAddExpense && (
            <button className="text-gray-400" onClick={handleClickAddExpense}>
              지출 내역 추가하기 +
            </button>
          )}
        </p>
        {expenses.length === 0 ? (
          <div>지출 내역이 존재하지 않습니다.</div>
        ) : (
          grouppingExpenses.map((expense, idx) => (
            <div key={idx}>
              {expense.date} |
              {expense.items.map((item) => (
                <div key={item.id} onClick={() => handleClickExpense(item.id)}>
                  <span>{item.title}</span>
                  <span>{formatAmount(item.amount)}원</span>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
      <div className="border border-orange-500 flex flex-col items-center w-xl">
        <p className="font-bold text-l">{canEdit && canAddExpense ? "지출 추가" : "지출 정보"}</p>
        <div className="flex-1 p-4">
          {canEdit && canAddExpense ? (
            <ExpenseForm demoKey={demoKey} tripId={tripId} participants={participants} />
          ) : (
            <ExpenseCheck selectedExpense={selectedExpense!} />
          )}
        </div>
      </div>
    </div>
  );
}
