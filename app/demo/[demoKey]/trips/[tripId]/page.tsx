import ExpenseList from "@/components/expense/ExpenseList";
import ParticipantList from "@/components/participant/ParticipantList";
import { ApiResponse, TripDetailResponse } from "@/types/api";
import { notFound } from "next/navigation";

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
    cache: "no-cache",
  });

  if (!res.ok) return notFound();

  const { data } = (await res.json()) as ApiResponse<TripDetailResponse>;
  const { title, status, createdAt, participants, expenses } = data;

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      {title}
      {status}
      {createdAt}
      <ParticipantList demoKey={demoKey} tripId={tripId} participants={participants} />
      <ExpenseList expenses={expenses} participants={participants} />
    </div>
  );
}
