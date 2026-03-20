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
  participants: {
    id: string;
    name: string;
  }[];
  expenses: {
    id: string;
    title: string;
    amount: number;
    paidBy: {
      id: string;
      name: string;
    };
    splits: {
      id: string;
      name: string;
      shareAmount: number;
    }[];
    createdAt: string;
  }[];
};
