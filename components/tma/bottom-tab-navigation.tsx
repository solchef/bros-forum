"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { Home, Search, Settings, User, Users, X } from "lucide-react"; // Icons for demonstration
import { useEffect, useState } from "react";
import { motion } from "framer-motion"; // For draggable behavior
import { supabase } from "@/lib/supabaseClient";
import { Channel, Server } from "@/lib/types";
import ForumSearch from "./forum-search";
import ForumMembers from "./forum-members";
import ForumUserProfile from "./forum-user-profile";
import { useParams, useRouter } from "next/navigation";
import Serverchannels from "./server-channels";

export const BottomTabs = () => {
  const router = useRouter();
  const params = useParams();
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [servers, setServers] = useState<Server[] | null>(null);
  const [channels, setChannels] = useState<Channel[] | null>(null);
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);
  const [filteredChannels, setFilteredChannels] = useState<Channel[] | null>(
    null
  );
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

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

  const getServersAndChannels = async () => {
    setLoading(true);
    const { data: serverList, error: srvError } = await supabase
      .from("server")
      .select();
    const { data: channelList, error: chError } = await supabase
      .from("channel")
      .select();

    if (srvError || chError) {
      setError("Failed to load data");
      console.error("Error fetching data:", srvError || chError);
      setLoading(false);
      return;
    }

    setServers(serverList);
    setChannels(channelList);
    setLoading(false);
  };

  const handleServerClick = (serverId: string) => {
    setSelectedServerId(serverId);
    const filtered = channels?.filter(
      (channel) => channel.serverid === serverId
    );
    setFilteredChannels(filtered || []);

    router.push(`/servers/${serverId}`);
  };

  useEffect(() => {
    getServersAndChannels();
  }, []);

  const handleChannelClick = (channelId: string) => {
    // Implement your logic here, e.g., navigating to the channel or displaying more details
    console.log("Channel clicked:", channelId);

    router.push(`/servers/${params?.serverId}/channels/${channelId}`);
  };

  return (
    <>
      <Serverchannels
        selectedServerId={selectedServerId}
        filteredChannels={filteredChannels}
        handleChannelClick={handleChannelClick}
      />

      <Tabs.Root
        value={activeTab || undefined}
        className="fixed bottom-0 w-full border-t border-gray-200"
      >
        {/* Backdrop for modal-like effect */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-opacity-50 z-10"
            onClick={closeTab}
          />
        )}

        {/* Modal-style sliding content */}
        <motion.div
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.2}
          onDragEnd={(event, info) => {
            if (info.point.y > 150) closeTab(); // Close on sufficient downward drag
          }}
          className={`fixed left-0 right-0  rounded-t-lg z-10 transition-transform duration-500 ease-in-out ${
            isOpen ? "translate-y-0" : "translate-y-full"
          }`}
          style={{ height: "66vh", bottom: isOpen ? 0 : "-100%" }}
        >
          <div className="relative h-full">
            {activeTab && (
              <>
                <button
                  className="absolute top-3 right-3 text-white"
                  onClick={closeTab}
                  aria-label="Close Tab"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Tabs Content */}
                <Tabs.Content
                  value="home"
                  className="p-4 flex bg-custom-darker flex-col h-full "
                >
                  {loading ? (
                    <p>Loading servers...</p>
                  ) : error ? (
                    <p className="text-red-500">{error}</p>
                  ) : (
                    <>
                      <div
                        className="flex flex-col w-full mt-auto fixed bottom-20"
                        style={{ flexGrow: 1 }}
                      >
                        <p className="font-bold my-4">Servers</p>
                        <div className="flex flex-wrap justify-between  gap-y-3">
                          {servers?.length ? (
                            servers.map((server) => (
                              <div
                                key={server.id}
                                onClick={() => handleServerClick(server.id)}
                                className="flex flex-col items-center mr-8 justify-center cursor-pointer"
                              >
                                <div className="h-11 w-11 bg-gray-300 rounded-full flex items-center justify-center mb-2 hover:bg-gray-400">
                                  <img
                                    src={server.imageurl}
                                    alt={server.name}
                                    className="h-9 w-9 rounded-full"
                                  />
                                </div>
                                <span className="text-xs text-white">
                                  {server.name}
                                </span>
                              </div>
                            ))
                          ) : (
                            <p>No servers found.</p>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </Tabs.Content>

                <Tabs.Content
                  value="search"
                  className="p-4 flex bg-custom-dark flex-col h-full"
                >
                  <div className="flex flex-col w-full absolute top-10">
                    <p className="font-bold mb-4">Search</p>
                    <ForumSearch />
                  </div>
                </Tabs.Content>

                <Tabs.Content
                  value="profile"
                  className="p-4 flex bg-custom-dark flex-col h-full rounded-xl shadow-md"
                >
                  <div className="flex flex-col w-full absolute top-10">
                    <p className="font-bold mb-4">Members</p>
                    <ForumMembers />
                  </div>
                </Tabs.Content>

                <Tabs.Content
                  value="settings"
                  className="p-4 flex bg-custom-dark flex-col h-full rounded-xl shadow-md"
                >
                  <div className="flex flex-col w-full absolute top-10">
                    <p className="font-bold mb-4">Members</p>
                    <ForumUserProfile />
                  </div>
                </Tabs.Content>
              </>
            )}
          </div>
        </motion.div>

        {/* Bottom Tabs Navigation */}
        <Tabs.List
          aria-label="Bottom navigation"
          className="flex justify-between items-center w-full  p-2 fixed bottom-0 z-20 dark:border-neutral-800 border-t-2 text-white" // Increased z-index here
        >
          <Tabs.Trigger
            value="home"
            className="flex flex-col items-center justify-center text-white focus:outline-none"
            onClick={() => toggleTab("home")}
            aria-label="Servers"
          >
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">Servers</span>
          </Tabs.Trigger>

          <Tabs.Trigger
            value="search"
            className="flex flex-col items-center justify-center text-white focus:outline-none"
            onClick={() => toggleTab("search")}
            aria-label="Search"
          >
            <Search className="h-6 w-6" />
            <span className="text-xs mt-1">Search</span>
          </Tabs.Trigger>

          <Tabs.Trigger
            value="profile"
            className="flex flex-col items-center justify-center text-white focus:outline-none"
            onClick={() => toggleTab("profile")}
            aria-label="Profile"
          >
            <Users className="h-6 w-6" />
            <span className="text-xs mt-1">Members</span>
          </Tabs.Trigger>

          <Tabs.Trigger
            value="settings"
            className="flex flex-col items-center justify-center text-white focus:outline-none"
            onClick={() => toggleTab("settings")}
            aria-label="Settings"
          >
            <Settings className="h-6 w-6" />
            <span className="text-xs mt-1">Settings</span>
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>
    </>
  );
};
