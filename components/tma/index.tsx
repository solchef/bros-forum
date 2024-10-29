"use client"; // Ensures client-side execution

import { PropsWithChildren, useEffect } from "react";
import { SDKProvider } from "@telegram-apps/sdk-react";

export function TmaSDKProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();  // Expands to full height
    }
  }, []);

  return (
    <SDKProvider acceptCustomStyles debug>
      {children}
    </SDKProvider>
  );
}
