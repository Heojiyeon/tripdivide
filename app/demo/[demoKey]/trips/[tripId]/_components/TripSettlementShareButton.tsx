"use client";

import { Button } from "@chakra-ui/react";
import { useState } from "react";

export default function TripSettlementShareButton({
  demoKey,
  tripId,
}: {
  demoKey: string;
  tripId: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const shareLink = `${window.location.origin}/demo/${demoKey}/trips/${tripId}/settlement`;

    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("링크 복사 실패", error);
    }
  };

  return (
    <Button
      size="sm"
      bgColor="blue.500"
      color="white"
      rounded="lg"
      className="relative overflow-hidden"
      onClick={handleCopyLink}
    >
      <span
        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          copied ? "opacity-0 -translate-y-2" : "opacity-100 translate-y-0"
        }`}
      >
        링크 복사
      </span>
      <span
        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          copied ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        복사 완료!
      </span>
      <span className="opacity-0">복사 완료!</span>
    </Button>
  );
}
