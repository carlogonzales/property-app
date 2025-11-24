import connectToDatabase from '@/config/database';
import Property from '@/models/Property';


// GET /api/properties/search?location=someLocation&propertyType=someType
export const GET = async (request) => {
    try {
        connectToDatabase();

        const { searchParams } = new URL(request.url);
        const location = searchParams.get('location') || '';
        const propertyType = searchParams.get('propertyType') || 'All';

        const locationPattern = new RegExp(location, 'i');

        let query = {
            $or: [
                {location: locationPattern},
                {description: locationPattern},
                {'location.street': locationPattern},
                {'location.city': locationPattern},
                {'location.state': locationPattern},
                {'location.zipcode': locationPattern}
            ]
        };

        if(propertyType && propertyType !== 'All') {
            const typePattern = new RegExp(propertyType, 'i');
            query.type = typePattern;
        }

        const properties = await Property.find(query).limit(50).lean();

        return new Response(JSON.stringify(properties), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to process search request' }), { status: 500 });
    }
};