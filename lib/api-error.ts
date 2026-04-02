import { ErrorCode } from "@/types/api";

export const ErrorMessage: Record<ErrorCode, string> = {
  [ErrorCode.BAD_REQUEST]: "Invalid request",
  [ErrorCode.TRIP_NOT_FOUND]: "Trip not found",
  [ErrorCode.EXPENSE_NOT_FOUND]: "Expense not found",
  [ErrorCode.PARTICIPANT_NOT_FOUND]: "Participant not found",
  [ErrorCode.INVALID_SPLIT_SUM]: "Sum of split amounts must equal total amount",
  [ErrorCode.TRIP_ALREADY_SETTLED]: "Trip is already settled",
  [ErrorCode.SETTLEMENT_NOT_FOUND]: "Settlement not found",
  [ErrorCode.INTERNAL_SERVER_ERROR]: "Internal server error",
};

export function apiError(code: ErrorCode, status: number) {
  return Response.json(
    {
      error: {
        code,
        message: ErrorMessage[code],
      },
    },
    { status },
  );
}
