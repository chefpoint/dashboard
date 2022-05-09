import { SWRConfig } from 'swr';
import fetch from '../services/fetch.js';
import GlobalProvider from '../services/context';
import BrowserConfig from '../utils/BrowserConfig';
import Refresh from '../utils/Refresh.js';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';

// Styles
import '../styles/globals.css';
import '../styles/icons.css';
import '../styles/common/forms.css';
import '../styles/variables.css';

export default function Kiosk({ Component, pageProps }) {
  return (
    <ClerkProvider {...pageProps}>
      <SWRConfig value={{ fetcher: fetch, refreshInterval: 1000 }}>
        <MantineProvider>
          <NotificationsProvider>
            <ModalsProvider>
              <GlobalProvider>
                <Refresh />
                <BrowserConfig />
                <SignedIn>
                  <Component {...pageProps} />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </GlobalProvider>
            </ModalsProvider>
          </NotificationsProvider>
        </MantineProvider>
      </SWRConfig>
    </ClerkProvider>
  );
}
