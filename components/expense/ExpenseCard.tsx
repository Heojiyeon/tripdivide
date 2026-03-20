/**
 *
 * @returns 지출 (추가 및 내역) 카드
 */
export default function ExpenseCard({
  canEdit = false,
  participants,
}: {
  canEdit: boolean;
  participants: {
    id: string;
    name: string;
  }[];
}) {
  return (
    <div className="border border-orange-500 flex flex-col items-center">
      <p className="font-bold text-l">{canEdit ? "지출 추가" : "지출 정보"}</p>
      <form>
        <fieldset disabled={!canEdit} className="flex flex-col justify-center items-center gap-2">
          <input type="text" name="title" id="expense-title" placeholder="지출명" />
          <input type="number" name="amount" id="expense-amount" placeholder="지출 금액" />
          <p>
            정산 참여자 |&nbsp;
            {participants.map((participant, idx) => (
              <>
                <input
                  key={idx}
                  type="checkbox"
                  name="expense-participants"
                  id={participant.id}
                  value={participant.id}
                />
                <label htmlFor={participant.id}>{participant.name}</label>
              </>
            ))}
          </p>
          <p>
            정산 책임자 |&nbsp;
            <select name="paidby" id="expense-paidby" defaultValue={""}>
              <option value="">선택</option>
              {participants.map((participant, idx) => (
                <option key={idx} value={participant.id}>
                  {participant.name}
                </option>
              ))}
            </select>
          </p>
        </fieldset>
      </form>
    </div>
  );
}
