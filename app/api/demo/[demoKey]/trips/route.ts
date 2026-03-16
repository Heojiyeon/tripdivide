import { apiError } from "@/lib/api-error";
import { prisma } from "@/lib/prisma";
import { ErrorCode } from "@/types/api";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * GET /demo/:demokey/trips (여행 리스트 조회)
 *
 * demoKey 파라미터
 * @returns Trip[]
 */
export async function GET(request: Request, { params }: { params: Promise<{ demoKey: string }> }) {
  const { demoKey } = await params;
  if (!demoKey) return apiError(ErrorCode.BAD_REQUEST, 400);

  const trips = await prisma.trip.findMany({
    where: {
      demoKey: demoKey,
    },
  });

  return Response.json({ trips });
}

/**
 * POST /demo/:demoKey/trips (여행 리스트 추가)
 *
 * demoKey 파라미터
 * return Trip
 */
export async function POST(request: Request, { params }: { params: Promise<{ demoKey: string }> }) {
  const { demoKey } = await params;
  if (!demoKey) return apiError(ErrorCode.BAD_REQUEST, 400);

  const formData = await request.formData();
  const title = formData.get("title");

  if (typeof title !== "string" || !title.trim()) {
    return Response.json(
      {
        error: {
          code: "BAD_REQUEST",
          message: "invalid input",
        },
      },
      { status: 400 },
    );
  }

  await prisma.trip.create({
    data: {
      demoKey,
      title,
    },
  });

  revalidatePath(`/demo/${demoKey}/trips`);
  redirect(`/demo/${demoKey}/trips`);
}
