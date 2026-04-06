import TripList from "@/components/trip/TripList";
import { notFound } from "next/navigation";

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
  console.log("API response:", JSON.stringify(json));

  const trips = json?.data ?? [];

  return (
    <div className="flex h-screen justify-center items-center">
      <TripList trips={trips} demoKey={demoKey} />
    </div>
  );
}
