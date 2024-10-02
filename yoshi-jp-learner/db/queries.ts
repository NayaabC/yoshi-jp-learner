import { cache } from "react";
import db from "./drizzle";
import { auth } from "@clerk/nextjs/server";
import { topics, units, lessons, userProgress, challengeProgress, userSubscription } from "./schema";
import { eq } from "drizzle-orm";
import { compileFunction } from "vm";

export const getTopics = cache(async () => {
    const data = await db.query.topics.findMany();

    return data;
});

export const getTopicById = cache(async (topicId: number) => {
    const data = await db.query.topics.findFirst({
        where: eq(topics.id, topicId),
        with: {
            units: {
                orderBy: (units, { asc }) => [asc(units.order)],
                with: {
                    lessons: {
                        orderBy: (lessons, { asc }) => [asc(lessons.order)],
                    },
                },
            },
        },
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
        orderBy: (units, { asc }) => [asc(units.order)],
        where: eq(units.topicId, userProgress.activeTopicId),
        with: {
            lessons: {
                orderBy: (lessons, { asc }) => [asc(lessons.order)],
                with: {
                    challenges: {
                        orderBy: (challenges, { asc }) => [asc(challenges.order)],
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
            if (
                lesson.challenges.length === 0
            ) {
                return { ...lesson, completed: false};
            }

            const allCompletedChallenges = lesson.challenges.every((challenge) => {
                return challenge.challengeProgress && challenge.challengeProgress.length > 0 && challenge.challengeProgress.every((progress) => progress.completed);
            });

            return { ...lesson, completed: allCompletedChallenges };
        });
        return { ...unit, lessons: lessonsWithCompletedStatus };
    });

    return normalizedData;
});


export const getTopicProgress = cache(async () => {
    const { userId } = await auth();
    const userProgress = await getUserProgress();

    if (!userId || !userProgress?.activeTopicId) {
        return null;
    }

    const unitsInActiveTopic = await db.query.units.findMany({
        orderBy: (units, { asc }) => [asc(units.order)],
        where: eq(units.topicId, userProgress.activeTopicId),
        with: {
            lessons: {
                orderBy: (lessons, { asc }) => [asc(lessons.order)],
                with: {
                    unit: true,
                    challenges: {
                        with: {
                            challengeProgress: {
                                where: eq(challengeProgress.userId, userId),
                            },
                        },
                    },
                },
            },
        },
    });

    const firstUncompletedLesson = unitsInActiveTopic
    .flatMap((unit) => unit.lessons)
    .find((lesson) => {
        return lesson.challenges.some((challenge) => {
            return !challenge.challengeProgress 
            || challenge.challengeProgress.length === 0
            || challenge.challengeProgress.some((progress) => progress.completed === false);
        });
    });
    
    return {
        activeLesson: firstUncompletedLesson,
        activeLessonId: firstUncompletedLesson?.id,
    };
});


export const getLesson = cache(async (id?: number) => {
    const { userId } = await auth();

    if (!userId) {
        return null;
    }

    const topicProgress = await getTopicProgress();

    const lessonId = id || topicProgress?.activeLessonId;

    if (!lessonId) {
        return null;
    }

    const data = await db.query.lessons.findFirst({
        where: eq(lessons.id, lessonId),
        with: {
            challenges: {
                orderBy: (challenges, { asc }) => [asc(challenges.order)],
                with: {
                    challengeOptions: true,
                    challengeProgress: {
                        where: eq(challengeProgress.userId, userId),
                    },
                },
            },
        },
    });

    if (!data || !data.challenges) {
        return null;
    }

    const normalizedChallenges = data.challenges.map((challenge) => {
        const completed = challenge.challengeProgress 
            && challenge.challengeProgress.length > 0 
            && challenge.challengeProgress.every((progress) => progress.completed);

        return { ...challenge, completed };
    });

    return { ...data, challenges: normalizedChallenges};
});


export const getLessonPercentage = cache(async () => {
    const topicProgress = await getTopicProgress();

    if (!topicProgress?.activeLessonId) {
        return 0;
    }

    const lesson = await getLesson(topicProgress.activeLessonId);

    if (!lesson) {
        return 0;
    }

    const completedChallenges = lesson.challenges
        .filter((challenge) => challenge.completed);
    
    const percentage = Math.round(
        (completedChallenges.length / lesson.challenges.length) * 100,
    );

    return percentage;
});

const DAY_IN_MS = 86_400_000;

export const getUserSubscription = cache(async () => {
    const { userId } = await auth();

    if (!userId) return null;

    const data = await db.query.userSubscription.findFirst({
        where: eq(userSubscription.userId, userId),
    });

    if (!data) return null;

    const isActive = data.stripePriceId && data.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();

    return {
        ...data,
        isActive: !!isActive,
    };
});

export const getTopTenUsers = cache(async () => {
    const { userId } = await auth();

    if (!userId) {
        return [];
    }

    const data = await db.query.userProgress.findMany({
        orderBy: (userProgress, { desc }) => [desc(userProgress.points)],
        limit: 10,
        columns: {
            userId: true,
            userName: true,
            userImageSrc: true,
            points: true,
        },  
    });

    return data;
});