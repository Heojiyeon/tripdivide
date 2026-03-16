import { ErrorCode } from "@/types/api";

export const ErrorMessage: Record<ErrorCode, string> = {
  [ErrorCode.BAD_REQUEST]: "Invalid request",
  [ErrorCode.TRIP_NOT_FOUND]: "Trip not found",
  [ErrorCode.INVALID_SPLIT_SUM]: "Sum of split amounts must equal total amount",
  [ErrorCode.TRIP_ALREADY_SETTLED]: "Trip is already settled",
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
