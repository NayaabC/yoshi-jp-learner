import "dotenv/config";

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);

//@ts-ignore
const db = drizzle(sql, { schema });

type CharIterator = (str: string) => void;


const hiragana = [
    "あいうえお",
    "かきくけこ",
    "さしすせそ",
    "たちつてと",
    "なにぬねの",
    "はひふへほ",
    "まみむめも",
    "やいゆえよ",
    "らりるれろ",
    "わいうえをん"
];

const katakana = [
    "アイウエオ",
    "カキクケコ",
    "サシスセソ",
    "タチツテト",
    "ナニヌネノ",
    "ハヒフヘホ",
    "マミムメモ",
    "ヤイユエヨ",
    "ラリルレロ",
    "ワイウエヲン"
];

const kanaTranslations = [
    ["a", "i", "u", "e", "o"],
    ["ka", "ki", "ku", "ke", "ko"],
    ["sa", "shi", "su", "se", "so"],
    ["ta", "chi", "tsu", "te", "to"],
    ["na", "ni", "nu", "ne", "no"],
    ["ha", "hi", "fu", "he", "ho"],
    ["ma", "mi", "mu", "me", "mo"],
    ["ya", "i", "yu", "e", "yo"],
    ["ra", "ri", "ru", "re", "ro"],
    ["wa", "i", "u", "e", "wo", "n"]
];

const kanaBasics = [hiragana, katakana];


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
        await db.delete(schema.userSubscription);

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
                description: "Hiragana Basics",
                order: 1,
            },
            {
                id: 2,
                topicId: 1,
                title: "Unit 2",
                description: "Katakana Basics",
                order: 2
            }
        ]);

        // Test for adding lessons to Kana Basics Units
        let countLessons: number = 0;
        let countChallenges: number = 0;
        for(let i = 0; i < kanaBasics.length; i++){
            for(let j = 0; j < kanaBasics[i].length; j++) {
                let text : string = "";
                switch(j) {
                    case 0:
                        break;
                    case 1:
                        text = "(k-)";
                        break;
                    case 2:
                        text = "(s-)";
                        break;
                    case 3:
                        text = "(t-, ch-)";
                        break;
                    case 4:
                        text = "(n-)";
                        break;
                    case 5:
                        text = "(h-, f-)";
                        break;
                    case 6:
                        text = "(m-)";
                        break;
                    case 7:
                        text = "(y-, i-, e-)";
                        break;
                    case 8:
                        text = "(r-)";
                        break;
                    case 9:
                        text = "(w- + more)";
                        break;
                    default:
                        text = "";
                        break;
                };
    
                // Add Hiragana and Katakana Lessons for Units 1 and 2
                await db.insert(schema.lessons).values([
                    {
                        id: countLessons + 1,
                        order: countLessons + 1,
                        unitId: (i == 0) ? 1 : 2,
                        title: (i == 0) ? `Hirigana Basics ${text}` : `Katakana Basics ${text}`
                    }
                ]);
                
                for(let k = 0; k < kanaBasics[i][j].length; k++){
                    let lessonType  = ((countChallenges + 1) % 2 === 0) ? "SELECT" : "ASSIST";
                    let questionDesc = (lessonType === "SELECT") ? `Which one of these characters represents "${kanaTranslations[j][k]}"` : kanaBasics[i][j][k];
    
                    // Add Hiragana and Katakana Challenges for Units 1 and 2
                    // Alternate between SELECT and ASSIST Types -> choose Japanese Translation or English Translation
                    await db.insert(schema.challenges).values([
                        {
                            id: countChallenges + 1,
                            order: countChallenges + 1,
                            lessonId: countLessons + 1,
                            type: ((countChallenges + 1) % 2 === 0) ? "SELECT" : "ASSIST",
                            question: questionDesc
                        }
                    ]);
                    countChallenges++;
                }
                countLessons++;
            }
        }

        // Unit 1 Lesson 1 - Hiragana basics
        // await db.insert(schema.challenges).values([
        //     {
        //         id: 1,
        //         lessonId: 1,
        //         type: "SELECT",
        //         order: 1,
        //         question: 'Which one of these characters represents "a"',
        //     },
        //     {
        //         id: 2,
        //         lessonId: 1,
        //         type: "ASSIST",
        //         order: 2,
        //         question: '"a"',
        //     },
        //     {
        //         id: 3,
        //         lessonId: 1,
        //         type: "SELECT",
        //         order: 3,
        //         question: 'Which one of these characters represent "o"',
        //     }
        // ]);

        
        await db.insert(schema.challengeOptions).values([
            {
                challengeId: 1,
                imageSrc: '/a.svg',
                correct: true,
                text: 'あ',
                audioSrc: '/a.mp3',
            },
            {
                challengeId: 1,
                imageSrc: '/o.svg',
                correct: false,
                text: 'お',
                audioSrc: '/o.mp3',
            },
            {
                challengeId: 1,
                imageSrc: '/e.svg',
                correct: false,
                text: 'え',
                audioSrc: '/e.mp3',
            },
            {
                challengeId: 2,
                correct: true,
                text: 'あ',
                audioSrc: '/a.mp3',
            },
            {
                challengeId: 2,
                correct: false,
                text: 'お',
                audioSrc: '/o.mp3',
            },
            {
                challengeId: 2,
                correct: false,
                text: 'え',
                audioSrc: '/e.mp3',
            },
            {
                challengeId: 3,
                imageSrc: '/a.svg',
                correct: false,
                text: 'あ',
                audioSrc: '/a.mp3',
            },
            {
                challengeId: 3,
                imageSrc: '/o.svg',
                correct: true,
                text: 'お',
                audioSrc: '/o.mp3',
            },
            {
                challengeId: 3,
                imageSrc: '/e.svg',
                correct: false,
                text: 'え',
                audioSrc: '/e.mp3',
            },
        ]);

        // Hiragana with diactrics
        // await db.insert(schema.challenges).values([
        //     {
        //         id: 4,
        //         lessonId: 2,
        //         type: "SELECT",
        //         order: 1,
        //         question: 'Which one of these characters represents "a"',
        //     },
        //     {
        //         id: 5,
        //         lessonId: 2,
        //         type: "ASSIST",
        //         order: 2,
        //         question: '"a"',
        //     },
        //     {
        //         id: 6,
        //         lessonId: 2,
        //         type: "SELECT",
        //         order: 3,
        //         question: 'Which one of these characters represent "o"',
        //     }
        // ]);

        console.log("Seeding finished");
    } catch (error) {
        console.error(error);
        throw new Error("Failed to seed the database");
    }
};

main();
