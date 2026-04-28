"use client";

import Modal from "@/components/ui/Modal";
import { toaster } from "@/components/ui/toaster";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TripDeleteButton({ demoKey, tripId }: { demoKey: string; tripId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleDeleteTrip = async () => {
    try {
      const res = await fetch(`/api/demo/${demoKey}/trips/${tripId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const result = await res.json().catch(() => null);
        const message = result?.message ?? "여행 삭제 중 오류가 발생했습니다.";

        toaster.create({
          title: "여행 삭제 실패",
          description: message,
          type: "error",
        });

        return;
      }

      toaster.create({
        title: "여행 삭제 성공",
        description: "정상 처리 되었습니다.",
        type: "success",
      });

      router.replace(`/demo/${demoKey}/trips`);
    } catch (error) {
      console.error(error);

      toaster.create({
        title: "여행 삭제 실패",
        description: "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        type: "error",
      });
    } finally {
      closeModal();
    }
  };

  return (
    <>
      <Button
        onClick={openModal}
        size={{ mdDown: "xs", md: "md" }}
        color="white"
        bgColor="red.500"
        rounded={"xl"}
      >
        정산 삭제
      </Button>
      {isOpen && (
        <Modal title="📣 알림" onClose={closeModal}>
          <div className="flex flex-col justify-center items-center gap-6 text-md">
            여행을 정말 삭제하시겠습니까?
            <br />
            삭제된 여행은 복구할 수 없어요.
            <div className="flex justify-center gap-2">
              <Button
                size={{ mdDown: "md", md: "lg" }}
                color={"white"}
                bgColor={"red.500"}
                rounded={"xl"}
                onClick={handleDeleteTrip}
              >
                삭제
              </Button>
              <Button
                size={{ mdDown: "md", md: "lg" }}
                bgColor={"gray.200"}
                rounded={"xl"}
                onClick={closeModal}
              >
                닫기
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
