"use client";

import { TripDetailResponse } from "@/types/api";
import { useRouter } from "next/navigation";
import { RefObject, useRef, useState } from "react";
import { HiUsers } from "react-icons/hi";

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
  const [loading, setLoading] = useState(false);

  const canAddParticipant = status === "OPEN";

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      await fetch(`/api/demo/${demoKey}/trips/${tripId}/participants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.get("name") }),
      });

      formRef.current?.reset();
      router.refresh();
    } finally {
      setLoading(false);
    }
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
            loading={loading}
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
  loading,
}: {
  canAddParticipant: boolean;
  formRef: RefObject<HTMLFormElement | null>;
  handleSubmit: (e: React.SubmitEvent<HTMLFormElement>) => Promise<void>;
  loading: boolean;
}) => {
  if (!canAddParticipant) return null;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex w-full gap-3 lg:w-auto lg:min-w-[420px]"
    >
      <input
        type="text"
        name="name"
        id="participant-name"
        placeholder="참여자 이름을 입력하세요"
        disabled={loading}
        className="h-10 flex-1 rounded-xl border border-gray-300 bg-white px-4 text-sm outline-none transition disabled:bg-gray-100"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="h-10 shrink-0 rounded-xl bg-blue-500 px-4 text-sm font-medium text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300"
      >
        {loading ? "loading..." : "추가"}
      </button>
    </form>
  );
};
