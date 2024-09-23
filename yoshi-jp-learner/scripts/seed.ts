import "dotenv/config";

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);

//@ts-ignore
const db = drizzle(sql, { schema });

const main = async () => {
    try {
        console.log("Seeding database");

        await db.delete(schema.topics);
        await db.delete(schema.userProgress);
        await db.delete(schema.units);
        await db.delete(schema.lessons);
        await db.delete(schema.challenges);
        await db.delete(schema.challengeOptions);
        await db.delete(schema.challengeProgress);

        await db.insert(schema.topics).values([
            {
                id: 1,
                title: "Kana",
                imageSrc: "/chikara.svg",
            },
            {
                id: 2,
                title: "Radicals",
                imageSrc: "/gaku.svg",
            },
            {
                id: 3,
                title: "Search",
                imageSrc: "/book.svg",
            },
            {
                id: 4,
                title: "Draw",
                imageSrc: "/drawing-tool.svg",
            },
            {
                id: 5,
                title: "Random",
                imageSrc: "/random.svg",
            }
        ]);

        await db.insert(schema.units).values([
            {
                id: 1,
                topicId: 1,
                title: "Unit 1",
                description: "Learn the basics of the Japanese Language",
                order: 1,
            }
        ]);

        await db.insert(schema.lessons).values([
            {
                id: 1,
                unitId: 1,  // Unit 1
                order: 1,
                title: "Hiragana - Basics",
            },
            {
                id: 2,
                unitId: 1,  // Unit 1
                order: 2,
                title: "Hiragana - Diactrics",
            },
            {
                id: 3,
                unitId: 1,  // Unit 1
                order: 3,
                title: "Hiragana - Diagraphs",
            },
            {
                id: 4,
                unitId: 1,  // Unit 1
                order: 4,
                title: "Hiragana - Diagraphs + Diactrics",
            }
        ]);

        await db.insert(schema.challenges).values([
            {
                id: 1,
                lessonId: 1,
                type: "SELECT",
                order: 1,
                question: 'Which one of these characters represents "a"',
            }
        ]);

        await db.insert(schema.challengeOptions).values([
            {
                id: 1,
                challengeId: 1,
                imageSrc: '/a.svg',
                correct: true,
                text: 'あ',
                audioSrc: '/a.mp3',
            },
            {
                id: 2,
                challengeId: 1,
                imageSrc: '/o.svg',
                correct: false,
                text: 'お',
                audioSrc: '/o.mp3',
            },
            {
                id: 3,
                challengeId: 1,
                imageSrc: '/e.svg',
                correct: false,
                text: 'え',
                audioSrc: '/e.mp3',
            },
        ])

        console.log("Seeding finished");
    } catch (error) {
        console.error(error);
        throw new Error("Failed to seed the database");
    }
};

main();
