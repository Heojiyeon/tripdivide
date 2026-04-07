import { formatDate } from "@/lib/format";
import { TripResponse } from "@/types/api";
import Link from "next/link";
import { HiChevronDoubleRight, HiOutlineMap } from "react-icons/hi";
import TripStatusTag from "./TripStatusTag";

/**
 *
 * @param trip 여행 정보
 * @returns 여행 정보 카드 컴포넌트
 */
export default function TripCard({ trip, demoKey }: { trip: TripResponse; demoKey: string }) {
  return (
    <Link href={`/demo/${demoKey}/trips/${trip.id}`}>
      <div className="group flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 h-30 transition-all hover:border-gray-300 hover:shadow-lg">
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-xl
              ${trip.status === "OPEN" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"}`}
          >
            <HiOutlineMap className="text-xl" />
          </div>
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-gray-900">{trip.title}</span>
              <TripStatusTag status={trip.status} />
            </div>
            <p className="text-sm text-gray-400">{formatDate(trip.createdAt, true)}</p>
          </div>
        </div>
        <HiChevronDoubleRight className="text-gray-400 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
