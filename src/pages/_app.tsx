import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";

import { ThemeProvider } from "@/components/theme-provider";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import Loader from "@/components/common/Loader";

import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ToastContainer />
      <Loader />
      <Component {...pageProps} />
      <ThemeSwitcher />
    </ThemeProvider>
  );
}
