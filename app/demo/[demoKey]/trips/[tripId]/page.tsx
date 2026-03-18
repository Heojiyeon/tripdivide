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
  if (!demoKey || demoKey === "undefined") {
    return <div>유효하지 않은 demoKey 입니다. 처음 화면으로 돌아가 주세요.</div>;
  }

  const res = await fetch(`${process.env.API_URL}/api/demo/${demoKey}/trips/${tripId}`, {
    cache: "no-cache",
  });

  if (!res.ok) notFound();

  const { trip } = await res.json();

  return (
    <div>
      {trip.title}
      {trip.OPEN}
      {trip.createdAt}
    </div>
  );
}
