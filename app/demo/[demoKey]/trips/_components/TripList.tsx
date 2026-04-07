import { TripResponse } from "@/types/api";
import { Icon, VStack } from "@chakra-ui/react";
import { HiOutlineMap } from "react-icons/hi";
import TripCard from "./TripCard";
import ShadowBox from "./ShadowBox";

/**
 *
 * @param trips 여행 리스트
 * @param demoKey 데모 키
 * @returns 여행 리스트 컴포넌트
 */
export default function TripList({ trips, demoKey }: { trips: TripResponse[]; demoKey: string }) {
  return (
    <>
      {trips.length === 0 ? (
        <ShadowBox>
          <VStack gap="3">
            <Icon size="2xl" color="blue.400">
              <HiOutlineMap />
            </Icon>
            <p className="font-semibold text-2xl">아직 여행이 없습니다</p>
            <p className="text-gray-500">새 여행을 추가해보세요</p>
          </VStack>
        </ShadowBox>
      ) : (
        <div className="flex max-h-[600px] flex-col gap-2 overflow-auto">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} demoKey={demoKey} />
          ))}
        </div>
      )}
    </>
  );
}
