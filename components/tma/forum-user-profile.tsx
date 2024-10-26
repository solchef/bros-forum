import { useEffect, useState } from "react";
import * as Avatar from "@radix-ui/react-avatar";
import { useTelegramUser } from "./TelegramUserProvider";
import { UserProfile } from "@/lib/types";
import { Badge, Shield } from "lucide-react";

const ForumUserProfile = () => {
  const user = useTelegramUser();
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>();
  const [bio, setBio] = useState("Hello! This is my bio.");
  const [userImage, setUserImage] = useState("https://via.placeholder.com/150");

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleSave = () => {
    // Logic to save the updated profile
    setIsEditing(false);
  };

  useEffect(() => {
    setUserProfile(user);
  }, []);

  return (
    <div className="flex flex-col w-full mt-auto absolute bottom-20 top-10">
      <div className="flex items-center space-x-4">
        <Avatar.Root className="inline-flex items-center justify-center overflow-hidden w-10 h-10 rounded-full border border-gray-200">
          <Avatar.Image
            src={userProfile?.profileimage || userImage}
            alt="profile"
            className="w-full h-full object-cover"
          />
          <Avatar.Fallback
            delayMs={600}
            className="bg-gray-300 text-white flex items-center justify-center w-full h-full"
          >
            {userProfile?.username}
          </Avatar.Fallback>
        </Avatar.Root>
        <div>
          <h6 className="font-bold">{userProfile?.username}</h6>
          <div className="text-md text-gray-500 flex my-2">
            <span>
              {/* <Shield /> */}
            </span>{" "}
            Public Bros
          </div>
        </div>
      </div>

      {/* Editable Fields */}
    

      {/* Settings Section */}
      {/* <div className="space-y-4">
        <div className="flex space-x-4">
          <button
            onClick={handleEditToggle}
            className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 transition duration-200"
          >
            {isEditing ? "Cancel" : "Connect Wallet"}
          </button>
          {isEditing && (
            <button
              onClick={handleSave}
              className="bg-green-500 text-white rounded-md px-4 py-2 hover:bg-green-600 transition duration-200"
            >
              Save
            </button>
          )}
        </div>
        {isEditing && (
        <div className="space-y-4">
          <input
            type="text"
            // value={userProfile?.username || userProfile?.first_name || userProfile?.last_name}
            // onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full"
            placeholder="Enter your username"
          />
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full"
            placeholder="Enter your bio"
            rows={3}
          />
        </div>
      )}
      </div> */}
    </div>
  );
};

export default ForumUserProfile;
