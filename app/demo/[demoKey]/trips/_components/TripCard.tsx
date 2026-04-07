import { TripResponse } from "@/types/api";

/**
 *
 * @param trip 여행 정보
 * @returns 여행 정보 카드 컴포넌트
 */
export default function TripCard({
  trip,
  onClick,
}: {
  trip: TripResponse;
  onClick: (tripId: string) => void;
}) {
  return (
    <div onClick={() => onClick(trip.id)}>
      <p>{trip.title}</p>
      <p>{trip.status}</p>
      <p>{trip.createdAt}</p>
    </div>
  );
}
