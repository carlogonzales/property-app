import connectToDatabase from '@/config/database';
import Property from '@/models/Property';
import {getSessionUser} from "@/utils/getSessionUser";
import cloudinary from '@/config/cloudinary';

export const GET = async (request) => {
    try {
        await connectToDatabase();

        const properties = await Property.find({}).lean();
        return new Response(JSON.stringify(properties), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response('Internal Server Error', { status: 500 });
    }
};

export const POST = async (request) => {
    try {
        connectToDatabase();
        const sessionUser = await getSessionUser();

        if(!sessionUser || !sessionUser.userId) {
            return new Response('Unauthorized - User ID required', { status: 401 });
        }

        const {userId} =  sessionUser;
        const formData = await request.formData();

        const amenities = formData.getAll('amenities');
        const images = formData.getAll('images').filter((image) => image.name !== '');

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

        console.log(JSON.stringify(formData, null, 2));
        const imagePromises = [];

        for(const image of images) {
            const imageBuffer = await image.arrayBuffer();
            const imageArray = Array.from(new Uint8Array(imageBuffer));
            const imageData = Buffer.from(imageArray);

            const imageBase64 = imageData.toString('base64');

            const result = await cloudinary.uploader.upload(`data:${image.type};base64,${imageBase64}`, {
                folder: 'propertyapp',
            });

            imagePromises.push(result.secure_url);
        }

        const uploadedImages = await Promise.all(imagePromises);
        propertyData.images = uploadedImages;

        const newProperty = new Property(propertyData);
        await newProperty.save();

        return Response.redirect(`${process.env.NEXTAUTH_URL}/properties/${newProperty._id}`, 303);
        // return new Response(JSON.stringify(request), { status: 200 });
    } catch (error) {
        console.error("error Saving Property:", error);
        return new Response('Internal Server Error', { status: 500 });
    }
};