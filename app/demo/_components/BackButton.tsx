"use client";

import { Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { HiArrowLeft } from "react-icons/hi";

export default function BackButton({ fallbackHref }: { fallbackHref?: string }) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    if (fallbackHref) {
      router.replace(fallbackHref);
    }
  };

  return (
    <Button p={0} mt={3} onClick={handleBack} aria-label="뒤로가기">
      <HiArrowLeft />
    </Button>
  );
}
