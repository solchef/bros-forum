"use client"

import * as Tabs from '@radix-ui/react-tabs';
import { Home, Search, Settings, User, X } from 'lucide-react'; // Icons for demonstration
import { useState } from 'react';
import { motion } from 'framer-motion'; // For draggable behavior

export const BottomTabs = () => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleTab = (tab: string) => {
    if (activeTab === tab) {
      setIsOpen(false);
      setActiveTab(null); // Close if the same tab is clicked again
    } else {
      setActiveTab(tab);
      setIsOpen(true); // Open new tab
    }
  };

  const closeTab = () => {
    setIsOpen(false);
    setActiveTab(null); // Close the tab
  };

  return (
    <Tabs.Root
      value={activeTab || undefined}
      className="fixed bottom-0 w-full bg-white border-t border-gray-200"
    >
      {/* Modal-style sliding content */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={(event, info) => {
          if (info.point.y > 150) closeTab(); // Close on sufficient downward drag
        }}
        className={`fixed left-0 right-0 bg-white rounded-t-lg transition-transform duration-500 ease-in-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ height: '66vh', bottom: isOpen ? 0 : '-100%' }}
      >
        <div className="relative h-full">
          {activeTab && (
            <>
              <button
                className="absolute top-3 right-3 text-gray-500"
                onClick={closeTab}
              >
                <X className="w-6 h-6" />
              </button>
              <Tabs.Content value="home" className="p-4">
                <div>Home Content</div>
              </Tabs.Content>
              <Tabs.Content value="search" className="p-4">
                <div>Search Content</div>
              </Tabs.Content>
              <Tabs.Content value="profile" className="p-4">
                <div>Profile Content</div>
              </Tabs.Content>
              <Tabs.Content value="settings" className="p-4">
                <div>Settings Content</div>
              </Tabs.Content>
            </>
          )}
        </div>
      </motion.div>

      {/* Bottom Tabs Navigation */}
      <Tabs.List
        aria-label="Bottom navigation"
        className="flex justify-between items-center w-full bg-gray-100 p-2 fixed bottom-0"
      >
        <Tabs.Trigger
          value="home"
          className="flex flex-col items-center justify-center text-gray-700 focus:outline-none"
          onClick={() => toggleTab('home')}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </Tabs.Trigger>

        <Tabs.Trigger
          value="search"
          className="flex flex-col items-center justify-center text-gray-700 focus:outline-none"
          onClick={() => toggleTab('search')}
        >
          <Search className="h-6 w-6" />
          <span className="text-xs mt-1">Search</span>
        </Tabs.Trigger>

        <Tabs.Trigger
          value="profile"
          className="flex flex-col items-center justify-center text-gray-700 focus:outline-none"
          onClick={() => toggleTab('profile')}
        >
          <User className="h-6 w-6" />
          <span className="text-xs mt-1">Profile</span>
        </Tabs.Trigger>

        <Tabs.Trigger
          value="settings"
          className="flex flex-col items-center justify-center text-gray-700 focus:outline-none"
          onClick={() => toggleTab('settings')}
        >
          <Settings className="h-6 w-6" />
          <span className="text-xs mt-1">Settings</span>
        </Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>
  );
};
