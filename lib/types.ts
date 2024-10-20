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
    imageurl:string;
    channel: Channel[];
    member: Member[];
  }
  
  export interface Channel {
    id: string;
    name: string;
    type: ChannelType;
    serverid:string;
    profileid:string;
  }
  
  export interface Member {
    id: string;
    role: MemberRole;
    profileid: string;
    profile: { name: string }[];
    createdat:Date;
    updatedat:Date
  }

  export interface Profile {
    id: string;
    name: string;
    userimage: string;
  }

  export interface Message {
    id: string;
    content: string;
    fileurl:string;
    deleted:boolean;
    profileid: string;
    createdat:Date;
    updatedat:Date;
    member:Member
  }
  

  export interface UserProfile {
    id:String;
    username: String;
    first_name:String;
    last_name:String;
    profileimage:String;
  }
  