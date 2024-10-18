import "@/styles/globals.css";
import type { AppProps } from "next/app";
import StoreProvider from "@/lib/store/storeProvider";
import { ThemeProvider } from "@/components/themeProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      // enableSystem
      disableTransitionOnChange
    >
      <StoreProvider>
        <Component {...pageProps} />
      </StoreProvider>
    </ThemeProvider>
  );
}
