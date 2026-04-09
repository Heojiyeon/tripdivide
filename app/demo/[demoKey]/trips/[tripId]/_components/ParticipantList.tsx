"use client";

import { TripDetailResponse } from "@/types/api";
import { useRouter } from "next/navigation";
import { RefObject, useRef } from "react";
import { HiUsers } from "react-icons/hi";

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

  const canAddParticipant = status === "OPEN" ? true : false;

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
    <div className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
            <HiUsers className="text-lg" />
          </div>

          <div className="min-w-0">
            <p className="mb-2 text-sm font-medium text-gray-500">참여자</p>
            {participants.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {participants.map((participant) => (
                  <span
                    key={participant.id}
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-800"
                  >
                    {participant.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">아직 참여자가 없습니다.</p>
            )}
          </div>
        </div>
        <div className="lg:self-center">
          <AddParticipantForm
            canAddParticipant={canAddParticipant}
            formRef={formRef}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}

const AddParticipantForm = ({
  canAddParticipant,
  formRef,
  handleSubmit,
}: {
  canAddParticipant: boolean;
  formRef: RefObject<HTMLFormElement | null>;
  handleSubmit: (e: React.SubmitEvent<HTMLFormElement>) => Promise<void>;
}) => {
  if (!canAddParticipant) return null;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-2 sm:flex-row lg:w-80 lg:max-w-full"
    >
      <input
        type="text"
        name="name"
        id="participant-name"
        placeholder="참여자 이름을 입력하세요"
        className="h-10 min-w-0 flex-1 rounded-xl border border-gray-300 bg-white px-4 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        required
      />
      <button
        type="submit"
        className="h-10 w-full shrink-0 rounded-xl bg-blue-500 px-4 text-sm font-medium text-white transition hover:bg-blue-600 sm:w-auto"
      >
        추가
      </button>
    </form>
  );
};
