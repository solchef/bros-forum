"use client"; 

import React, { useEffect, useState } from "react";
import { useTelegramUser } from "@/components/tma/TelegramUserProvider"; 
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient"; 
// import ServerSidebar from "@/components/server/server-sidebar"; 
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
  const user = useTelegramUser(); 
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [server, setServer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
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
          .eq("member.profileid", profileData.id); 
        if (serverError || !serverData || serverData.length === 0) {
          console.error(
            "Error fetching server or user not a member:",
            serverError
          );
          router.push("/");
          return;
        }

        setServer(serverData[0]);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
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
        {/* <ServerSidebar serverId={serverId} /> */}
      </div>
      <main className="h-full md:pl-60">
        {children}
      </main>
    </div>
  );
};

export default ServerIdLayout;
