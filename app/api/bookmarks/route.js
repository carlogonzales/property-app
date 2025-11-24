import connectToDatabase from '@/config/database';
import Property from '@/models/Property';
import User from '@/models/User';
import {getSessionUser} from "@/utils/getSessionUser";

export const dynamic = 'force-dynamic';

export const GET = async (request) => {
    try {
        await connectToDatabase();
        const sessionUser = await getSessionUser();

        if (!sessionUser || !sessionUser.userId) {
            return new Response('Unauthorized - User ID required', {status: 401});
        }

        const {userId} = sessionUser;
        const user = await User.findById({_id: userId});

        const bookmarks = await Property.find({_id: {$in: user.bookmarks}}).lean();

        return new Response(JSON.stringify(bookmarks), {status: 200});
    } catch (error) {
        console.error(error);
        return new Response('Internal Server Error', {status: 500});
    }
}
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
        let message;

        if (isBookmarked) {
            user.bookmarks.pull(propertyId);
            message = 'Bookmark removed successfully';
            isBookmarked = false;
        } else {
            user.bookmarks.push(propertyId);
            message = 'Bookmark added successfully';
            isBookmarked = true;
        }

        await user.save();

        return new Response(JSON.stringify({message, isBookmarked}), {status: 200});
    } catch(error) {
        console.error(error);
        return new Response('Internal Server Error', {status: 500});
    }
}