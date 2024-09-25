// import { db } from "@/lib/db";
// import { User } from "@telegram-apps/sdk-react"; // Adjust import based on your actual setup

import { supabase } from "./supabaseClient";

// export const currentProfilePages = async (user: User | null) => {
//   if (!user || !user.id) return null;

//   const profile = await db.profile.findFirst({
//     where: { userId: user.id.toString() },
//   });

//   return profile;
// };


export const currentProfilePages = async (user: any) => {
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
