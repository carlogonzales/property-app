import connectToDatabase from '@/config/database';
import Property from '@/models/Property';
import {getSessionUser} from "@/utils/getSessionUser";

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

// DELETE /api/properties/[id]
export const DELETE = async (request, {params}) => {
    try{
        const { id } = await params;
        const sessionUser = await getSessionUser();

        if(!sessionUser) {
            return new Response('Unauthorized', { status: 401 });
        }

        const {userId} = sessionUser;


        await connectToDatabase();

        const property = await Property.findById(id);

        if(!property) {
            return new Response('Property Not Found', { status: 404 });
        }

        if(property.owner.toString() !== userId.toString()) {
            return new Response('Forbidden', { status: 403 });
        }

        await property.deleteOne();

        return new Response("Property Deleted", { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response('Internal Server Error', { status: 500 });
    }
};


export const PUT = async (request, {params}) => {
    try {
        connectToDatabase();
        const sessionUser = await getSessionUser();

        if(!sessionUser || !sessionUser.userId) {
            return new Response('Unauthorized - User ID required', { status: 401 });
        }

        const {userId} =  sessionUser;
        const {id} = await params;
        const formData = await request.formData();

        const amenities = formData.getAll('amenities');

        const existingProperty = await Property.findById(id);
        if(!existingProperty) {
            return new Response('Property Not Found', { status: 404 });
        }

        if(existingProperty.owner.toString() !== userId) {
            return new Response('Unauthorized', { status: 401 });
        }

        const propertyData = {
            type: formData.get('type'),
            name: formData.get('name'),
            description: formData.get('description'),
            location: {
                street: formData.get('location.street'),
                city: formData.get('location.city'),
                state: formData.get('location.state'),
                zipcode: formData.get('location.zipcode'),
            },
            beds: formData.get('beds'),
            baths: formData.get('baths'),
            square_feet: formData.get('square_feet'),
            amenities,
            rates: {
                monthly: formData.get('rates.monthly'),
                weekly: formData.get('rates.weekly'),
                nightly: formData.get('rates.nightly'),
            },
            seller_info: {
                name: formData.get('seller_info.name'),
                email: formData.get('seller_info.email'),
                phone: formData.get('seller_info.phone')
            },
            owner: userId,
            // images
        };

        const updatedProperty = await Property.findByIdAndUpdate(id, propertyData).lean();

        return new Response(JSON.stringify(updatedProperty), { status: 200 });
        // return new Response(JSON.stringify(request), { status: 200 });
    } catch (error) {
        console.error("error Saving Property:", error);
        return new Response('Internal Server Error', { status: 500 });
    }
};