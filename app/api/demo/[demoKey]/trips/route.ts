import { apiError } from "@/app/lib/error";
import { prisma } from "@/app/lib/prisma";
import {  ErrorCode } from "@/app/types/api";

/**
 * GET /demo/:demokey/trips (여행 리스트 조회)
 * 
 * demoKey 파라미터
 * @returns Trip[] 
 */
export async function GET(request: Request, {params}: {params: Promise<{ demoKey: string }>}) {

    const { demoKey } = await params;
    if(!demoKey) return apiError(ErrorCode.BAD_REQUEST, 400)

    const trips = await prisma.trip.findMany({
        where: {
            demoKey: demoKey
        }
    });

    return Response.json({ trips });
}

/**
 * POST /demo/:demoKey/trips (여행 리스트 추가)
 * 
 * demoKey 파라미터
 * return Trip
 */
export async function POST(request: Request, {params}: {params: Promise<{ demoKey: string }>}) {
    const { demoKey } = await params;
    if(!demoKey) return apiError(ErrorCode.BAD_REQUEST, 400)

    const { title } = await request.json();

    if(!title?.trim()) return apiError(ErrorCode.BAD_REQUEST, 400)

    const trip = await prisma.trip.create({
        data: {
            demoKey,
            title,
        }
    })


    return Response.json({ trip });

}