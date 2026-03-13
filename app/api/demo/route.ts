import { prisma } from "@/app/lib/prisma";

export async function POST() {
  const session = await prisma.demoSession.create({
    data: {},
  });

  return Response.json(
    {
      demoKey: session.demoKey,
    },
    { status: 201 },
  );
}
