import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Header } from "./header";
import { UserProgress } from "@/components/user-progress";
import { getLessonPercentage, getTopicProgress, getUnits, getUserProgress, getUserSubscription } from "@/db/queries";
import { redirect } from "next/navigation";
import { Unit } from "./unit";
import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";

const LearnPage = async () => {
    const userProgressData = getUserProgress();
    const unitsData = getUnits();
    const topicProgressData = getTopicProgress();
    const lessonPercentageData = getLessonPercentage();
    const userSubscriptionData = getUserSubscription();

    const [
        userProgress,
        units,
        topicProgress,
        lessonPercentage,
        userSubscription
    ] = await Promise.all([
        userProgressData, unitsData, topicProgressData, lessonPercentageData, userSubscriptionData
    ]);

    if(!userProgress || !userProgress.activeTopic) {
        redirect('/topics')
    }

    if(!topicProgress) {
        redirect('/topics')
    }

    const isSubbed = !!userSubscription?.isActive;

    return (
        <div className="flex flex-row-reverse gap-[48px] px-6">
            <StickyWrapper>
                <UserProgress 
                    activeTopic={userProgress.activeTopic}
                    hearts={userProgress.hearts}
                    points={userProgress.points}
                    hasActiveSubscription={isSubbed}
                />
                {!isSubbed && (
                    <Promo/>
                )}
                <Quests points={userProgress.points} />
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