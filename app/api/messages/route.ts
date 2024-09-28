// import { currentProfile } from "@/lib/current-profile";
// import { db } from "@/lib/db";
// import { Message } from "@prisma/client";
// import { NextResponse } from "next/server";

// const MESSAGES_BATCH = 10;

// export async function GET(req: Request) {
//   try {
//     console.log(req)
//     const profile = await currentProfile({});
//     const { searchParams } = new URL(req.url);

//     const cursor = searchParams.get("cursor");
//     const channelId = searchParams.get("channelId");

//     if (!profile) return new NextResponse("Unauthorized", { status: 401 });

//     if (!channelId)
//       return new NextResponse("Missing channelId", { status: 400 });

//     let messages: Message[] = [];
//     if (cursor) {
//       messages = await db.message.findMany({
//         take: MESSAGES_BATCH,
//         skip: 1,
//         cursor: {
//           id: cursor,
//         },
//         where: {
//           channelId,
//         },
//         include: {
//           member: {
//             include: {
//               profile: true,
//             },
//           },
//         },
//         orderBy: {
//           createdAt: "desc",
//         },
//       });
//     } else {
//       messages = await db.message.findMany({
//         take: MESSAGES_BATCH,
//         where: {
//           channelId,
//         },
//         include: {
//           member: {
//             include: {
//               profile: true,
//             },
//           },
//         },
//         orderBy: {
//           createdAt: "desc",
//         },
//       });
//     }

//     let nextCursor = null;

//     if (messages.length === MESSAGES_BATCH) {
//       nextCursor = messages[messages.length - 1].id;
//     }

//     return NextResponse.json({
//       items: messages,
//       nextCursor,
//     });
//   } catch (error) {
//     console.log("[MESSAGES_GET_ERROR]", error);
//     return new NextResponse("Internam Error", { status: 500 });
//   }
// }


import { currentProfile } from "@/lib/current-profile";
import { supabase } from "@/lib/supabaseClient"; // Ensure you have the Supabase client properly configured
import { NextResponse } from "next/server";

const MESSAGES_BATCH = 10;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = req.headers.get('x-user-id') || searchParams.get("userId"); // Retrieve user from headers or query params
    // console.log(userId)
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    // Fetch the profile from Supabase based on the user ID
    const profile = await currentProfile({ id: userId });

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const cursor = searchParams.get("cursor");
    const channelId = searchParams.get("channelId");

    if (!channelId) {
      return new NextResponse("Missing channelId", { status: 400 });
    }

    let messagesQuery = supabase
    .from('message') // Assuming your table is called 'message'
    .select(`
      *,
      member (
        profile (*)
      )
    `) // Join the member's profile
    .eq('channelid', channelId) // Filter by channelId
    .order('createdat', { ascending: false }) // Order by createdAt descending
    .limit(MESSAGES_BATCH);

    if (cursor) {
      messagesQuery = messagesQuery.gt('id', cursor); // If cursor exists, fetch messages after the cursor
    }

    const { data: messages, error } = await messagesQuery;

    if (error) {
      console.error("[SUPABASE_GET_MESSAGES_ERROR]", error);
      return new NextResponse("Internal Error", { status: 500 });
    }

    // Determine the next cursor for pagination
    let nextCursor = null;
    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[messages.length - 1].id;
    }

    return NextResponse.json({
      items: messages,
      nextCursor,
    });
  } catch (error) {
    console.log("[MESSAGES_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

