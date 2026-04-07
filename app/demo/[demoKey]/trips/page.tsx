import { notFound } from "next/navigation";
import TripList from "./_components/TripList";
import TripAddCard from "./_components/TripAddCard";

/**
 *
 * @returns 여행 리스트 페이지
 */
export default async function Trips({ params }: { params: Promise<{ demoKey: string }> }) {
  const { demoKey } = await params;

  const res = await fetch(`${process.env.API_URL}/api/demo/${demoKey}/trips`, {
    cache: "no-store",
  });
  if (!res.ok) return notFound();

  const json = await res.json();

  const trips = json?.data ?? [];

  return (
    <>
      <div>
        <p className="font-semibold text-3xl">내 여행</p>
        <p className="text-gray-500">여행을 추가하고 지출을 관리하세요.</p>
      </div>
      <TripAddCard demoKey={demoKey} />
      <TripList trips={trips} demoKey={demoKey} />
    </>
  );
}
