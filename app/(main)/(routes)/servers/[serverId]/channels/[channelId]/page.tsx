// import { ChatHeader } from "@/components/chat/chat-header";
// import { ChatInput } from "@/components/chat/chat-input";
// import { ChatMessages } from "@/components/chat/chat-messages";
// import { MediaRoom } from "@/components/media-room";
// import { currentProfile } from "@/lib/current-profile";
// import { db } from "@/lib/db";
// import { ChannelType } from "@prisma/client";
// import { redirect } from "next/navigation";

// interface ChannelIdProps {
//   params: {
//     serverId: string;
//     channelId: string;
//   };
// }

// const ChannelId: React.FC<ChannelIdProps> = async ({
//   params: { serverId, channelId },
// }) => {
//   const profile = await currentProfile();

//   // if (!profile) return redirectToSignIn();

//   const channel = await db.channel.findFirst({
//     where: { id: channelId },
//   });

//   const member = await db.member.findFirst({
//     where: { profileId: profile.id, serverId },
//   });

//   if (!channel || !member) return redirect("/");

//   return (
//     <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
//       <ChatHeader
//         name={channel.name}
//         serverId={channel.serverId}
//         type="channel"
//       />

//       {channel.type === ChannelType.TEXT && (
//         <>
//           <ChatMessages
//             name={channel.name}
//             member={member}
//             chatId={channel.id}
//             apiUrl="/api/messages"
//             socketUrl="/api/socket/messages"
//             socketQuery={{
//               channelId: channel.id,
//               serverId: channel.serverId,
//             }}
//             paramKey="channelId"
//             paramValue={channel.id}
//             type="channel"
//           />
//           <ChatInput
//             apiUrl="/api/socket/messages"
//             query={{
//               channelId: channel.id,
//               serverId: channel.serverId,
//             }}
//             name={channel.name}
//             type="channel"
//           />
//         </>
//       )}

//       {channel.type === ChannelType.AUDIO && (
//         <MediaRoom audio={true} video={false} chatId={channel.id} />
//       )}

//       {channel.type === ChannelType.VIDEO && (
//         <MediaRoom audio={true} video={true} chatId={channel.id} />
//       )}

//     </div>
//   );
// };

// export default ChannelId;
"use client";

import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/media-room";
import { useTelegramUser } from "@/components/tma/TelegramUserProvider";
import { initialProfile } from "@/lib/initial-profile";
import { supabase } from "@/lib/supabaseClient"; // Ensure Supabase client is correctly initialized
import { ChannelType } from "@prisma/client"; // Adjust if you're using different types
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

interface ChannelIdProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

const ChannelId: React.FC<ChannelIdProps> = ({
  params: { serverId, channelId },
}) => {
  const user = useTelegramUser();
  const [profile, setProfile] = useState<any>(null); // Replace with actual profile type
  const [channelData, setChannelData] = useState<any>(null); // Replace with actual channel type
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const profile = await initialProfile(user);
      setProfile(profile);
    };

    fetchUserProfile();
  }, [user]);

  useEffect(() => {
    const fetchChannelData = async () => {
      const { data, error } = await supabase
        .from("channel")
        .select(`
          id,
          name,
          type,
          serverid
        `)
        .eq("id", channelId)
        .single(); // Get a single channel by ID

      if (error || !data) {
        console.error("Error fetching channel:", error);
        router.push("/"); // Redirect on error
        return;
      }

      setChannelData(data);
      setLoading(false);
    };

    fetchChannelData();
  }, [channelId, router]);

  // Handle loading state
  if (loading || !profile) {
    return <div>Loading...</div>; // Optionally, add a loading spinner or similar UI
  }

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name={channelData.name}
        serverId={channelData.serverid}
        type="channel"
      />

      {channelData.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            name={channelData.name}
            member={profile}
            chatId={channelData.id}
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
              channelId: channelData.id,
              serverId: channelData.serverid,
            }}
            paramKey="channelId"
            paramValue={channelData.id}
            type="channel"
          />
          <ChatInput
            apiUrl="/api/socket/messages"
            member={profile}
            query={{
              channelId: channelData.id,
              serverId: channelData.serverid,
            }}
            name={channelData.name}
            type="channel"
          />
        </>
      )}

      {channelData.type === ChannelType.AUDIO && (
        <MediaRoom audio={true} video={false} chatId={channelData.id} />
      )}

      {channelData.type === ChannelType.VIDEO && (
        <MediaRoom audio={true} video={true} chatId={channelData.id} />
      )}
    </div>
  );
};

export default ChannelId;
