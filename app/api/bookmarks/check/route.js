import connectToDatabase from '@/config/database';
import User from '@/models/User';
import {getSessionUser} from "@/utils/getSessionUser";

export const dynamic = 'force-dynamic';

// POST /api/bookmarks
export const POST = async (request) => {
    try {
        await connectToDatabase();
        const sessionUser = await getSessionUser();

        const {propertyId} = await request.json();

        if (!sessionUser || !sessionUser.userId) {
            return new Response('Unauthorized - User ID required', {status: 401});
        }

        const user = await User.findById({_id: sessionUser.userId});

        let isBookmarked = user.bookmarks.includes(propertyId);

        return new Response(JSON.stringify({isBookmarked}), {status: 200});
    } catch(error) {
        console.error(error);
        return new Response('Internal Server Error', {status: 500});
    }
}