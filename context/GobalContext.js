'use client';

import { createContext, useState, useContext } from 'react';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [unreadMessageCount, setUnreadMessageCount] = useState(0);

    return (
        <GlobalContext.Provider value={{ unreadMessageCount, setUnreadMessageCount }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => useContext(GlobalContext);