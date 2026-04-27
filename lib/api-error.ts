import { ErrorCode } from "@/types/api";

export const ErrorMessage: Record<ErrorCode, string> = {
  [ErrorCode.BAD_REQUEST]: "잘못된 요청입니다.",
  [ErrorCode.INVALID_ACCESS]: "유효하지 않은 접근입니다.",
  [ErrorCode.TRIP_NOT_FOUND]: "여행을 찾을 수 없습니다.",
  [ErrorCode.EXPENSE_NOT_FOUND]: "지출 내역을 찾을 수 없습니다.",
  [ErrorCode.PARTICIPANT_NOT_FOUND]: "참여자를 찾을 수 없습니다.",
  [ErrorCode.PARTICIPANT_ALREADY_EXISTED]: "같은 이름의 참여자가 존재합니다.",
  [ErrorCode.PARTICIPANT_HAS_EXPENSE_HISTORY]: "정산에 참여한 참여자는 삭제할 수 없습니다.",
  [ErrorCode.INVALID_SPLIT_SUM]: "분배 금액의 합이 총 지출 금액과 일치하지 않습니다.",
  [ErrorCode.TRIP_ALREADY_SETTLED]: "이미 정산이 완료된 여행입니다.",
  [ErrorCode.SETTLEMENT_NOT_FOUND]: "정산 결과를 찾을 수 없습니다.",
  [ErrorCode.INTERNAL_SERVER_ERROR]: "서버 오류가 발생했습니다.",
};

export function apiError(code: ErrorCode, status: number) {
  return Response.json(
    {
      code,
      message: ErrorMessage[code],
    },
    { status },
  );
}
