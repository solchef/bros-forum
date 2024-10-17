"use client";
import "./globals.css";
// import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";
import { ModalProvider } from "@/components/providers/modal-provider";
import { SocketProvider } from "@/components/providers/socket-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { TmaSDKProvider } from "@/components/tma";
import { TelegramUserProvider } from "@/components/tma/TelegramUserProvider";
import Image from "next/image";
import { useState, useEffect } from "react";
import '../global.css'
// import { useInitData } from "@telegram-apps/sdk-react";

const font = Open_Sans({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "BROSCAMS",
//   description: "$BROS A community for Bros to discuss/share new scheme ideas.",
// };

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error("Error in rendering:", error);
    return <div>Something went wrong</div>;
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Simulating a loading delay of 2 seconds

    return () => clearTimeout(timer); // Cleanup the timeout if component unmounts
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-[#313338]">
        <Image src={"/logo.svg"} alt={"Broscams"} width={100} height={100} />
        <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full text-blue-500"></div>
      </div>
    );
  }

  return (
    <html lang="en">
      <body className={cn(font.className, "bg-white dark:bg-[#313338]")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          storageKey="discord-theme"
        >
          <ErrorBoundary>
            <TmaSDKProvider>
              <TelegramUserProvider>
                <SocketProvider>
                  <ModalProvider />
                  <QueryProvider>{children}</QueryProvider>
                </SocketProvider>
              </TelegramUserProvider>
            </TmaSDKProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}