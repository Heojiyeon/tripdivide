"use client";

import { TripDetailResponse } from "@/types/api";
import { useRouter } from "next/navigation";
import { useMemo, useRef } from "react";

/**
 *
 * @param demoKey 데모 키
 * @param tripId 여행 아이디
 * @param participants 참여자 데이터
 * @returns 참여자 리스트 컴포넌트
 */
export default function ParticipantList({
  demoKey,
  tripId,
  participants,
  status,
}: {
  demoKey: string;
  tripId: string;
  participants: TripDetailResponse["participants"];
  status: TripDetailResponse["status"];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const canAddParticipant = useMemo(() => (status === "OPEN" ? true : false), [status]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    await fetch(`/api/demo/${demoKey}/trips/${tripId}/participants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: formData.get("name") }),
    });

    formRef.current?.reset();
    router.refresh();
  };

  return (
    <div className="flex">
      여행 참여 인원 |&nbsp;
      {participants.map((participant, idx) => (
        <div key={idx} className="font-semibold">
          {participant.name}&nbsp;
        </div>
      ))}
      {canAddParticipant && (
        <form ref={formRef} onSubmit={handleSubmit}>
          <input type="text" name="name" id="participant-name" placeholder="참여자 추가" required />
          <button type="submit">+</button>
        </form>
      )}
    </div>
  );
}
