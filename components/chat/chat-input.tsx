import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import qs from "query-string";
import { Form, FormField, FormControl, FormItem } from "@/components/ui/form";
import { Plus } from "lucide-react";
import { EmojiPicker } from "@/components/emoji-picker";
import { useModal } from "@/hooks/use-modal-store";

interface ChatInputProps {
  apiUrl: string;
  member: any;
  query: Record<string, any>;
  name: string;
  type: "conversation" | "channel";
}

const formSchema = z.object({
  content: z.string().min(1),
});

export const ChatInput: React.FC<ChatInputProps> = ({
  apiUrl,
  member,
  query,
  name,
  type,
}) => {
  const { onOpen } = useModal();

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      content: "",
    },
    resolver: zodResolver(formSchema),
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });

      await axios.post(url, values, {
        headers: {
          "x-user-id": member.id,
        },
      });

      form.reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="content"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-5 pb-6">
                  <button
                    type="button"
                    onClick={() => onOpen("messageFile", { apiUrl, query })}
                    className="absolute top-7 left-8 h-6 w-6 bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
                  >
                    <Plus className="h-5 w-5 text-white dark:text-[#313338]" />
                  </button>
                  <textarea
                    disabled={isLoading}
                    placeholder={`Message ${
                      type === "conversation" ? "" : "#"
                    }${name}`}
                    className="
                      px-8 py-3 bg-zinc-200/90 dark:bg-zinc-700/75 
                      border-none focus-visible:ring-0 focus-visible:ring-offset-0 
                      text-zinc-600 dark:text-zinc-200 resize-none
                    "
                    rows={1}
                    {...field}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault(); // Prevent newline
                        form.handleSubmit(onSubmit)(); // Call the send function
                      }
                    }}
                    style={{width:"100%"}}
                  />

                  <div className="absolute top-8 right-8">
                    <EmojiPicker
                      onChange={(emoji: string) =>
                        field.onChange(`${field.value} ${emoji}`)
                      }
                    />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
