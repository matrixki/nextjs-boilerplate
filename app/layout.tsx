"use client";
import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <ChakraProvider>
          <SessionProvider>{children}</SessionProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}
