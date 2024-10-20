import { supabase } from "@/lib/supabaseClient";
import { Profile } from "@/lib/types";
import * as Avatar from "@radix-ui/react-avatar";
import { useEffect, useState } from "react";

const ForumMembers = () => {
  const [members, setMembers] = useState<Profile[] | null>(null);

  const fetchForumMembers = async () => {
    const { data: users, error } = await supabase.from("profile").select();

    if (!error) {
      setMembers(users);
    }
  };

  useEffect(() => {
    fetchForumMembers();
  }, []);

  return (
    <div className="flex flex-col w-full mt-auto absolute bottom-20 top-10">

      {/* Scrollable Container */}
      <div className="max-h-40 overflow-y-auto space-y-4">
        <ul className="space-y-2 flex flex-row flex-wrap items-start gap-4">
          {members?.map((member) => (
            <li key={member.id} className="flex flex-col items-center w-24">
              {/* Avatar from Radix UI */}
              <div>
                <Avatar.Root className="inline-flex items-center justify-center overflow-hidden w-10 h-10 rounded-full border border-gray-200">
                  <Avatar.Image
                    src={member.userimage}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                  <Avatar.Fallback
                    delayMs={600}
                    className="bg-gray-300 text-white flex items-center justify-center w-full h-full"
                  >
                    {member.name[0]}
                  </Avatar.Fallback>
                </Avatar.Root>
              </div>

              {/* Member Info */}
              <div className="mt-2">
                <h6 className="text-sm font-semibold">{member.name}</h6>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ForumMembers;
