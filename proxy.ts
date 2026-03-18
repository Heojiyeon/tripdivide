import { NextRequest, NextResponse } from "next/server";

/**
 *
 * @returns Proxy
 */
export async function proxy(request: NextRequest) {
  const [, , demoKey, , tripId] = request.nextUrl.pathname.split("/");

  if (!demoKey || demoKey === "undefined") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (tripId === "undefined") {
    return NextResponse.redirect(new URL(`/demo/${demoKey}/trips`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/demo/:demoKey", "/demo/:demoKey/trips/:tripId"],
};
