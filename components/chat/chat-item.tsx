"use client";

import * as z from "zod";
import qs from "query-string";
import { Member, MemberRole, Profile } from "@prisma/client";
import { UserAvtar } from "@/components/user-avtar";
import { ActionTooltip } from "../action-tooltip";
import {
  Edit,
  FileIcon,
  Heart,
  Reply,
  ShieldAlert,
  ShieldCheck,
  Trash,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

interface ChatItemProps {
  id: string;
  content: string;
  member: Member & {
    profile: Profile;
  };
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="w-4 h-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="w-4 h-4 ml-2 text-rose-500" />,
};

const formSchema = z.object({
  content: z.string().min(1),
});

export const ChatItem: React.FC<ChatItemProps> = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  deleted,
  currentMember,
  isUpdated,
  socketUrl,
  socketQuery,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [messageLikes, setMessageLikes] = useState(0);
  const [userHasLike, setUserHasLike] = useState(false);
  const params = useParams();
  const router = useRouter();

  const onMemberClick = () => {
    if (currentMember.id === member?.profile.id) return;

    // router.push(`/servers/${params?.serverId}/conversations/${member.profile.id}`);
  };

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape" || event.keyCode === 27) {
        setIsEditing(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });
      await axios.patch(url, values);
      setIsEditing(false);
      form.reset();
    } catch (error) {
      console.log(error);
    }
  };

  const getMessagelikes = async () => {
    const { data: messageLikes } = await supabase
      .from("likes")
      .select("*")
      .eq("messageid", id);
    setMessageLikes(messageLikes ? messageLikes.length : 0);
    setUserHasLike(
      messageLikes?.find((like) => like.profileid === member.profile.id)
    );
  };

  useEffect(() => {
    form.reset({
      content,
    });
    getMessagelikes();
  }, [content]);

  const fileType = fileUrl?.split(".").pop();

  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.profile.id;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isPDF = fileType === "pdf" && fileUrl;
  const isImage = !isPDF && fileUrl;

  const { onOpen } = useModal();

  const onLike = async (id: any) => {
    const { data: existingLike, error: fetchError } = await supabase
      .from("likes")
      .select("*")
      .eq("profileid", member.profile.id)
      .eq("messageid", id)
      .single();

    // if (fetchError) {
    //   console.error("Error fetching like:", fetchError);
    //   return;
    // }

    // console.log(existingLike)
    if (existingLike) {
      // If the record exists, delete it
      const { error: deleteError } = await supabase
        .from("likes")
        .delete()
        .eq("id", existingLike.id); // Assuming there is an "id" column as the primary key

      if (deleteError) {
        console.error("Error deleting like:", deleteError);
      } else {
        setMessageLikes((prev) => prev - 1);
        setUserHasLike(false);
        console.log("Like removed:", existingLike);
      }
    } else {
      // If the record doesn't exist, insert a new like
      const { data: newLike, error: insertError } = await supabase
        .from("likes")
        .insert([{ profileid: member.profile.id, messageid: id }])
        .select();

      if (insertError) {
        console.error("Error inserting like:", insertError);
      } else {
        setMessageLikes((prev) => prev + 1);
        setUserHasLike(true);
        console.log("Like added:", newLike);
      }
    }
  };

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">
        <div
          onClick={onMemberClick}
          className="cursor-pointer hover:drop-shadow-md transition"
        >
          {/* @ts-ignore */}
          <UserAvtar src={member?.profile?.imageurl} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p
                onClick={onMemberClick}
                className="font-semibold text-sm hover:underline cursor-pointer"
              >
                {member.profile.name}
              </p>
              <ActionTooltip label={member.role}>
                {roleIconMap[member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>
          {isImage && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
            >
              <Image
                src={fileUrl}
                alt={content}
                fill
                className="object-cover"
              />
            </a>
          )}
          {isPDF && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
              <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 text-sm ml-2 dark:text-indigo-300 hover:underline"
              >
                PDF File
              </a>
            </div>
          )}

          {!fileUrl && !isEditing && (
            <div
              className={cn(
                "text-sm text-zinc-600 dark:text-zinc-300",
                deleted &&
                  "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
              )}

              style={{ whiteSpace: "pre-line" }}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </div>
          )}
          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex items-center w-full gap-x-2 pt-2`"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            disabled={isLoading}
                            className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 textzinc-600 dark:text-zinc-200"
                            placeholder="Edited message..."
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button size="sm" variant="primary" disabled={isLoading}>
                  Save
                </Button>
              </form>
              <span className="text-[10px] mt-1 text-zinc-400">
                Press escape to cancle, enter to save
              </span>
            </Form>
          )}
        </div>
      </div>
      {!deleted && (
        <div className="flex group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800  rounded-sm">
          {canDeleteMessage && (
            <>
              {canEditMessage && (
                <ActionTooltip label="Edit">
                  <Edit
                    onClick={() => setIsEditing(true)}
                    className="w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 cursor-pointer ml-auto transition"
                  />
                </ActionTooltip>
              )}
              <ActionTooltip label="Delete">
                <Trash
                  onClick={() =>
                    onOpen("deleteMessage", {
                      apiUrl: `${socketUrl}/${id}`,
                      query: socketQuery,
                    })
                  }
                  className="w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 cursor-pointer ml-auto transition"
                />
              </ActionTooltip>
            </>
          )}

          <ActionTooltip label="Like">
            <>
              <span
                className={`text-xs text-gray-500 align-super mb-2`}
                style={{ marginLeft: "0.25rem" }}
              >
                ({messageLikes})
              </span>
              <Heart
                onClick={() => onLike(id)}
                className={`w-4 h-4  ${
                  userHasLike ? "text-red-500" : "text-zinc-500"
                } hover:text-zinc-600 dark:hover:text-zinc-300 cursor-pointer ml-auto transition`}
              />
            </>
          </ActionTooltip>

          <ActionTooltip label="reply">
            <>
              <span
                className="text-xs text-gray-500 align-super mb-2"
                style={{ marginLeft: "0.25rem" }}
              >
                ({messageLikes})
              </span>
              <Reply
                onClick={() =>
                  onOpen("deleteMessage", {
                    apiUrl: `${socketUrl}/${id}`,
                    query: socketQuery,
                  })
                }
                className="w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 cursor-pointer ml-auto transition"
              />
            </>
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};
