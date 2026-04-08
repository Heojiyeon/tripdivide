import ParticipantList from "@/app/demo/[demoKey]/trips/[tripId]/_components/ParticipantList";
import TripSettlementButton from "@/app/demo/[demoKey]/trips/[tripId]/_components/TripSettlementButton";
import TripStatusButton from "@/app/demo/[demoKey]/trips/[tripId]/_components/TripStatusButton";
import { formatDate } from "@/lib/format";
import { ApiResponse, TripDetailResponse } from "@/types/api";
import { notFound } from "next/navigation";
import TripStatusTag from "../_components/TripStatusTag";
import ExpenseList from "./_components/ExpenseList";

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
}
