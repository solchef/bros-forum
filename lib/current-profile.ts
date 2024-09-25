// import { db } from "@/lib/db";
// // import { useInitData } from "@telegram-apps/sdk-react";

import { supabase } from "./supabaseClient";

// export const currentProfile = async (user:any) => {
//   if (!user || !user.id) return null;

//   const profile = await db.profile.findFirst({
//     where: { userId: user.id },
//   });

//   return profile;
// };



export const currentProfile = async (user: any) => {
  if (!user || !user.id) return null;
  // console.log(user)
  const { data: profile, error } = await supabase
    .from("profile")
    .select("*")
    .eq("id", user.id)
    .single(); // Fetch a single profile row
    // console.log(profile)

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return profile;
};
