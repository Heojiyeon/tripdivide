import Modal from "@/components/ui/Modal";
import { ApiResponse, SettlementResponse } from "@/types/api";
import { redirect } from "next/navigation";
import TripSettlementContent from "../_components/TripSettlementContent";

export default async function Settlement({
  params,
  searchParams,
}: {
  params: Promise<{ demoKey: string; tripId: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { demoKey, tripId } = await params;
  const { from } = await searchParams;
  const closeHref = from === "trip" ? `/demo/${demoKey}/trips/${tripId}` : "/";

  const res = await fetch(`${process.env.API_URL}/api/demo/${demoKey}/trips/${tripId}/settlement`);

  if (res.status === 404) {
    redirect(`/demo/${demoKey}/trips/${tripId}?notice=settlement-not-found`);
  }

  const result = await res.json().catch(() => null);

  if (!res.ok) {
    return (
      <Modal title="📃 정산 결과서" closeHref={closeHref}>
        <div className="flex flex-col gap-6 text-sm text-gray-600">
          정산 결과를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
        </div>
      </Modal>
    );
  }
  const { data } = result as ApiResponse<SettlementResponse>;

  return (
    <Modal title="📃 정산 결과서" closeHref={closeHref}>
      <TripSettlementContent demoKey={demoKey} tripId={tripId} data={data} />
    </Modal>
  );
}
