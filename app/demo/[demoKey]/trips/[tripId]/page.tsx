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

  const { trip } = await res.json();

  return (
    <div>
      {trip.title}
      {trip.OPEN}
      {trip.createdAt}
    </div>
  );
}
