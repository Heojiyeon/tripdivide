"use client";

import { toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function SettlementNoticeToast({
  notice,
  demoKey,
  tripId,
}: {
  notice?: string;
  demoKey: string;
  tripId: string;
}) {
  const router = useRouter();
  const shownRef = useRef(false);

  useEffect(() => {
    if (shownRef.current || notice !== "settlement-not-found") return;

    shownRef.current = true;

    toaster.create({
      title: "정산 결과를 찾을 수 없어요",
      description: "아직 확인할 수 있는 정산 결과가 없습니다.",
      type: "info",
    });

    router.replace(`/demo/${demoKey}/trips/${tripId}`);
  }, [demoKey, notice, router, tripId]);

  return null;
}
