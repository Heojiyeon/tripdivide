import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
      <div className="w-full max-w-xl rounded-3xl border border-gray-200 bg-white px-8 py-12 text-center shadow-sm">
        <p className="text-sm font-semibold tracking-[0.2em] text-blue-500">404</p>
        <h1 className="mt-3 text-3xl font-bold text-gray-900">
          요청하신 여행 목록을
          <br />
          찾을 수 없어요.
        </h1>
        <p className="mt-4 text-sm leading-6 text-gray-600">홈으로 돌아가 다시 시도해주세요.</p>
        <div className="mt-8 flex justify-center">
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
