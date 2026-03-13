"use client";

import { useRouter } from "next/navigation";

/**
 *
 * @returns 메인 홈 페이지
 */
export default function Home() {
  const router = useRouter();

  const handleClickDemo시작 = async () => {
    // (1) localStorage 값 확인
    const existedDemoKey = window.localStorage.getItem("demokey");
    if (existedDemoKey) {
      return router.push(`/demo/${existedDemoKey}/trips`);
    }

    // (2) demoKey 생성
    const response = await fetch("/api/demo", {
      method: "POST",
    });
    const { demoKey } = await response.json();

    window.localStorage.setItem("demoKey", demoKey);
    return router.push(`/demo/${demoKey}/trips`);
  };

  return (
    <div className="border border-amber-200 flex justify-center items-center h-screen">
      <button onClick={handleClickDemo시작} className="border border-orange-300 p-2 rounded-2xl">
        DEMO 시작하기
      </button>
    </div>
  );
}
