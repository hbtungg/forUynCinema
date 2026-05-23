'use client';
import { SessionProvider } from "next-auth/react";
import { AuthModalProvider } from "@/context/AuthModalContext"; 

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <AuthModalProvider>
        {children}
      </AuthModalProvider>
    </SessionProvider>
  );
}