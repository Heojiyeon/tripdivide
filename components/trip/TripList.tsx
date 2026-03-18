"use client";

import { TripResponse } from "@/types/api";
import TripCard from "./TripCard";
import TripAddCard from "./TripAddCard";
import { useRouter } from "next/navigation";

/**
 *
 * @param trips 여행 리스트
 * @param demoKey 데모 키
 * @returns 여행 리스트 컴포넌트
 */
export default function TripList({ trips, demoKey }: { trips: TripResponse[]; demoKey: string }) {
  const router = useRouter();

  const handleSelectTrip = (tripId: string) => {
    router.push(`/demo/${demoKey}/trips/${tripId}`);
  };

  return (
    <div>
      <TripAddCard demoKey={demoKey} />
      <div>
        {trips.map((trip: TripResponse) => (
          <TripCard key={trip.id} trip={trip} onClick={handleSelectTrip} />
        ))}
      </div>
    </div>
  );
}
