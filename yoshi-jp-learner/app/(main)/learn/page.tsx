import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Header } from "./header";
import { UserProgress } from "@/components/user-progress";
import { getLessonPercentage, getTopicProgress, getUnits, getUserProgress } from "@/db/queries";
import { redirect } from "next/navigation";
import { Unit } from "./unit";

const LearnPage = async () => {
    const userProgressData = getUserProgress();
    const unitsData = getUnits();
    const topicProgressData = getTopicProgress();
    const lessonPercentageData = getLessonPercentage();

    const [
        userProgress,
        units,
        topicProgress,
        lessonPercentage
    ] = await Promise.all([
        userProgressData, unitsData, topicProgressData, lessonPercentageData
    ]);

    if(!userProgress || !userProgress.activeTopic) {
        redirect('/topics')
    }

    if(!topicProgress) {
        redirect('/topics')
    }
    return (
        <div className="flex flex-row-reverse gap-[48px] px-6">
            <StickyWrapper>
                <UserProgress 
                    activeTopic={userProgress.activeTopic}
                    hearts={userProgress.hearts}
                    points={userProgress.points}
                    hasActiveSubscription={false}
                />
            </StickyWrapper>
            <FeedWrapper>
                <Header title={userProgress.activeTopic.title} />
                {units.map((unit) => (
                    <div key={unit.id} className="mb-10">
                        <Unit
                            id={unit.id}
                            order={unit.order}
                            description={unit.description}
                            title={unit.title}
                            lessons={unit.lessons}
                            activeLesson={topicProgress.activeLesson}
                            activeLessonPercentage={lessonPercentage}
                        />
                    </div>
                ))}
            </FeedWrapper>
        </div>
    );
}

export default LearnPage;