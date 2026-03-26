export type ApiResponse<T> = {
  data: T;
};

export type ApiErrorResponse = {
  error: {
    code: string;
    message: string;
  };
};

export enum ErrorCode {
  BAD_REQUEST = "BAD_REQUEST",
  TRIP_NOT_FOUND = "TRIP_NOT_FOUND",
  INVALID_SPLIT_SUM = "INVALID_SPLIT_SUM",
  TRIP_ALREADY_SETTLED = "TRIP_ALREADY_SETTLED",
  SETTLEMENT_NOT_FOUND = "SETTLEMENT_NOT_FOUND",
}

export type CreateTripRequest = {
  title: string;
};

export type TripResponse = {
  id: string;
  title: string;
  status: "OPEN" | "SETTLED";
  createdAt: string;
};

export type TripDetailResponse = {
  id: string;
  title: string;
  status: "OPEN" | "SETTLED";
  createdAt: string;
  participants: Participant[];
  expenses: Expense[];
};

export type Participant = {
  id: string;
  name: string;
};

export type Expense = {
  id: string;
  title?: string;
  amount: number;
  paidBy?: {
    id: string;
    name: string;
  };
  splits?: {
    id: string;
    name: string;
    shareAmount: number;
  }[];
  createdAt: string;
};

export type ExpenseDetailResponse = {
  amount: number;
  createdAt: string;
  id: string;
  paidBy: { id: string; name: string };
  paidById: string;
  splits: { participant: { id: string; name: string }; shareAmount: number }[];
  title: string;
  tripId: string;
};
