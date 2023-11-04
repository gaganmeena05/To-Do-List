import "@/styles/globals.css";
import "@mantine/core/styles.css";
import { DEFAULT_THEME, MantineProvider, localStorageColorSchemeManager } from "@mantine/core";
import { RecoilRoot } from "recoil";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }) {

  return (
    <SessionProvider>
      <RecoilRoot>
        <MantineProvider defaultColorScheme="dark">
          <Component {...pageProps} />
        </MantineProvider>
      </RecoilRoot>
    </SessionProvider>
  );
}
