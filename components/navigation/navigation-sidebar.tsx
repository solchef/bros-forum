// import { currentProfile } from "@/lib/current-profile";
// import { db } from "@/lib/db";
// import { redirect } from "next/navigation";
// import React from "react";
// import { NavigationAction } from "./navigation-action";
// import { Separator } from "@/components/ui/separator";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { NavigationItem } from "./navigation-item";
// import { ModeToggle } from "../mode-toggle";

// const NavigationSidebar = async () => {
//   const profile = await currentProfile();

//   if (!profile) return redirect("/");

//   const servers = await db.server.findMany({
//     where: {
//       members: {
//         some: {
//           profileId: profile.id,
//         },
//       },
//     },
//   });

//   return (
//     <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3">
//       <NavigationAction />
//       <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
//       <ScrollArea className="flex-1 w-full">
//         {servers.map((server) => (
//           <div key={server.id} className="mb-4">
//             <NavigationItem
//               id={server.id}
//               imageUrl={server.imageUrl}
//               name={server.name}
//             />
//           </div>
//         ))}
//       </ScrollArea>

//       <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
//         <ModeToggle />
//         {/* <UserButton 
//           afterSignOutUrl="/"
//           appearance={
//             {
//               elements:{
//                 avatarBox: "h-[48px] w-[48px]"
//               }
//             }
//           }
//         /> */}
//       </div>
//     </div>
//   );
// };

// export default NavigationSidebar;

"use client"

import { Separator } from '@radix-ui/react-dropdown-menu';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { createClient } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react';
import { ModeToggle } from '../mode-toggle';
import { NavigationAction } from './navigation-action';
import { NavigationItem } from './navigation-item';
import { Avatar } from '@radix-ui/react-avatar';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const NavigationSidebar = () => {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const { data: serversData, error } = await supabase
          .from('server') // Replace 'servers' with your actual table name
          .select('*');    // Adjust the select query as per your data needs

        if (error) {
          console.error('Error fetching servers:', error);
          return;
        }

        setServers(serversData || []); // Set fetched servers data to state
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServers();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Optional loading state
  }

  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3">
    <NavigationAction />
    <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
    <ScrollArea className="flex-1 w-full">
      {servers.map((server) => (
        <div key={server.id} className="mb-4">
          <NavigationItem
            id={server.id}
            imageUrl={server.imageurl}
            name={server.name}
          />
        </div>
      ))}
    </ScrollArea>

    <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
      <ModeToggle />
      {/* <UserButton 
        afterSignOutUrl="/"
        appearance={
          {
            elements:{
              avatarBox: "h-[48px] w-[48px]"
            }
          }
        }
      /> */}
      {/* <Avatar  /> */}
    </div>
  </div>
  );
};

export default NavigationSidebar;
