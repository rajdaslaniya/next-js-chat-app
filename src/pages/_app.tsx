import type { AppProps } from "next/app";

import { ThemeProvider } from "@/components/theme-provider";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { Toaster } from "@/components/ui/sonner";
import Loader from "@/components/common/Loader";

import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <Toaster />
      <Loader />
      <Component {...pageProps} />
      <ThemeSwitcher />
    </ThemeProvider>
  );
}
