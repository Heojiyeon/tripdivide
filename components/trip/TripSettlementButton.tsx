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
    <>
      <Link href={`/demo/${demoKey}/trips/${tripId}/settlement`}>정산 결과 보기</Link>
    </>
  );
}
