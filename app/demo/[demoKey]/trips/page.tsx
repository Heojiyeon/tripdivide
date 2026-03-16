import TripList from "@/components/trip/TripList";

/**
 *
 * @returns 여행 리스트 페이지
 */
export default async function Trips({ params }: { params: Promise<{ demoKey: string }> }) {
  const { demoKey } = await params;

  if (!demoKey || demoKey === "undefined") {
    // redirect back or render an error
    return <div>유효하지 않은 demoKey 입니다. 처음 화면으로 돌아가 주세요.</div>;
  }

  const res = await fetch(`${process.env.API_URL}/api/demo/${demoKey}/trips`);
  const { trips } = await res.json();

  return (
    <div>
      <TripList trips={trips} demoKey={demoKey} />
    </div>
  );
}
