"use client";

import { toaster } from "@/components/ui/toaster";
import { TripDetailResponse } from "@/types/api";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

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
  const [loading, setLoading] = useState(false);
  const isOpen = useMemo(() => status === "OPEN", [status]);

  const handleClickButton = async () => {
    setLoading(true);
    const changeStatus = isOpen ? "SETTLED" : "OPEN";

    try {
      const res = await fetch(`/api/demo/${demoKey}/trips/${tripId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: changeStatus }),
      });
      const result = await res.json().catch(() => null);

      if (!res.ok) {
        const message = result?.message ?? "정산 확정 중 오류가 발생했습니다.";

        toaster.create({
          title: "정산 실패",
          description: message,
          type: "error",
        });
      }

      router.refresh();
    } catch (error) {
      console.error(error);

      toaster.create({
        title: "추가 실패",
        description: "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleClickButton}
        size={{ mdDown: "xs", md: "md" }}
        color={isOpen ? "green.700" : "blue.700"}
        bgColor={isOpen ? "green.100" : "blue.100"}
        rounded={"xl"}
        loading={loading}
        loadingText="loading..."
      >
        {isOpen ? "정산 확정" : "정산 수정"}
      </Button>
    </>
  );
}
