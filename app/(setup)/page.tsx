// "use client";

// import InitialModal from "@/components/modals/initial-modal";
// import { db } from "@/lib/db";
// import { initialProfile } from "@/lib/initial-profile";
// import { redirect } from "next/navigation";
// import { useEffect } from "react";
// import { useTelegramUser } from "@/components/tma/TelegramUserProvider";

// const SetupPage = () => {

//    const user = useTelegramUser();

//   useEffect(() => {
//     const setupUserProfile = async () => {
//       const profile = await initialProfile(user);

//       console.log(profile);

//       const server = await db.server.findFirst({
//         where: {
//           members: {
//             some: {
//               profileId: profile.id,
//             },
//           },
//         },
//       });

//       if (!server) {
//         // redirect(`/servers/1234`);
//         redirect(`/servers/72d2db63-720f-43aa-9d92-5375d79ec90f`);
//       }
//     };

//     setupUserProfile();
//   }, [user]);

//   // return <InitialModal />;
//   // redirect(`/servers/72d2db63-720f-43aa-9d92-5375d79ec90f`);
// };

// export default SetupPage;


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
        // .eq('member.profileId', profile.id)
        .single();

      if (error) {
        console.error('Error fetching server:', error);
      }

      // If no server found, redirect to a specific server
      if (!server) {
        router.push(`/servers/72d2db63-720f-43aa-9d92-5375d79ec90f`);
      }
    };

    setupUserProfile();
  }, [user, router]);

  return null;
  // return <InitialModal />;  // Uncomment if you want the modal to be shown before redirecting
};

export default SetupPage;
