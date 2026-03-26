import ExpenseList from "@/components/expense/ExpenseList";
import ParticipantList from "@/components/participant/ParticipantList";
import TripStatusButton from "@/components/trip/TripStatusButton";
import { ApiResponse, TripDetailResponse } from "@/types/api";
import { notFound } from "next/navigation";
import { useMemo } from "react";

/**
 *
 * @returns 여행 상세 정보 페이지
 */
export default async function Page({
  params,
}: {
  params: Promise<{ demoKey: string; tripId: string }>;
}) {
  const { demoKey, tripId } = await params;

  const res = await fetch(`${process.env.API_URL}/api/demo/${demoKey}/trips/${tripId}`, {
    cache: "no-store",
  });

  if (!res.ok) return notFound();

  const { data } = (await res.json()) as ApiResponse<TripDetailResponse>;
  const { title, status, participants, expenses } = data;

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="w-full flex justify-around">
        <span>
          {status} | {title}
        </span>
        <TripStatusButton demoKey={demoKey} tripId={tripId} status={status} />
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
}
