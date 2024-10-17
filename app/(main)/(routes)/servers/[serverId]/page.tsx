// "use client"; // This must be a client component

// import { useTelegramUser } from "@/components/tma/TelegramUserProvider"; // Adjust import path
// import { currentProfile } from "@/lib/current-profile";
// import { db } from "@/lib/db";
// import { redirect } from "next/navigation";
// import React from "react";

// interface ServerIdPageProps {
//   params: {
//     serverId: string;
//   };
// }

// const ServerIdPage: React.FC<ServerIdPageProps> = async ({
//   params: { serverId },
// }) => {
//   const user = useTelegramUser(); // Get user from context

//   if (!user) {
//     redirect("/sign-in"); // Redirect if user is not available
//     return null; // Prevent rendering
//   }

//   const profile = await currentProfile(user); // Fetch the profile using the user data

//   const server = await db.server.findUnique({
//     where: {
//       id: serverId,
//       members: {
//         some: {
//           profileId: profile?.id, // Use the profile ID for the query
//         },
//       },
//     },
//     include: {
//       channels: {
//         where: {
//           name: "general",
//         },
//         orderBy: {
//           createdAt: "asc",
//         },
//       },
//     },
//   });

//   const initialChannel = server?.channels?.[0];

//   if (initialChannel?.name !== "general") return null;

//   return redirect(`/servers/1234/channels/${initialChannel.id}`);
// };

// export default ServerIdPage;

"use client"; // This must be a client component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { useTelegramUser } from "@/components/tma/TelegramUserProvider"; // Adjust import path
import { TmaProviderLoading } from "@/components/tma/tma-provider-loading";
import { supabase } from "@/lib/supabaseClient";

interface ServerIdPageProps {
  params: {
    serverId: string;
  };
}

// Initialize Supabase client


const ServerIdPage: React.FC<ServerIdPageProps> = ({ params: { serverId } }) => {
  const user = useTelegramUser(); // Get user from Telegram context
  // console.log(user)
  const [initialChannel, setInitialChannel] = useState({});
  const router = useRouter();

  useEffect(() => {
    // if (!user) {
    //   router.push("/sign-in"); // Redirect if user is not available
    //   return;
    // }

    const fetchData = async () => {
      try {
        // Fetch the profile based on user information
        const { data: profileData, error: profileError } = await supabase
          .from("profile") // Adjust the table name according to your schema
          .select("*")
          .eq("userid", user?.id)
          .single();

          // console.log(profileData)


        // if (profileError) {
        //   console.error("Error fetching profile:", profileError);
        //   router.push("/sign-in");
        //   return;
        // }


        const profileId = profileData?.id;

        // Fetch the server information
        const { data: serverData, error: serverError } = await supabase
        .from("server")
        .select(`
          id,
          name,
          imageurl,
          invitecode,
          member:member (
            profileid
          ),
          channel:channel (
            id,
            name
          )
        `)
        .eq("id", serverId)
        .eq("member.profileid", profileData.id); // Check if the profile is part of the server
      
      // Check for errors
      if (serverError || !serverData || serverData.length === 0) {
        console.error("Error fetching server or no server found:", serverError);
        return;
      }
      
      // `serverData` is an array, we need the first element (the server) to access its channels
      const server = serverData.find(srv => srv.name === "Home") // Get the first server object
      const channels = server?.channel; // Access the channels array

       if (channels && channels.length > 0) {
        const generalChannel = channels.find((channel) => channel.name === "general");
      
        if (generalChannel) {
          setInitialChannel(generalChannel); // Set the initial channel
          router.push(`/servers/${serverId}/channels/${generalChannel.id}`); // Navigate to the general channel
        } else {
          console.error("No general channel found");
        }
      } else {
        console.error("No channels found for the server");
      }   
       } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [user, serverId, router]);

  if (!user || !initialChannel) {
    return <TmaProviderLoading/>; 
  }

  return null; // No content is rendered because of the redirect
};

export default ServerIdPage;
