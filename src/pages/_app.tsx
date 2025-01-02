import type { AppProps } from "next/app";

import { ThemeProvider } from "@/components/theme-provider";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { Toaster } from "@/components/ui/sonner";
import Loader from "@/components/common/Loader";

import { SocketProvider } from "@/context/socket";

import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SocketProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <Toaster />
        <Loader />
        <Component {...pageProps} />
        <ThemeSwitcher />
      </ThemeProvider>
    </SocketProvider>
  );
}
