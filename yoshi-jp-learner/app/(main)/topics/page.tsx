import { getTopics, getUserProgress } from "@/db/queries";
import { List } from "./list";

const TopicsPage = async () => {
    const topics = await getTopics();
    const userProgress = await getUserProgress();

    return (
        <div className="h-full max-w-[912px] px-3 mx-auto">
            <h1 className="text-2xl font-bold text-neutral-700">
                Learning Topics
            </h1>
            <List
                topics={topics}
                activeTopicId={userProgress?.activeTopicId}
            />
        </div>
    );
};

export default TopicsPage;