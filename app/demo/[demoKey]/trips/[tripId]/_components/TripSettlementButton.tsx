"use client";

import { TripDetailResponse } from "@/types/api";
import Link from "next/link";
import { useMemo } from "react";

export default function TripSettlementButton({
  demoKey,
  tripId,
  status,
}: {
  demoKey: string;
  tripId: string;
  status: TripDetailResponse["status"];
}) {
  const isOpen = useMemo(() => status === "OPEN", [status]);

  if (isOpen) return null;

  return (
    <Link
      href={`/demo/${demoKey}/trips/${tripId}/settlement`}
      className="inline-flex h-10 items-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition hover:border-blue-300 hover:text-blue-600"
    >
      정산 결과 보기
    </Link>
  );
}
