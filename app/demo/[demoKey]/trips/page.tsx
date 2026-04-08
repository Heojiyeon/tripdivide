import { Skeleton, Stack } from "@chakra-ui/react";
import { Suspense } from "react";
import TripAddCard from "./_components/TripAddCard";
import TripList from "./_components/TripList";

/**
 *
 * @returns 여행 리스트 페이지
 */
export default async function Trips({ params }: { params: Promise<{ demoKey: string }> }) {
  const { demoKey } = await params;

  return (
    <>
      <div>
        <p className="font-semibold text-3xl">내 여행</p>
        <p className="text-gray-500">여행을 추가하고 지출을 관리하세요.</p>
      </div>
      <TripAddCard demoKey={demoKey} />
      <Suspense
        fallback={
          <div>
            <Stack flex="1">
              <Skeleton height="100px" variant="shine" />
              <Skeleton height="100px" variant="shine" />
              <Skeleton height="100px" variant="shine" />
            </Stack>
          </div>
        }
      >
        <TripList demoKey={demoKey} />
      </Suspense>
    </>
  );
}
