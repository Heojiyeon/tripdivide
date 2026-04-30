"use client";

import { formatDate } from "@/lib/format";
import { TripDetailResponse } from "@/types/api";

import { HiCheck, HiPencil } from "react-icons/hi";

import { toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import { ChangeEvent, useRef, useState } from "react";
import TripStatusTag from "../../_components/TripStatusTag";
import ExpenseList from "./ExpenseList";
import ParticipantList from "./ParticipantList";
import TripDeleteButton from "./TripDeleteButton";
import TripSettlementButton from "./TripSettlementButton";
import TripStatusButton from "./TripStatusButton";

export default function TripDetails({
  demoKey,
  tripId,
  tripData,
}: {
  demoKey: string;
  tripId: string;
  tripData: TripDetailResponse;
}) {
  const { title, status, createdAt, participants, expenses } = tripData;

  const router = useRouter();
  const titleRef = useRef<HTMLInputElement | null>(null);
  const [currentTitle, setCurrentTitle] = useState(title);

  const canEdit = status === "OPEN";

  const handleClickEditMode = () => {
    if (titleRef.current !== null) {
      titleRef.current.disabled = false;
      titleRef.current.focus();
    }
  };

  const handleSetTitle = (e: ChangeEvent<HTMLInputElement>) => setCurrentTitle(e.target.value);
  const handleClickChangeTitle = async () => {
    try {
      const res = await fetch(`/api/demo/${demoKey}/trips/${tripId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: currentTitle, status }),
      });

      const result = await res.json().catch(() => null);

      if (!res.ok) {
        const message = result?.message ?? "여행 제목 변경 중 오류가 발생했습니다.";

        toaster.create({
          title: "변경 실패",
          description: message,
          type: "error",
        });
        return;
      }

      toaster.create({
        title: "변경 성공",
        description: "여행 제목 변경에 성공했습니다.",
        type: "success",
      });

      router.refresh();
    } catch (error) {
      console.error(error);

      toaster.create({
        title: "추가 실패",
        description: "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col gap-8">
      <div className="w-full flex justify-between">
        <div className="flex flex-col items-start">
          <span className="text-xs text-gray-400">{formatDate(createdAt, true)}</span>
          <div className="flex items-center gap-4">
            <TripStatusTag status={status} />
            <span className="flex text-2xl font-semibold max-w-55">
              <input
                type="text"
                disabled
                value={currentTitle}
                ref={titleRef}
                onChange={handleSetTitle}
              />
              {canEdit ? (
                title === currentTitle ? (
                  <button onClick={handleClickEditMode}>
                    <HiPencil />
                  </button>
                ) : (
                  <button onClick={handleClickChangeTitle}>
                    <HiCheck />
                  </button>
                )
              ) : null}
            </span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <TripDeleteButton demoKey={demoKey} tripId={tripId} />
          <TripStatusButton demoKey={demoKey} tripId={tripId} status={status} />
          <TripSettlementButton demoKey={demoKey} tripId={tripId} status={status} />
        </div>
      </div>
      <ParticipantList
        demoKey={demoKey}
        tripId={tripId}
        participants={participants}
        status={status}
      />
      <ExpenseList
        demoKey={demoKey}
        tripId={tripId}
        expenses={expenses}
        participants={participants}
        status={status}
      />
    </div>
  );
}
