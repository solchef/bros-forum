// import React from "react";
// import { useTelegramUser } from "@/components/tma/TelegramUserProvider"; // Adjust import path
// import ServerSidebar from "@/components/server/server-sidebar";
// import { currentProfile } from "@/lib/current-profile";
// import { db } from "@/lib/db";
// import { redirect } from "next/navigation";

// interface ServerIdLayoutProps {
//   children: React.ReactNode;
//   params: {
//     serverId: string;
//   };
// }

// const ServerIdLayout: React.FC<ServerIdLayoutProps> = async ({
//   children,
//   params: { serverId },
// }) => {
//   const user = useTelegramUser(); // Access user data

//   if (!user) {
//     redirect("/sign-in"); // Redirect if user is not available
//     return null; // Prevent rendering
//   }

//   const profile = await currentProfile(user); // Use the user data

//   const server = await db.server.findUnique({
//     where: {
//       id: serverId,
//       members: {
//         some: {
//           profileId: profile?.id?.toString(),
//         },
//       },
//     },
//   });

//   if (!server) return redirect("/");

//   return (
//     <div className="h-full">
//       <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
//         {/* <ServerSidebar serverId={serverId} /> */}
//         <P>servers</P>
//       </div>
//       {/* <main className="h-full md:pl-60">{children}</main> */}
//     </div>
//   );
// };

// export default ServerIdLayout;

"use client"; // This must be a client component

import React, { useEffect, useState } from "react";
import { useTelegramUser } from "@/components/tma/TelegramUserProvider"; // Adjust import path
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient"; // Assuming Supabase client is initialized in utils
import ServerSidebar from "@/components/server/server-sidebar"; // Adjust import if necessary
import { TmaProviderLoading } from "@/components/tma/tma-provider-loading";

interface ServerIdLayoutProps {
  children: React.ReactNode;
  params: {
    serverId: string;
  };
}

const ServerIdLayout: React.FC<ServerIdLayoutProps> = ({
  children,
  params: { serverId },
}) => {
  const user = useTelegramUser(); // Access Telegram user data
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [server, setServer] = useState<any>(null);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return; // Ensure user is available

      try {
        // Fetch the profile based on user information
        const { data: profileData, error: profileError } = await supabase
          .from("profile")
          .select("*")
          .eq("userid", user?.id)
          .single();

        if (profileError || !profileData) {
          console.error("Error fetching profile:", profileError);
          router.push("/sign-in");
          return;
        }

        setProfile(profileData);

        // Fetch the server details and ensure the user is a member of the server
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

        if (serverError || !serverData || serverData.length === 0) {
          console.error(
            "Error fetching server or user not a member:",
            serverError
          );
          router.push("/");
          return;
        }

        setServer(serverData[0]); // Assuming the first server matches
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchData();
  }, [user, serverId, router]);

  if (loading) {
    return <TmaProviderLoading/>;
  }

  if (!profile || !server) {
    return <div>Error loading data or access denied.</div>;
  }

  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        {/* Render the actual ServerSidebar component */}
        <ServerSidebar serverId={serverId} />
      </div>
      <main className="h-full md:pl-60">
        {children}
      </main>
    </div>
  );
};

export default ServerIdLayout;
