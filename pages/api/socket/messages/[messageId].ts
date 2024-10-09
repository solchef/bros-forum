import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types";
import { currentProfilePages } from "@/lib/current-profile-pages";
import { supabase } from "@/lib/supabaseClient";
import { currentProfile } from "@/lib/current-profile";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "DELETE" && req.method !== "PATCH")
    return res.status(405).json({ message: "Method not allowed" });

  try {
    const profile = await currentProfile(req);
    const { serverId, channelId, messageId } = req.query;
    const { content } = req.body;

    if (!profile) return res.status(401).json({ message: "Unauthorized" });
    if (!serverId)
      return res.status(400).json({ message: "Server id is required" });
    if (!channelId)
      return res.status(400).json({ message: "Channel id is required" });
    if (!messageId)
      return res.status(400).json({ message: "Message id is required" });

    const { data: server } = await supabase
      .from('server')  // Assuming your table name is 'server'
      .select('*, member(*)')  // Select all fields from the server and include 'members'
      .eq('id', serverId)  // Filter for the specific server ID
      .filter('members.profileId', 'eq', profile.id);  // Filter where members contain the given profile ID


    if (!server) return res.status(404).json({ message: "Server not found" });

    const { data: channel } = await supabase
      .from('channel')  // Assuming your table name is 'channel'
      .select('*')      // Select all fields from the 'channel' table
      .eq('id', channelId)  // Filter by channelId
      .eq('serverId', server.id);  // Filter by serverId


    if (!channel) return res.status(404).json({ message: "Channel not found" });

    const member = server?.member.find(
      (member) => member.profileId === profile.id
    );

    if (!member) return res.status(401).json({ message: "Unauthorized" });

    const { data: message } = await supabase
      .from('message')  // Assuming the table is called 'message'
      .select(`
      *,
      member (
        *,
        profile (*)
      )
    `)  // Select all fields, and include the 'member' and 'profile' relationships
      .eq('id', messageId)  // Filter by messageId
      .eq('channelId', channel.id);  // Filter by channelId

    if (!message || message.deleted)
      return res.status(404).json({ message: "Message not found" });

    const isMessageOwner = message.memberid === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModrator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModrator;

    if (!canModify) return res.status(401).json({ message: "Unauthorized" });

    if (req.method === "DELETE") {
      const { data: message, error } = await supabase
        .from('message')  // Specify the 'message' table
        .update({
          fileUrl: null,
          content: "This message has been deleted",
          deleted: true,
        })
        .eq('id', message.id)  // Filter by message ID
        .select(`
    *,  // Select all fields from the 'message' table
    member (
      *,  // Select all fields from the 'member' table
      profile (*)  // Select all fields from the 'profile' table within 'member'
    )
  `);

    }

    if (req.method === "PATCH") {
      if (!isMessageOwner)
        return res.status(401).json({ message: "Unauthorized" });

      const { data: message, error } = await supabase
        .from('message')  // Specify the 'message' table
        .update({
          content: content,  // Update the content with the new value
        })
        .eq('id', message.id)  // Filter by message ID
        .select(`
    *,  // Select all fields from the 'message' table
    member (
      *,  // Select all fields from the 'member' table
      profile (*)  // Select all fields from the 'profile' table within 'member'
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

