import { Skeleton } from "@chakra-ui/react";

export default function TripSkeleton() {
  return (
    <div className="min-h-screen flex flex-col gap-8">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-40 rounded-md" />
          <Skeleton className="h-4 w-24 rounded-md" />
        </div>
        <Skeleton className="h-10 w-full sm:w-28 rounded-lg" />
      </div>
      <Skeleton className="h-28 w-full rounded-2xl" />
      <Skeleton className="h-[400px] w-full rounded-2xl" />
    </div>
  );
}
