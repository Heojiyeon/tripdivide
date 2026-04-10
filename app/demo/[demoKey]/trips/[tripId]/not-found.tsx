"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-6">
      <div className="w-full max-w-xl rounded-3xl border border-gray-200 bg-white px-8 py-12 text-center shadow-sm">
        <p className="text-sm font-semibold tracking-[0.2em] text-blue-500">404</p>
        <h1 className="mt-3 text-3xl font-bold text-gray-900">여행 상세 정보를 찾을 수 없어요.</h1>
        <p className="mt-4 text-sm leading-6 text-gray-600">
          주소가 잘못되었거나 삭제된 여행일 수 있어요.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-2">
          <button
            onClick={() => router.back()}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-gray-500 px-5 text-sm font-semibold text-white transition hover:bg-gray-600"
          >
            이전으로 돌아가기
          </button>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-500 px-5 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
