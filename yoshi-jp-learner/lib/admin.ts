import { auth } from "@clerk/nextjs/server"

const allowedIds = [
    "user_2ktdLZRFLRlSn3yfjoyG7cr3Iil",
]

export const isAdmin = () => {
    const { userId } = auth();

    if (!userId) {
        return false;
    }

    return allowedIds.indexOf(userId) !== -1;
}