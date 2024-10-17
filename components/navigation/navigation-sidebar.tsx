"use client"

import { Separator } from '@radix-ui/react-dropdown-menu';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { createClient } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react';
import { ModeToggle } from '../mode-toggle';
import { NavigationAction } from './navigation-action';
import { NavigationItem } from './navigation-item';
import { supabase } from '@/lib/supabaseClient';

const NavigationSidebar = () => {
  const [servers, setServers] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const { data: serversData, error } = await supabase
          .from('server') 
          .select('*');   

        if (error) {
          console.error('Error fetching servers:', error);
          return;
        }
        // @ts-ignore
        setServers(serversData); 

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

      
      {
      //@ts-ignore
      servers.map((server) => (
        <div key={server.id} className="mb-4">
          <NavigationItem
            id={server.id}
            imageurl={server.imageurl}
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
