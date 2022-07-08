import { SWRConfig } from 'swr';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';
import { NotificationsProvider } from '@mantine/notifications';
import AppstateProvider from '../context/Appstate';
import BrowserConfig from '../components/BrowserConfig';
import Refresh from '../components/Refresh';
import Overlay from '../components/Overlay';
import Navigation from '../components/Navigation';

// Styles
import '../styles/reset.css';

export default function Dashboard({ Component, pageProps }) {
  //
  // const preferredColorScheme = useColorScheme();

  return (
    <ClerkProvider {...pageProps}>
      <SWRConfig
        value={{
          fetcher: async (...args) => {
            const res = await fetch(...args);
            return res.json();
          },
          refreshInterval: 5000,
        }}
      >
        <Refresh />
        <BrowserConfig />
        <SignedIn>
          <NotificationsProvider position='top-right'>
            <AppstateProvider>
              <Navigation>
                <Component {...pageProps} />
              </Navigation>
              <Overlay />
            </AppstateProvider>
          </NotificationsProvider>
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </SWRConfig>
    </ClerkProvider>
  );
}
