// src/lib/types.ts
export enum ChannelType {
    TEXT = "TEXT",
    AUDIO = "AUDIO",
    VIDEO = "VIDEO",
  }
  
  export enum MemberRole {
    GUEST = "GUEST",
    MODERATOR = "MODERATOR",
    ADMIN = "ADMIN",
  }
  
  export interface Server {
    id: string;
    name: string;
    channel: Channel[];
    member: Member[];
  }
  
  export interface Channel {
    id: string;
    name: string;
    type: ChannelType;
  }
  
  export interface Member {
    id: string;
    role: MemberRole;
    profileid: string;
    profile: { name: string }[];
  }
  