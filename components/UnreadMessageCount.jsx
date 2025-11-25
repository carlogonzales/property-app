'use client';

import {useEffect, useState} from "react";
import {useGlobalContext} from "@/context/GobalContext";


const UnreadMessageCount = ({session}) => {
    const {unreadMessageCount, setUnreadMessageCount} = useGlobalContext();

    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                if(!session) return;

                const response = await fetch('/api/messages/unread');
                if (response.ok) {
                    const data = await response.json();
                    setUnreadMessageCount(data.count);
                } else {
                    console.error('Failed to fetch unread messages count');
                }
            } catch (error) {
                console.error('Error fetching unread messages count:', error);
            }
        }
        fetchUnreadCount();
    }, [session]);

    return (unreadMessageCount > 0 && (<span
        className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full"
    >{unreadMessageCount}</span>));
}

export default UnreadMessageCount;