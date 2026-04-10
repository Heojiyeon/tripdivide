import { formatDate } from "@/lib/format";
import { ApiResponse, TripDetailResponse } from "@/types/api";

import { notFound } from "next/navigation";
import { Suspense } from "react";

import TripStatusTag from "../_components/TripStatusTag";
import ExpenseList from "./_components/ExpenseList";
import ParticipantList from "./_components/ParticipantList";
import SettlementNoticeToast from "./_components/SettlementNoticeToast";
import TripSettlementButton from "./_components/TripSettlementButton";
import TripSkeleton from "./_components/TripSkeleton";
import TripStatusButton from "./_components/TripStatusButton";

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

  return (
    <>
      <SettlementNoticeToast notice={notice} demoKey={demoKey} tripId={tripId} />
      <Suspense fallback={<TripSkeleton />}>
        <TripDetails demoKey={demoKey} tripId={tripId} />
      </Suspense>
    </>
  );
}

const TripDetails = async ({ demoKey, tripId }: { demoKey: string; tripId: string }) => {
  const res = await fetch(`${process.env.API_URL}/api/demo/${demoKey}/trips/${tripId}`, {
    cache: "no-store",
  });

  if (res.status === 404) {
    notFound();
  }

  const result = await res.json().catch(() => null);

  const { data } = result as ApiResponse<TripDetailResponse>;
  const { title, status, createdAt, participants, expenses } = data;

  return (
    <div className="min-h-screen flex flex-col gap-8">
      <div className="w-full flex justify-between">
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-semibold">{title}</span>
            <TripStatusTag status={status} />
          </div>
          <span className="text-gray-400">{formatDate(createdAt, true)}</span>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <TripStatusButton demoKey={demoKey} tripId={tripId} status={status} />
          <TripSettlementButton demoKey={demoKey} tripId={tripId} status={status} />
        </div>
      </div>
      <ParticipantList
        demoKey={demoKey}
        tripId={tripId}
        participants={participants}
        status={status}
      />
      <ExpenseList
        demoKey={demoKey}
        tripId={tripId}
        expenses={expenses}
        participants={participants}
        status={status}
      />
    </div>
  );
};
