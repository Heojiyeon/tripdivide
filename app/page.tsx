"use client";

import { toaster } from "@/components/ui/toaster";
import { ensureMinDelay } from "@/lib/format";
import { Badge, Button, Card, Icon, VStack } from "@chakra-ui/react";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { HiCalculator, HiLightBulb, HiOutlinePaperAirplane, HiUsers } from "react-icons/hi";

/**
 * @returns 메인 홈 페이지
 */
export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClickDemo시작 = async () => {
    setLoading(true);
    const start = Date.now();

    try {
      // (1) localStorage 값 확인
      const existedDemoKey = window.localStorage.getItem("demoKey");
      if (existedDemoKey === "") {
        window.localStorage.removeItem("demoKey");

        toaster.create({
          title: "데모 정보 복구",
          description: "저장된 데모 정보가 유효하지 않아 새로 시작합니다.",
          type: "info",
        });
      }

      if (existedDemoKey) {
        await ensureMinDelay(start);
        return router.push(`/demo/${existedDemoKey}/trips`);
      }

      // (2) demoKey 생성
      const res = await fetch("/api/demo", {
        method: "POST",
      });
      const result = await res.json().catch(() => null);

      if (!res.ok) {
        return toaster.create({
          title: "데모 시작 실패",
          description: result?.message ?? "데모 시작 중 오류가 발생했습니다.",
          type: "error",
        });
      }

      const demoKey = result?.demoKey;

      window.localStorage.setItem("demoKey", demoKey);

      await ensureMinDelay(start);
      return router.push(`/demo/${demoKey}/trips`);
    } catch (error) {
      console.error(error);

      toaster.create({
        title: "추가 실패",
        description: "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <section className="flex flex-col items-center justify-center px-4 py-21 text-center sm:py-32">
        <VStack gap="9">
          <Badge backgroundColor="blue.100" size="lg" rounded="2xl">
            <HiOutlinePaperAirplane /> 여행 정산의 기준
          </Badge>
          <div className="text-3xl/snug sm:text-4xl/normal font-bold">
            <p>복잡한 여행 정산</p>
            <p className="text-blue-500">한 번에 깔끔하게</p>
          </div>
          <span className="text-center text-lg sm:text-xl text-gray-600">
            여행에서 발생한 지출을 입력하면,
            <br />
            참여자 분배와 최소 송금 관계를 <br className="sm:hidden block" />
            계산해드립니다.
          </span>
          <Button
            onClick={handleClickDemo시작}
            fontSize={{ smDown: "lg", base: "xl" }}
            padding="6"
            rounded="2xl"
            backgroundColor="blue.500"
            color="white"
            loading={loading}
            loadingText="Loading"
            spinnerPlacement="start"
          >
            데모 시작하기 ➡️
          </Button>
        </VStack>
      </section>
      <section className="border-t border-gray-300 bg-card px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center text-2xl font-bold text-foreground sm:text-3xl">
            이렇게 사용하세요
          </div>
          <div className="grid w-full gap-6 justify-items-center md:grid-cols-3">
            {HOW_TO_USE.map((step, idx) => (
              <Card.Root key={idx} width={{ base: "100%", md: "250px" }} minHeight="200px">
                <Card.Body alignItems="center" gap="2" bgColor="gray.100">
                  <Card.Header>
                    <Icon size="2xl" color="blue.500">
                      {step.icon}
                    </Icon>
                  </Card.Header>
                  <Card.Title>{step.title}</Card.Title>
                  <Card.Description textAlign="center">{step.description}</Card.Description>
                </Card.Body>
              </Card.Root>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const HOW_TO_USE = [
  {
    icon: <HiUsers />,
    title: "참여자 등록",
    description: (
      <>
        여행에 함께한 친구를 추가하세요.
        <br />
        본인은 자동으로 등록됩니다.
      </>
    ),
  },
  {
    icon: <HiCalculator />,
    title: "지출 기록",
    description: (
      <>
        누구와 함께 지출을 분담했는지
        <br />
        간편하게 기록하세요.
      </>
    ),
  },
  {
    icon: <HiLightBulb />,
    title: "정산 완료",
    description: <>최소한의 송금 관계를 확인해보세요.</>,
  },
] as const;
