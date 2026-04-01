"use client";

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
    <div className="border border-dashed rounded p-6 flex flex-col gap-2 w-fit">
      <form ref={formRef} onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="여행 제목" required />
        <button type="submit">ADD TRIP</button>
      </form>
    </div>
  );
}
