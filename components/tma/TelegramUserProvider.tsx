// Import dynamic from Next.js to disable SSR for this component
import dynamic from 'next/dynamic';
import React, { createContext, useContext, ReactNode } from "react";
import { useInitData } from "@telegram-apps/sdk-react";

// Define the user type based on what you expect from the Telegram API
interface User {
  id?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
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

const TelegramUserProvider: React.FC<TelegramUserProviderProps> = ({ children }) => {
  const initData = useInitData(); // Hook should only be called in the client side
  const tgUser = initData?.user || null;

  const user = {
    id: tgUser?.id?.toString() || '',
    username: tgUser?.username || '',
    // firstName: tgUser?.first_name || '',
    // lastName: tgUser?.last_name || '',
  };

  console.log(user); // For debugging

  return (
    <TelegramUserContext.Provider value={{ user }}>
      {children}
    </TelegramUserContext.Provider>
  );
};

// Use dynamic to disable SSR for this component
export const DynamicTelegramUserProvider = dynamic(() => Promise.resolve(TelegramUserProvider), {
  ssr: false, // Disable server-side rendering
});

// Custom hook for consuming the context easily
export const useTelegramUser = () => {
  const context = useContext(TelegramUserContext);
  if (context === null) {
    throw new Error(
      "useTelegramUser must be used within a TelegramUserProvider"
    );
  }
  return context.user;
};

