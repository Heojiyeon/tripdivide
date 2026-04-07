"use client";

import { Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useRef } from "react";

/**
 *
 * @param demoKey 데모 키
 * @returns 여행 추가 카드 컴포넌트
 */
export default function TripAddCard({ demoKey }: { demoKey: string }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    await fetch(`/api/demo/${demoKey}/trips`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: formData.get("title") }),
    });
    formRef.current?.reset();
    router.refresh();
  };

  return (
    <div className="overflow-hidden border-4 border-blue-300 border-dashed rounded-2xl p-6 flex gap-3 bg-blue-50">
      <form ref={formRef} onSubmit={handleSubmit} className="flex w-full gap-3">
        <input
          type="text"
          name="title"
          placeholder="새 여행 이름을 입력하세요"
          required
          className="flex-1 bg-white py-3 h-11 px-5 rounded-lg"
        />

        <Button size="xl" bgColor="blue.400" color="white" rounded="lg" type="submit">
          + 여행 추가
        </Button>
      </form>
    </div>
  );
}
