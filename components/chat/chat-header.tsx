import { Hash, Shield } from "lucide-react";
import { MobileToggle } from "../mobile-toggel";
import { UserAvtar } from "../user-avtar";
import { SocketIndicator } from "../socket-indicator";
import { ChatVideoButton } from "./chat-video-button";
import { Badge } from "../ui/badge";

interface ChatHeaderProps {
  name: string;
  serverId: string;
  type: "channel" | "conversation";
  imageurl?: string;
  serverName: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  name,
  serverId,
  type,
  imageurl,
  serverName,
}) => {
  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
      <MobileToggle serverId={serverId} />
      {type === "conversation" && (
        <UserAvtar
          src={imageurl}
          className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2"
        />
      )}
      {/* {type === "channel" && (
        <Hash className="h-6 w-6 text-zinc-500 dark:text-zinc-400 mr-2" />
      )} */}
      <div className="mx-2 py-2">
        <h4 className="font-semibold text-md text-black dark:text-white ">
          {serverName}
        </h4>
        {/* <p className="font-light text-sm text-black dark:text-white ">#{name}</p> */}
      </div>
      <div className="ml-auto flex items-center">
        {/* {type === "conversation" && <ChatVideoButton />}
        <SocketIndicator /> */}
        <Badge
          variant="outline"
          className="bg-purple-600 text-white border-none"
        >
          <Shield size={24} />
          UPGRADE
        </Badge>
      </div>
    </div>
  );
};
