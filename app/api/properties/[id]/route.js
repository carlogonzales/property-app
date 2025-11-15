import connectToDatabase from '@/config/database';
import Property from '@/models/Property';

// GET /api/properties/[id]
export const GET = async (request, {params}) => {
    try{
        await connectToDatabase();
        const { id } = await params;

        const property = await Property.findById(id).lean();

        if(!property) {
            return new Response('Property Not Found', { status: 404 });
        }
        return new Response(JSON.stringify(property), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response('Internal Server Error', { status: 500 });
    }
};