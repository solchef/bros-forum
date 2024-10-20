import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types";
import { currentProfilePages } from "@/lib/current-profile-pages";
import { supabase } from "@/lib/supabaseClient";
import { currentProfile } from "@/lib/current-profile";
import { MemberRole } from "@/lib/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "DELETE" && req.method !== "PATCH")
    return res.status(405).json({ message: "Method not allowed" });

  try {
    // console.log(JSON.parse(req?.query?.user).id)
    const profile = await currentProfile(JSON.parse(req?.query?.user));
    // console.log("profile",profile)
    const { serverId, channelId, messageId } = req.query;
    const { content } = req.body;

    if (!profile) return res.status(401).json({ message: "Unauthorized" });
    if (!serverId)
      return res.status(400).json({ message: "Server id is required" });
    if (!channelId)
      return res.status(400).json({ message: "Channel id is required" });
    if (!messageId)
      return res.status(400).json({ message: "Message id is required" });

    let { data: server } = await supabase
      .from('server')
      .select('*, member(*)')
      .eq('id', serverId)
      .filter('member.profileid', 'eq', profile.id);

    server = server[0]

    // console.log(server)

    if (!server) return res.status(404).json({ message: "Server not found" });

    let { data: channel } = await supabase
      .from('channel')
      .select('*')
      .eq('id', channelId)
      .eq('serverid', serverId);

    channel = channel[0]


    if (!channel) return res.status(404).json({ message: "Channel not found" });

    const member = server?.member.find(
      (member) => member.profileid === profile.id
    );

    if (!member) return res.status(401).json({ message: "Unauthorized" });

    let { data: message } = await supabase
      .from('message')
      .select(`
      *,
      member (
        *,
        profile (*)
      )
    `)
      .eq('id', messageId)
      .eq('channelid', channelId);

    //   console.log(messageId, channelId)

    message = message[0];


    if (!message || message.deleted)
      return res.status(404).json({ message: "Message not found" });

    const isMessageOwner = message.member.profileid === profile.id;
    // console.log(message.member.profileid,profile.id, isMessageOwner);

    const isAdmin = member.role === MemberRole.ADMIN;
    const isModrator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModrator;

    if (!canModify) return res.status(401).json({ message: "Unauthorized" });

    // console.log(req.method)
    if (req.method === "DELETE") {
      const { data: message, error } = await supabase
        .from('message')  // Specify the 'message' table
        .update({
          fileurl: null,
          content: "This thread has been deleted",
          deleted: true,
        })
        .eq('id', messageId)  // Filter by message ID
        .select(`
        *, 
        member (
          *,  
          profile (*)
        )
      `);

      // console.log(message, error)

    }

    if (req.method === "PATCH") {
      if (!isMessageOwner)
        return res.status(401).json({ message: "Unauthorized" });

      const { data: message, error } = await supabase
        .from('message')  // Specify the 'message' table
        .update({
          content: content,  // Update the content with the new value
        })
        .eq('id', messageId)  // Filter by message ID
        .select(`
            *, 
            member (
              *, 
              profile (*) 
            )
          `);

    }
    const updateKey = `chat:${channelId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGE_ID] ERROR: ", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}

