"use client";

import { toaster } from "@/components/ui/toaster";
import { Button, useBreakpointValue } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

/**
 *
 * @param demoKey 데모 키
 * @returns 여행 추가 카드 컴포넌트
 */
export default function TripAddCard({ demoKey }: { demoKey: string }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [loading, setLoading] = useState(false);

  const placeholder = useBreakpointValue({
    sm: "새 여행을 입력하세요",
    base: "새 여행 입력",
  });

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch(`/api/demo/${demoKey}/trips`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: formData.get("title") }),
      });

      const result = await res.json().catch(() => null);

      if (!res.ok) {
        return toaster.create({
          title: "여행 추가 실패",
          description: result?.message ?? "여행 추가 중 오류가 발생했습니다.",
          type: "error",
        });
      }

      formRef.current?.reset();
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
    <div className="overflow-hidden border-4 border-blue-300 border-dashed rounded-2xl p-6 flex bg-blue-50">
      <form ref={formRef} onSubmit={handleSubmit} className="flex items-center w-full gap-3">
        <input
          type="text"
          name="title"
          placeholder={placeholder}
          required
          className="w-full flex-1 bg-white py-3 h-11 px-5 rounded-lg"
        />

        <Button
          size={{ mdDown: "sm", md: "lg" }}
          bgColor="blue.400"
          color="white"
          rounded="lg"
          type="submit"
          loading={loading}
          loadingText="Loading"
          spinnerPlacement="start"
        >
          + 여행 추가
        </Button>
      </form>
    </div>
  );
}
