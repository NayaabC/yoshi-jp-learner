import db from "@/db/drizzle"
import { topics } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server";

export const GET = async (
    req: Request,
    { params }: { params: { topicId: number}},
) => {

    if (!isAdmin()) {
        return new NextResponse("Unauthorized", { status: 403 });
    }

    const data = await db.query.topics.findFirst({
        where: eq(topics.id, params.topicId),
    });

    return NextResponse.json(data);
};

export const PUT = async (
    req: Request,
    { params }: { params: { topicId: number}},
) => {

    if (!isAdmin()) {
        return new NextResponse("Unauthorized", { status: 403 });
    }

    const body = await req.json();

    const data = await db.update(topics).set({
        ...body,
    }).where(eq(topics.id, params.topicId)).returning();

    return NextResponse.json(data[0]);
};

export const DELETE = async (
    req: Request,
    { params }: { params: { topicId: number}},
) => {

    if (!isAdmin()) {
        return new NextResponse("Unauthorized", { status: 403 });
    }


    const data = await db.delete(topics)
        .where(eq(topics.id, params.topicId)).returning();

    return NextResponse.json(data[0]);
};