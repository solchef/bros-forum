// import { db } from "@/lib/db";


// export const initialProfile = async () => {
//   const user = await currentUser();

//   if (!user) return redirectToSignIn();

//   const profile = await db.profile.findUnique({
//     where: { userId: user.id },
//   });

//   if (profile) return profile;

//   const newProfile = await db.profile.create({
//     data: {
//       userId: user.id,
//       name: `${user.firstName} ${user.lastName}`,
//       imageUrl: user.imageUrl,
//       email: user.emailAddresses[0].emailAddress,
//     },
//   });

//   return newProfile;
// };


import { supabase } from '@/lib/supabaseClient';

export const initialProfile = async (user:any) => {
  if (!user) return null;

  // Fetch profile if it exists
  const { data: profile, error } = await supabase
    .from('profile')
    .select('*')
    .eq('userid', user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error("Error fetching profile: ", error);
    return null;
  }

  // If the profile exists, return it
  if (profile) return profile;

  // Create new profile
  const { data: newProfile, error: insertError } = await supabase
    .from('profile')
    .insert([
      {
        userId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        imageUrl: user.photoUrl || '', 
        email: user.username || '', 
      }
    ])
    .single();

  if (insertError) {
    console.error("Error creating new profile: ", insertError);
    return null;
  }

  return newProfile;
};
