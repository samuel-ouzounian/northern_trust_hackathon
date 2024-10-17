import StoreProvider from "@/lib/store/storeProvider";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <StoreProvider>
      <Html lang="en">
        <Head />
        <body className="antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    </StoreProvider>
  );
}
