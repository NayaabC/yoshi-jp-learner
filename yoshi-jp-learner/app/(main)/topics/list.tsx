"use client";

import { topics, userProgress } from "@/db/schema";
import { Card } from "./card";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { upsertUserProgress } from "@/actions/user-progress";
import { toast } from "sonner";

type Props = {
    topics: typeof topics.$inferSelect[];
    activeTopicId?: typeof userProgress.$inferSelect.activeTopicId;
};

export const List = ({topics, activeTopicId} : Props) => {
    const router = useRouter();
    const [pending, startTransition] = useTransition();

    const onClick = (id: number) => {
        if(pending) return;

        if(id === activeTopicId) {
            return router.push("/learn");
        }

        startTransition(() => {
            upsertUserProgress(id)
                .catch(() => toast.error("Something went wrong."))
        });
    }

    return (
        <div className="pt-6 grid grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-4">
            {topics.map((topic) => (
                <Card
                    key={topic.id}
                    id={topic.id}
                    title={topic.title}
                    imageSrc={topic.imageSrc}
                    onClick = {onClick}
                    disabled={pending}
                    active={topic.id === activeTopicId}
                />
            ))}
        </div>
    );
};