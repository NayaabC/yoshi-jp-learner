import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";

export const topics = pgTable("topics", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    imageSrc: text("image_src").notNull(),
});

export const topicsRelations = relations(topics, ({ many }) => ({
    userProgress: many(userProgress),
}));

export const userProgress = pgTable("user_progress", {
    userId: text("user_id").primaryKey(),
    userName: text("user_name").notNull().default("User"),
    userImageSrc: text("user_image_src").notNull().default("/yoshKanji.svg"),
    activeTopicId: integer("active_topic_id").references(() => topics.id, { onDelete: "cascade"}),
    hearts: integer("hearts").notNull().default(5),
    points: integer("points").notNull().default(0),
});

export const userProgressRelations = relations(userProgress, ({one}) => ({
    activeTopic: one(topics, {
        fields: [userProgress.activeTopicId],
        references: [topics.id],
    }),
}));