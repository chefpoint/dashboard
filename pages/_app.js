import { SWRConfig } from 'swr';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import BrowserConfig from '../utils/BrowserConfig';
import Refresh from '../utils/Refresh.js';

// Styles
import '../styles/globals.css';
import '../styles/icons.css';
import '../styles/common/forms.css';
import '../styles/variables.css';

export default function Dashboard({ Component, pageProps }) {
  //

  return (
    <ClerkProvider {...pageProps}>
      <SWRConfig value={{ fetcher: (...args) => fetch(...args).then((res) => res.json()), refreshInterval: 60000 }}>
        <MantineProvider>
          <NotificationsProvider>
            <ModalsProvider>
              <Refresh />
              <BrowserConfig />
              <SignedIn>
                <Component {...pageProps} />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </ModalsProvider>
          </NotificationsProvider>
        </MantineProvider>
      </SWRConfig>
    </ClerkProvider>
  );
}
