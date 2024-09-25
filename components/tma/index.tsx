"use client"; // Marking this as a client component

import { PropsWithChildren } from "react";
import { SDKProvider } from "@telegram-apps/sdk-react";

export function TmaSDKProvider({ children }: PropsWithChildren) {
  return (
    <SDKProvider
      acceptCustomStyles
      debug
    >
      {children}
    </SDKProvider>
  );
}
