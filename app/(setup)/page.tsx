"use client";

import InitialModal from "@/components/modals/initial-modal";
import { supabase } from "@/lib/supabaseClient";
import { initialProfile } from "@/lib/initial-profile";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTelegramUser } from "@/components/tma/TelegramUserProvider";

const SetupPage = () => {
  const user = useTelegramUser();
  const router = useRouter();

  useEffect(() => {
    const setupUserProfile = async () => {
      if (!user) return;

      // Fetch or create the initial profile using Supabase
      const profile = await initialProfile(user);

      console.log(profile);

      // Query the server data to see if the user is part of any servers
      const { data: server, error } = await supabase
        .from('server')
        .select('*')
        // .eq('member.profileId', profile.id)+
        .single();

      if (error) {
        console.error('Error fetching server:', error);
      }

      // If no server found, redirect to a specific server
      if (!server) {
        router.push(`/servers/befaa09a-4f37-47ab-88a4-8b147a88e160/channels/a58d6f87-8b62-41d1-b83c-b08598a8b548`);
      }
    };

    setupUserProfile();
  }, [user, router]);

  return null;
  // return <InitialModal />;  // Uncomment if you want the modal to be shown before redirecting
};

export default SetupPage;
