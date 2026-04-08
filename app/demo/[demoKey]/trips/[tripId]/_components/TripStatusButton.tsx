"use client";

import { TripDetailResponse } from "@/types/api";
import { Button } from "@chakra-ui/react";
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
    <>
      <Button
        onClick={handleClickButton}
        size={{ mdDown: "xs", md: "md" }}
        color={isOpen ? "green.700" : "blue.700"}
        bgColor={isOpen ? "green.100" : "blue.100"}
        rounded={"xl"}
      >
        {isOpen ? "정산 확정" : "정산 수정"}
      </Button>
    </>
  );
}
