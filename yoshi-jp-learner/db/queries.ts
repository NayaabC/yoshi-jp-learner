import { cache } from "react";
import db from "./drizzle";
import { auth } from "@clerk/nextjs/server";
import { topics, units, userProgress, challengeProgress } from "./schema";
import { eq } from "drizzle-orm";

export const getTopics = cache(async () => {
    const data = await db.query.topics.findMany();

    return data;
});

export const getTopicById = cache(async (topicId: number) => {
    const data = await db.query.topics.findFirst({
        where: eq(topics.id, topicId),
        // TODO: populate units and topics
    });

    return data;
});

export const getUserProgress = cache(async () => {
    const {userId} = await auth();

    if(!userId) {
        return null;
    }

    const data = await db.query.userProgress.findFirst({
        where: eq(userProgress.userId, userId),
        with: {
            activeTopic: true,
        },
    });

    return data;
});


export const getUnits = cache(async () => {
    const { userId } = await auth();
    const userProgress = await getUserProgress();

    if(!userId || !userProgress?.activeTopicId) {
        return [];
    }

    const data = await db.query.units.findMany({
        where: eq(units.topicId, userProgress.activeTopicId),
        with: {
            lessons: {
                with: {
                    challenges: {
                        with: {
                            challengeProgress: {
                                where: eq(challengeProgress.userId, userId)
                            }
                        },
                    },
                },
            },
        },
    });

    // Computationally heavy
    const normalizedData = data.map((unit) => {
        const lessonsWithCompletedStatus = unit.lessons.map((lesson) => {
            const allCompletedChallenges = lesson.challenges.every((challenge) => {
                return challenge.challengeProgress && challenge.challengeProgress.length > 0 && challenge.challengeProgress.every((progress) => progress.completed);
            });

            return { ...lesson, completed: allCompletedChallenges };
        });
        return { ...unit, lessons: lessonsWithCompletedStatus };
    });

    return normalizedData;
});