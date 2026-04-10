import { TripResponse } from "@/types/api";
import { Icon, VStack } from "@chakra-ui/react";
import { HiOutlineMap } from "react-icons/hi";
import TripCard from "./TripCard";
import ShadowBox from "./ShadowBox";
import { notFound } from "next/navigation";

/**
 *
 * @param trips 여행 리스트
 * @param demoKey 데모 키
 * @returns 여행 리스트 컴포넌트
 */
export default async function TripList({ demoKey }: { demoKey: string }) {
  const res = await fetch(`${process.env.API_URL}/api/demo/${demoKey}/trips`, {
    cache: "no-store",
  });

  const result = await res.json().catch(() => null);

  if (res.status === 404) {
    notFound();
  }

  if (!res.ok) {
    return (
      <div className="flex max-h-[600px] flex-col gap-2 overflow-auto">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-600">
          {result?.message ?? "여행 리스트를 불러오지 못했습니다. 잠시 후 다시 시도해주세요."}
        </div>
      </div>
    );
  }

  const trips = result?.data;

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
          {trips.map((trip: TripResponse) => (
            <TripCard key={trip.id} trip={trip} demoKey={demoKey} />
          ))}
        </div>
      )}
    </>
  );
}
