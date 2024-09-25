 "use client"
 
import React, { createContext, useContext, ReactNode } from "react";
import { useInitData } from "@telegram-apps/sdk-react";

// Define the user type based on what you expect from the Telegram API
interface User {
  id?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
}

// Define the context type
interface TelegramUserContextType {
  user?: User | null;
}

// Create the TelegramUserContext
const TelegramUserContext = createContext<TelegramUserContextType | null>(null);

// Create the provider component
interface TelegramUserProviderProps {
  children: ReactNode;
}

export const TelegramUserProvider: React.FC<TelegramUserProviderProps> = ({ children }) => {
  // const initData = useInitData();
  // const user = initData?.user || null; 
  // const user = initData?.user || null;
   const user = {
      id:'user_01',
      username: "jawiwy",
      firstName: "jaa",
      lastName:"heed"

   }

  return (
    <TelegramUserContext.Provider value={{ user }}>
      {children}
    </TelegramUserContext.Provider>
  );
};

// Custom hook for consuming the context easily
export const useTelegramUser = () => {
  const context = useContext(TelegramUserContext);
  if (context === null) {
    throw new Error("useTelegramUser must be used within a TelegramUserProvider");
  }
  return context.user;
};
