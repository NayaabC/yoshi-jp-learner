"use server";

import db from "@/db/drizzle";
import { getTopicById, getUserProgress } from "@/db/queries";
import { userProgress } from "@/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const upsertUserProgress = async (topicId: number) => {
    const { userId } = await auth();
    const user = await currentUser();

    if(!userId || !user){
        throw new Error("Unauthorized");
    }

    const topic = await getTopicById(topicId);

    if(!topic) {
        throw new Error("Topic not found");
    }
    

    // TODO: Enable once units and lessons are added
    // if(!topic.units.length || !topic.units[0].lessons.length) {
    //     throw new Error("Topic is empty");
    // }

    const existingUserProgress = await getUserProgress();

    if(existingUserProgress) {
        await db.update(userProgress).set({
            activeTopicId: topicId,
            userName: user.firstName || "User",
            userImageSrc: user.imageUrl || "/yoshKanji.svg"
        });

        revalidatePath("/topics");
        revalidatePath("/learn");
        redirect("/learn");
    }

    await db.insert(userProgress).values({
        userId,
        activeTopicId: topicId,
        userName: user.firstName || "User",
        userImageSrc: user.imageUrl || "/yoshKanji.svg"
    });

    revalidatePath("/topics");
    revalidatePath("/learn");
    redirect("/learn");
}