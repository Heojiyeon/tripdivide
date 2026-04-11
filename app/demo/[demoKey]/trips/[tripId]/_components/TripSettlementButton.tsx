"use client";

import { TripDetailResponse } from "@/types/api";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function TripSettlementButton({
  demoKey,
  tripId,
  status,
}: {
  demoKey: string;
  tripId: string;
  status: TripDetailResponse["status"];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (status === "OPEN") return null;

  const handleClick = () => {
    startTransition(() => {
      router.push(`/demo/${demoKey}/trips/${tripId}/settlement?from=trip`);
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="inline-flex items-center rounded-xl border border-gray-200 bg-white p-2 text-xs font-medium text-gray-700 transition hover:border-blue-300 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60 md:p-2.5 md:text-sm"
    >
      {isPending ? "loading..." : "정산 결과"}
    </button>
  );
}
