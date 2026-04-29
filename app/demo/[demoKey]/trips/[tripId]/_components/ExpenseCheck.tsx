"use client";

import Modal from "@/components/ui/Modal";
import { toaster } from "@/components/ui/toaster";
import { formatAmount } from "@/lib/format";
import { ExpenseDetailResponse } from "@/types/api";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 *
 * @returns 지출 상세 조회 컴포넌트
 */
export default function ExpenseCheck({
  demoKey,
  tripId,
  resetSelectedExpense,
  selectedExpense,
  canAddExpense,
}: {
  demoKey: string;
  tripId: string;
  resetSelectedExpense: () => void;
  selectedExpense?: ExpenseDetailResponse;
  canAddExpense: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleDeleteExpense = async () => {
    if (!selectedExpense) return;

    try {
      const res = await fetch(
        `/api/demo/${demoKey}/trips/${tripId}/expenses/${selectedExpense.id}`,
        {
          method: "DELETE",
        },
      );

      if (!res.ok) {
        const result = await res.json().catch(() => null);
        const message = result?.message ?? "지출 삭제 중 오류가 발생했습니다.";

        toaster.create({
          title: "지출 삭제 실패",
          description: message,
          type: "error",
        });

        return;
      }

      toaster.create({
        title: "지출 삭제 성공",
        description: "정상 처리 되었습니다.",
        type: "success",
      });

      resetSelectedExpense();
      router.refresh();
    } catch (error) {
      console.error(error);

      toaster.create({
        title: "지출 삭제 실패",
        description: "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        type: "error",
      });
    } finally {
      closeModal();
    }
  };

  if (!selectedExpense) {
    return <div>지출 정보를 선택해 주세요.</div>;
  }

  return (
    <>
      <div className="flex w-full flex-col gap-4">
        {/* 헤더 */}
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <p className="mb-1 text-sm font-medium text-gray-500">지출 정보</p>
          <div className="flex items-center justify-between gap-3">
            <h4 className="text-lg font-semibold text-gray-900">{selectedExpense.title}</h4>
            <span className="shrink-0 text-base font-bold text-gray-900">
              {formatAmount(selectedExpense.amount)}원
            </span>
          </div>
        </div>
        {/* 결제자 */}
        <div className="rounded-xl border border-gray-100 bg-white p-4">
          <p className="mb-2 text-sm font-medium text-gray-500">정산 책임자</p>
          <div className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600">
            {selectedExpense.paidBy?.name}
          </div>
        </div>
        {/* 정산 내용 */}
        <div className="rounded-xl border border-gray-100 bg-white p-4">
          <p className="mb-3 text-sm font-medium text-gray-500">정산 내용</p>
          <div className="flex flex-col gap-2">
            {selectedExpense.splits?.map((split) => (
              <div
                key={split.participant.id}
                className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
              >
                <span className="text-sm font-medium text-gray-700">{split.participant.name}</span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatAmount(split.shareAmount)}원
                </span>
              </div>
            ))}
          </div>
        </div>
        {canAddExpense && (
          <Button
            onClick={openModal}
            size={{ mdDown: "xs", md: "md" }}
            color="white"
            bgColor="red.500"
            rounded={"xl"}
          >
            지출 삭제
          </Button>
        )}
      </div>
      {isOpen && (
        <Modal title="📣 알림" onClose={closeModal}>
          <div className="flex flex-col justify-center items-center gap-6 text-md">
            지출을 정말 삭제하시겠습니까?
            <br />
            삭제된 지출은 복구할 수 없어요.
            <div className="flex justify-center gap-2">
              <Button
                size={{ mdDown: "md", md: "lg" }}
                color={"white"}
                bgColor={"red.500"}
                rounded={"xl"}
                onClick={handleDeleteExpense}
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
