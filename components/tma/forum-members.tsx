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
    <div className=" max-w-md space-y-4">

      {/* Scrollable Container */}
      <div className="max-h-80 overflow-y-auto space-y-4">
        <ul className="space-y-4">
          {members?.map((member) => (
            <li key={member.id} className="flex items-center space-x-4">
              {/* Avatar from Radix UI */}
              <Avatar.Root className="inline-flex items-center justify-center overflow-hidden w-12 h-12 rounded-full border border-gray-200">
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

              {/* Member Info */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{member.name}</h3>
                {/* Add additional info here */}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ForumMembers;
