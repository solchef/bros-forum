"use client"
import "./globals.css";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";
import { ModalProvider } from "@/components/providers/modal-provider";
import { SocketProvider } from "@/components/providers/socket-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { TmaSDKProvider } from "@/components/tma";
import { TelegramUserProvider } from "@/components/tma/TelegramUserProvider";
import { MyUser } from "@/components/user";
// import { useInitData } from "@telegram-apps/sdk-react";

const font = Open_Sans({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "BROSCAMS",
//   description: "$BROS A community for Bros to discuss/share new scheme ideas.",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const initData = useInitData();

  return (
   
      <html lang="en">
        <body className={cn(font.className, "bg-white dark:bg-[#313338]")}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            storageKey="discord-theme"
          >
           {/* <MyUser/> */}
          
            {/* Uncomment these if you want to use them */}
            <TmaSDKProvider>
            <TelegramUserProvider>
            <SocketProvider>
              <ModalProvider />
               <QueryProvider>
                {children}
                </QueryProvider>
            </SocketProvider> 
            </TelegramUserProvider>
            </TmaSDKProvider>
          </ThemeProvider> 
        </body>
      </html>
 
  );
}


// "use client"; // Marking this as a client component

// // import { ClerkProvider } from "@clerk/nextjs";
// import "./globals.css";
// import { Open_Sans } from "next/font/google";
// import { ThemeProvider } from "@/components/providers/theme-provider";
// import { cn } from "@/lib/utils";
// import { TmaSDKProvider } from "@/components/tma";
// import { useInitData } from "@telegram-apps/sdk-react";
// // import { metadata } from "./layoutMetadata"; // Importing metadata

// const font = Open_Sans({ subsets: ["latin"] });

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <TmaSDKProvider>
//       <InnerLayout>{children}</InnerLayout>
//     </TmaSDKProvider>
//   );
// }

// function InnerLayout({ children }: { children: React.ReactNode }) {
//   const initData = useInitData();
//   const user = initData?.user;

//   return (
//     <html lang="en">
//       <body className={cn(font.className, "bg-white dark:bg-[#313338]")}>
//         <ThemeProvider
//           attribute="class"
//           defaultTheme="dark"
//           enableSystem
//           storageKey="discord-theme"
//         >
//           <p>User ID: {user?.id}</p>
//           <p>Username: {user?.username}</p>
//           <p>First Name: {user?.firstName}</p>
//           <p>Last Name: {user?.lastName}</p>
//           <p>hello</p>
//           {/* {children} */}
//           {/* Uncomment these if you want to use them */}
//           {/* <SocketProvider>
//             <ModalProvider />
//             <QueryProvider>{children}</QueryProvider>
//           </SocketProvider> */}
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }
