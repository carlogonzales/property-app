'use client';

import {useState, useEffect} from "react";
import {toast} from "react-toastify";
import {useGlobalContext} from "@/context/GobalContext";

const Message = ({message}) => {
    const [isRead, setIsRead] = useState(message.is_read);
    const [isDeleted, setIsDeleted] = useState(false);
    const {setUnreadMessageCount} = useGlobalContext();

    const handleReadClick = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`/api/messages/${message._id}`, {
                method: 'PUT'
            });

            if (response.status === 200) {
                const {is_read} = await response.json();
                setIsRead(is_read);
                setUnreadMessageCount(prevCount => is_read ? prevCount - 1 : prevCount + 1);
                toast.success(`Message marked as ${isRead ? 'new' : 'read'}.`);
            }
        } catch (error) {
            console.error("Error updating message status:", error);
        }
    }

    const handleDeleteClick = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`/api/messages/${message._id}`, {
                method: 'DELETE'
            });

            if (response.status === 200) {
                setIsDeleted(true);
                toast.success('Message deleted successfully.');
            }

            if(isDeleted) {
                return null;
            }
        } catch (error) {
            console.error("Error deleting message:", error);
            toast.error("Error deleting message status:", error);
        }
    };

    return (
        <div
            className="relative bg-white p-4 rounded-md shadow-md border border-gray-200">
            {!isRead && (
                <div className={"absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-md"}>New</div>
            )}
            <h2 className="text-xl mb-4">
                <span className="font-bold">Property Inquiry:</span>
                {message.property.name}
            </h2>
            <p className="text-gray-700">
                {message.body}
            </p>

            <ul className="mt-4">
                <li><strong>Name:</strong> {message.sender.username}</li>

                <li>
                    <strong>Reply Email:</strong>
                    <a href={`mailto:${message.email}`} className="text-blue-500">{message.email}</a>
                </li>
                <li>
                    <strong>Reply Phone:</strong>
                    <a href={`tel:${message.phone}`} className="text-blue-500">{message.phone}</a>
                </li>
                <li><strong>Received:</strong>{new Date(message.createdAt).toLocaleString()}</li>
            </ul>
            <button
                onClick={handleReadClick}
                className={`mt-4 mr-3 ${isRead? 'bg-gray-300' : 'bg-blue-500 text-white'}   py-1 px-3 rounded-md`}
            >
                {isRead? 'Mark as New': 'Mark as Read'}
            </button>
            <button onClick={handleDeleteClick} className="mt-4 bg-red-500 text-white py-1 px-3 rounded-md">
                Delete
            </button>
        </div>
    );
};

export default Message;