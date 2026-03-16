import { TripResponse } from "@/types/api";
import TripCard from "./TripCard";
import TripAddCard from "./TripAddCard";

/**
 *
 * @param trips 여행 리스트
 * @param demoKey 데모 키
 * @returns 여행 리스트 컴포넌트
 */
export default function TripList({ trips, demoKey }: { trips: TripResponse[]; demoKey: string }) {
  return (
    <div>
      <TripAddCard demoKey={demoKey} />
      {trips.map((trip: TripResponse) => (
        <TripCard key={trip.id} trip={trip} />
      ))}
    </div>
  );
}
