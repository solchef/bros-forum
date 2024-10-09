import { useState } from "react";
import * as Avatar from "@radix-ui/react-avatar";

const ForumUserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("John Doe");
  const [bio, setBio] = useState("Hello! This is my bio.");
  const [userImage, setUserImage] = useState("https://via.placeholder.com/150");

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleSave = () => {
    // Logic to save the updated profile
    setIsEditing(false);
  };

  return (
    <div className="max-w-md   rounded-lg shadow-md space-y-6">
      {/* User Avatar */}
      <div className="flex items-center space-x-4">
        <Avatar.Root className="inline-flex items-center justify-center overflow-hidden w-20 h-20 rounded-full border border-gray-200">
          <Avatar.Image
            src={userImage}
            alt={username}
            className="w-full h-full object-cover"
          />
          <Avatar.Fallback
            delayMs={600}
            className="bg-gray-300 text-white flex items-center justify-center w-full h-full"
          >
            {username[0]}
          </Avatar.Fallback>
        </Avatar.Root>
        <div>
          <h2 className="text-2xl font-bold">{username}</h2>
          <p className="text-sm text-gray-500">{bio}</p>
        </div>
      </div>

      {/* Editable Fields */}
      {isEditing && (
        <div className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={handleEditToggle}
          className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 transition duration-200"
        >
          {isEditing ? "Cancel" : "Edit"}
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

      {/* Settings Section */}
      <div className="space-y-4">
        <h3 className="font-bold">Settings</h3>
        <ul className="space-y-2">
          <li>
            <button className="text-blue-600 hover:underline">
              Change Password
            </button>
          </li>
          <li>
            <button className="text-blue-600 hover:underline">
              Manage Notifications
            </button>
          </li>
          <li>
            <button className="text-blue-600 hover:underline">
              Privacy Settings
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ForumUserProfile;
