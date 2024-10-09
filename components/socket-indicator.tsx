"use client"

import { Badge } from "@/components/ui/badge";
import { useSocket } from "@/components/providers/socket-provider";
import { Lock, Shield } from "lucide-react";

export const SocketIndicator = () => {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <Badge variant="outline" className="bg-purple-600 text-white border-none">
        <Shield/>
        Upgrade Membership
      </Badge>
    );
  }

  if (isConnected) {
    return (
      <Badge
        variant="outline"
        className="bg-emerald-600 text-white border-none"
      >
        Live: Real time updates 
      </Badge>
    );
  }
};
