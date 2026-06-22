'use client';
import { SessionProvider } from "next-auth/react";
import { AuthModalProvider } from "@/context/AuthModalContext"; 
import PresenceHeartbeat from "@/components/PresenceHeartbeat";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <PresenceHeartbeat />
      <AuthModalProvider>
        {children}
      </AuthModalProvider>
    </SessionProvider>
  );
}
