import connectToDatabase from "@/config/database";
import Message from "@/models/Message";
import {getSessionUser} from "@/utils/getSessionUser";

export const dynamic = 'force-dynamic';

export const PUT = async (request, {params}) => {
    try {
        await connectToDatabase();
        const sessionUser = await getSessionUser();

        if(!sessionUser || !sessionUser.userId) {
            return new Response(JSON.stringify({message: 'Unauthorized - User ID required'}), { status: 401 });
        }

        const { userId } = sessionUser;

        const {id} = await params;

        const message = await Message.findById(id);

        if(message.recipient.toString() !== userId) {
            return new Response(JSON.stringify({message: 'Unauthorized - Not the recipient of the message'}), { status: 401 });
        }

        if(!message) {
            return new Response(JSON.stringify({message: 'Message not found!'}), { status: 404 });
        }

        message.is_read = !message.is_read;

        await message.save();

        return new Response(JSON.stringify(message), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({message: 'Something went wrong.'}), { status: 500 });
    }
};

export const DELETE = async (request, {params}) => {
    try {
        await connectToDatabase();
        const sessionUser = await getSessionUser();

        if(!sessionUser || !sessionUser.userId) {
            return new Response(JSON.stringify({message: 'Unauthorized - User ID required'}), { status: 401 });
        }

        const { userId } = sessionUser;

        const {id} = await params;

        const message = await Message.findById(id);

        if(message.recipient.toString() !== userId) {
            return new Response(JSON.stringify({message: 'Unauthorized - Not the recipient of the message'}), { status: 401 });
        }

        if(!message) {
            return new Response(JSON.stringify({message: 'Message not found!'}), { status: 404 });
        }

        await message.deleteOne();

        return new Response(JSON.stringify({message: 'Message deleted.'}), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({message: 'Something went wrong.'}), { status: 500 });
    }
};
