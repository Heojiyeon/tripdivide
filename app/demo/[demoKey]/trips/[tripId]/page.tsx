import { Suspense } from "react";

import { ApiResponse, TripDetailResponse } from "@/types/api";
import { notFound } from "next/navigation";
import BackButton from "../../../_components/BackButton";
import SettlementNoticeToast from "./_components/SettlementNoticeToast";
import TripDetails from "./_components/TripDetails";
import TripSkeleton from "./_components/TripSkeleton";

/**
 *
 * @returns 여행 상세 정보 페이지
 */
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ demoKey: string; tripId: string }>;
  searchParams: Promise<{ notice?: string }>;
}) {
  const { demoKey, tripId } = await params;
  const { notice } = await searchParams;

  const res = await fetch(`${process.env.API_URL}/api/demo/${demoKey}/trips/${tripId}`, {
    cache: "no-store",
  });

  if (res.status === 404) {
    return notFound();
  }

  const result = await res.json().catch(() => null);

  const { data } = result as ApiResponse<TripDetailResponse>;

  return (
    <>
      <SettlementNoticeToast notice={notice} demoKey={demoKey} tripId={tripId} />
      <div className="w-fit">
        <BackButton fallbackHref={`/demo/${demoKey}/trips`} />
      </div>
      <Suspense fallback={<TripSkeleton />}>
        <TripDetails demoKey={demoKey} tripId={tripId} tripData={data} />
      </Suspense>
    </>
  );
}
