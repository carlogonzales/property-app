
import connectToDatabase from '@/config/database';
import Property from '@/models/Property';

// GET /api/properties/user/:userId
export const GET = async (request, {params}) => {
    try{
        await connectToDatabase();
        const { userId } = await params;

        if(!userId) {
            return new Response('User ID is required', { status: 400 });
        }

        const properties = await Property.find({owner: userId}).lean();

        return new Response(JSON.stringify(properties), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response('Internal Server Error', { status: 500 });
    }
};