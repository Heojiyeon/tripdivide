import ExpenseCard from "./ExpenseCard";

/**
 *
 * @returns 지출 리스트 컴포넌트
 */
export default function ExpenseList({
  demoKey,
  tripId,
  expenses,
  participants,
}: {
  demoKey: string;
  tripId: string;
  expenses: {
    id: string;
    title: string;
    amount: number;
    paidBy: {
      id: string;
      name: string;
    };
    splits: {
      id: string;
      name: string;
      shareAmount: number;
    }[];
    createdAt: string;
  }[];
  participants: {
    id: string;
    name: string;
  }[];
}) {
  return (
    <div className="flex justify-between border border-yellow-300">
      <div>
        <p className="flex justify-between">
          지출 내역 |&nbsp;
          <button className="text-gray-400">지출 내역 추가하기 +</button>
        </p>
        {expenses.length === 0 ? (
          <div>지출 내역이 존재하지 않습니다.</div>
        ) : (
          expenses.map((expense, idx) => (
            <div key={idx}>
              {expense.title}
              {expense.amount}
            </div>
          ))
        )}
      </div>
      <ExpenseCard demoKey={demoKey} tripId={tripId} canEdit={true} participants={participants} />
    </div>
  );
}
