/**
 *
 * @param demoKey 데모 키
 * @param tripId 여행 아이디
 * @param participants 참여자 데이터
 * @returns 참여자 리스트 컴포넌트
 */
export default function ParticipantList({
  demoKey,
  tripId,
  participants,
}: {
  demoKey: string;
  tripId: string;
  participants: {
    id: string;
    name: string;
  }[];
}) {
  return (
    <div className="flex">
      여행 참여 인원 |&nbsp;
      {participants.map((participant, idx) => (
        <div key={idx} className="font-semibold">
          {participant.name}&nbsp;
        </div>
      ))}
      <form action={`/api/demo/${demoKey}/trips/${tripId}/participants`} method="post">
        <input type="text" name="name" id="participant-name" placeholder="참여자 추가" required />
        <button type="submit">+</button>
      </form>
    </div>
  );
}
