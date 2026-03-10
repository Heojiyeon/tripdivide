export enum ErrorCode {
    BAD_REQUEST = "BAD_REQUEST",
    TRIP_NOT_FOUND = "TRIP_NOT_FOUND",
    INVALID_SPLIT_SUM = "INVALID_SPLIT_SUM",
    TRIP_ALREADY_SETTLED = "TRIP_ALREADY_SETTLED",
  }

  export type CreateTripRequest = {
    title: string
  }
  
  export type TripResponse = {
    id: string
    title: string
    status: "OPEN" | "SETTLED"
    createdAt: string
  }