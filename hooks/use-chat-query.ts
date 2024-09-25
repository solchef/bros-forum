// import qs from "query-string";
// import { useInfiniteQuery } from "@tanstack/react-query";

// import { useSocket } from "@/components/providers/socket-provider";

// interface ChatQueryProps {
//   queryKey: string;
//   apiUrl: string;
//   paramKey: "channelId" | "conversationId";
//   paramValue: string;
// }

// export const useChatQuery = ({
//   queryKey,
//   apiUrl,
//   paramKey,
//   paramValue,
// }: ChatQueryProps) => {
//   const { isConnected } = useSocket();

//   const fetchMessages = async ({ pageParam = undefined }) => {
//     const url = qs.stringifyUrl(
//       {
//         url: apiUrl,
//         query: {
//           cursor: pageParam,
//           [paramKey]: paramValue,
//         },
//       },
//       { skipNull: true }
//     );

//     const res = await fetch(url);
//     return res.json();
//   };

//   const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
//     useInfiniteQuery({
//       queryKey: [queryKey],
//       queryFn: fetchMessages,
//       getNextPageParam: (lastPage) => lastPage?.nextCursor,
//       refetchInterval: isConnected ? false : 1000,
//     });

//   return {
//     data,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//     status,
//   };
// };


import qs from "query-string";
import { useInfiniteQuery } from "@tanstack/react-query";

import { useSocket } from "@/components/providers/socket-provider";

interface ChatQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  userId: string; // Add userId as a parameter
}

export const useChatQuery = ({
  queryKey,
  apiUrl,
  paramKey,
  paramValue,
  userId, // Expecting userId to be passed to this hook
}: ChatQueryProps) => {
  const { isConnected } = useSocket();

  const fetchMessages = async ({ pageParam = undefined }) => {
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          cursor: pageParam,
          [paramKey]: paramValue,
        },
      },
      { skipNull: true }
    );
// console.log(userId)
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId, // Pass the userId as a header
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch messages");
    }

    return res.json();
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [queryKey],
      queryFn: fetchMessages,
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      refetchInterval: isConnected ? false : 1000,
    });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
};
