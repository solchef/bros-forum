import { createClient } from "@supabase/supabase-js";
import { NextApiRequest, NextApiResponse } from "next";
import { currentProfile } from "@/lib/current-profile";
import { supabase } from "@/lib/supabaseClient";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const memberId = req.headers['x-user-id'];

    const usr = {id:memberId}

    // console.log(usr)

    const profile = await currentProfile(usr);
    
    // Access the member ID from the x-user-id header

    const { content, fileUrl } = req.body;
    const { serverId, channelId } = req.query;



    // if (!profile) return res.status(401).json({ message: "Unauthorized" });
    // if (!serverId) return res.status(400).json({ message: "Server id is required" });
    // if (!channelId) return res.status(400).json({ message: "Channel id is required" });
    // if (!content) return res.status(400).json({ message: "Content is required" });
    // if (!memberId) return res.status(400).json({ message: "Member ID is required" });
    
    // // Fetch the server and ensure the user is a member
    // const { data: server, error: serverError } = await supabase
    //   .from("server")
    //   .select("id, member!inner(profileId)")
    //   .eq("id", serverId as string)
    //   .eq("members.profileId", profile.id)
    //   .single();

      // console.log(server)

    // if (serverError || !server) {
    //   return res.status(404).json({ message: "Server not found or unauthorized" });
    // }

    // // Fetch the channel to ensure it belongs to the server
    // const { data: channel, error: channelError } = await supabase
    //   .from("channel")
    //   .select("id")
    //   .eq("id", channelid as string)
    //   .eq("serverid", serverId as string)
    //   .single();

    // if (channelError || !channel) {
    //   return res.status(404).json({ message: "Channel not found" });
    // }

    // // Fetch the member details using the memberId from the header
    // console.log(memberId, serverId)
    const { data: member, error: memberError } = await supabase
      .from("member")
      .select("id")
      .eq("profileid", profile.id) // Use memberId from the header here
      .eq("serverid", serverId)
      .single();

      // console.log(memberError)

    if (memberError || !member) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // console.log({
    //   content,
    //   fileurl: fileUrl,
    //   memberid: member.id,
    //   channelid: channel.id,
    // })

    // Create a new message in the specified channel
    const { data: message, error: messageError } = await supabase
      .from("message")
      .insert({
        content,
        fileurl: fileUrl,
        memberid: member.id,
        channelid: channelId, 
      })
      .select(`
        id, content, fileurl, createdat,
        member (
          id, profile (*)
        )
      `)
      .single();

      // console.log(message)

    if (messageError) {
      console.log("[SUPABASE_CREATE_MESSAGE_ERROR]", messageError);
      return res.status(500).json({ message: "Failed to create message" });
    }

    const channelKey = `chat:${channelId}:messages`;
    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json({ message });
  } catch (error) {
    console.log("[MESSAGES_POST_ERROR]", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}