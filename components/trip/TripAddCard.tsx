/**
 *
 * @param demoKey 데모 키
 * @returns 여행 추가 카드 컴포넌트
 */
export default function TripAddCard({ demoKey }: { demoKey: string }) {
  return (
    <div className="border border-dashed rounded p-6 flex flex-col gap-2 w-fit">
      <form action={`/api/demo/${demoKey}/trips`} method="post">
        <input type="text" name="title" placeholder="여행 제목" required />
        <button type="submit">ADD TRIP</button>
      </form>
    </div>
  );
}
