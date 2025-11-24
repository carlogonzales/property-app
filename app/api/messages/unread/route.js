import connectToDatabase from "@/config/database";
import Message from "@/models/Message";
import {getSessionUser} from "@/utils/getSessionUser";

export const dynamic = 'force-dynamic';

export const GET = async () => {
    try {
        await connectToDatabase();

        const sessionUser = await getSessionUser();
        if(!sessionUser || !sessionUser.userId) {
            return new Response(JSON.stringify({message: 'Unauthorized - User ID required'}), { status: 401 });
        }

        const {userId} = sessionUser;
        const unreadMessagesCount = await Message.countDocuments({recipient: userId, is_read: false});
        return new Response(JSON.stringify({count: unreadMessagesCount}), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({message: 'Failed to fetch messages'}), { status: 500 });
    }
};
