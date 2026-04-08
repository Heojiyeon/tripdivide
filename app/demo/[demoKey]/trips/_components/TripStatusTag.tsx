import { Tag } from "@chakra-ui/react";

/**
 *
 * @returns 정산 상태에 따른 태그 컴포넌트
 */
export default function TripStatusTag({ status }: { status: "OPEN" | "SETTLED" }) {
  return (
    <>
      <Tag.Root
        rounded="xl"
        px="3"
        py="1"
        bgColor={status === "OPEN" ? "blue.100" : "green.100"}
        color={status === "OPEN" ? "blue.500" : "green.500"}
      >
        <Tag.Label>{status === "OPEN" ? "진행 중" : "정산 완료"}</Tag.Label>
      </Tag.Root>
    </>
  );
}
