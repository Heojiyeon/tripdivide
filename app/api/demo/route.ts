import { prisma } from "@/lib/prisma";

/**
 * POST /demo/:demokey (데모키 생성)
 *
 * @returns demoKey
 */
export async function POST() {
  const session = await prisma.demoSession.create({
    data: {},
  });

  return Response.json(
    {
      data: { demoKey: session.demoKey },
    },
    { status: 201 },
  );
}
