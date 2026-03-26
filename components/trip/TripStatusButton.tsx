"use client";

import { TripDetailResponse } from "@/types/api";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export default function TripStatusButton({
  demoKey,
  tripId,
  status,
}: {
  demoKey: string;
  tripId: string;
  status: TripDetailResponse["status"];
}) {
  const router = useRouter();

  const isOpen = useMemo(() => status === "OPEN", [status]);

  const handleClickButton = async () => {
    const changeStatus = isOpen ? "SETTLED" : "OPEN";

    const res = await fetch(`/api/demo/${demoKey}/trips/${tripId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: changeStatus }),
    });

    if (!res.ok) {
      console.error("지출 상세 조회 실패");
      return;
    }

    router.refresh();
  };

  return (
    <button className="p-1 text-blue-500 border border-blue-300" onClick={handleClickButton}>
      {isOpen ? "정산 확정" : "정산 변경"}
    </button>
  );
}
