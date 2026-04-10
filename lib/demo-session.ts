// lib/demo-session.ts
import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/api-error";
import { ErrorCode } from "@/types/api";

export async function validateDemoSession(demoKey: string) {
  if (!demoKey) {
    return { ok: false as const, response: apiError(ErrorCode.BAD_REQUEST, 400) };
  }

  const demoSession = await prisma.demoSession.findUnique({
    where: { demoKey },
    select: { demoKey: true },
  });

  if (!demoSession) {
    return { ok: false as const, response: apiError(ErrorCode.INVALID_ACCESS, 404) };
  }

  return { ok: true as const };
}
