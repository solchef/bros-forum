"use client"
// src/components/ServerSidebar.tsx
import { useEffect, useState } from "react";
import { ChannelType, MemberRole, Server } from "@/lib/types"; // Ensure this path is correct
import { redirect } from "next/navigation";
import ServerHeader from "./server-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ServerSearch } from "./server-search";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { Separator } from "../ui/separator";
import { ServerSection } from "./server-section";
import { ServerChannel } from "./server-channel";
import { ServerMember } from "./server-member";
import { supabase } from "@/lib/supabaseClient"; 
import { useTelegramUser } from "../tma/TelegramUserProvider";

interface ServerSidebarProps {
  serverId: string;
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
  [MemberRole.GUEST]: (
    <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />
  ),
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />,
};

const ServerSidebar: React.FC<ServerSidebarProps> = ({ serverId }) => {
  const [server, setServer] = useState<Server | null>(null);
  const [profile, setProfile] = useState<any>(null); // Adjust type if you have a profile type
  const [loading, setLoading] = useState(true);
  const user = useTelegramUser();

  useEffect(() => {
    const fetchServerData = async () => {
      // Fetch the current user's profile
      const { data: profileData, error: profileError } = await supabase
          .from("profile")
          .select("*")
          .eq("userid", user?.id)
          .single();

        // if (profileError || !profileData) {
        //   console.error("Error fetching profile:", profileError);
        //   router.push("/sign-in");
        //   return;
        // }
      setProfile(profileData);

      // Fetch the server data including channels and members
      const { data: serverData, error: serverError } = await supabase
      .from("server")
      .select(`
        id,
        name,
        imageurl,
        invitecode,
        member:member (
          profileid,
          profile:profile (
            id,
            name,
            imageurl,
            email
          )
        ),
        channel:channel (
          id,
          name,
          type
        )
      `)
      .eq("id", serverId)
      .single();
          // Check if the profile is part of the server


        // console.log(serverData);

      if (serverError || !serverData) {
        // redirect("/");
        return;
      }
      // @ts-ignore
      setServer(serverData);
      setLoading(false);
    };

    fetchServerData();
  }, [serverId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!server || !profile) {
    return <div>Error loading data or access denied.</div>;
  }

  const textChannels = server.channel.filter(
    (channel) => channel.type === ChannelType.TEXT
  );

  const audioChannels = server.channel.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videoChannels = server.channel.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );

  const members = server.member.filter(
    (member) => member.profileid !== profile.id
  );

  const role = server.member.find(
    (member) => member.profileid === profile.id
  )?.role;


  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      {/* @ts-ignore */}
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels.map((channel) => ({
                  icon: iconMap[channel.type],
                  name: channel.name,
                  id: channel.id,
                })),
              },
              {
                label: "Voice Channels",
                type: "channel",
                data: audioChannels.map((channel) => ({
                  icon: iconMap[channel.type],
                  name: channel.name,
                  id: channel.id,
                })),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels.map((channel) => ({
                  icon: iconMap[channel.type],
                  name: channel.name,
                  id: channel.id,
                })),
              },
              {
                label: "Members",
                type: "member",
                data: members.map((member) => ({
                  icon: roleIconMap[member.role],
                  // @ts-ignore
                  name: member.profile?.name,
                  id: member.id,
                })),
              },
            ]}
          />
        </div>

        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        {!!textChannels.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.TEXT}
              role={role}
              label="Text Channels"
            />
            <div className="space-y-[2px]">
              {textChannels.map((channel) => (

                // <p key={channel.id}>{channel.name}</p>
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}

        {!!audioChannels.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.AUDIO}
              role={role}
              label="Audio Channels"
            />
            <div className="space-y-[2px]">
              {audioChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}

        {!!videoChannels.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.VIDEO}
              role={role}
              label="Video Channels"
            />
            <div className="space-y-[2px]">
              {videoChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}

        {!!members.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="members"
              role={role}
              label="Members"
              //@ts-ignore
              server={server}
            />
            <div className="space-y-[2px]">
              {server.member.map((member) => (
                // @ts-ignore
                <ServerMember key={member.id} member={member} server={server} />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;
