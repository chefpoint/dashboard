import { SWRConfig } from 'swr';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';
import { ToastContainer } from 'react-toastify';
import BrowserConfig from '../components/BrowserConfig';
import Refresh from '../components/Refresh.js';

// Styles
import '../styles/reset.css';
import 'react-toastify/dist/ReactToastify.css';
import Navigation from '../components/Navigation';

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
          <ToastContainer autoClose={3000} />
          <Navigation>
            <Component {...pageProps} />
          </Navigation>
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </SWRConfig>
    </ClerkProvider>
  );
}
