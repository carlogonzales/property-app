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

        const readMessages = await Message.find({recipient: userId, is_read: true})
            .sort({createdAt: -1})
            .populate('sender', 'username')
            .populate('property', 'name').lean();

        const unreadMessages = await Message.find({recipient: userId, is_read: false})
            .sort({createdAt: -1})
            .populate('sender', 'username')
            .populate('property', 'name').lean();

        const messages = [...unreadMessages, ...readMessages];

        return new Response(JSON.stringify(messages), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({message: 'Failed to fetch messages'}), { status: 500 });
    }
};

export const POST = async (request) => {
    try {
        await connectToDatabase();
        const sessionUser = await getSessionUser();

        if(!sessionUser || !sessionUser.userId) {
            return new Response(JSON.stringify({message: 'Unauthorized - User ID required'}), { status: 401 });
        }

        const { userId } = sessionUser;
        const data = await request.json();

        const { recipient, property, name, email, phone, message } = data;

        if(userId === recipient) {
            return new Response(JSON.stringify({message: 'Cannot send message to yourself'}), { status: 400 });
        }

        const newMessage = new Message({
            sender: userId,
            recipient,
            property,
            name,
            email,
            phone,
            body: message
        });

        await newMessage.save();

        return new Response(JSON.stringify({message: 'Message successfully sent'}), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({message: 'Failed to send message'}), { status: 500 });
    }
};
