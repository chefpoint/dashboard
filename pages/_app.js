import { SWRConfig } from 'swr';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';
import BrowserConfig from '../utils/BrowserConfig';
import Refresh from '../utils/Refresh.js';
import { NextUIProvider } from '@nextui-org/react';
import { lightTheme, darkTheme } from '../styles/theme';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Styles
import '../styles/globals.css';
import '../styles/icons.css';
import '../styles/common/forms.css';
import '../styles/variables.css';

export default function Dashboard({ Component, pageProps }) {
  //

  // const preferredColorScheme = useColorScheme();

  return (
    <ClerkProvider {...pageProps}>
      <SWRConfig value={{ fetcher: (...args) => fetch(...args).then((res) => res.json()), refreshInterval: 10000 }}>
        <NextUIProvider theme={lightTheme}>
          <Refresh />
          <BrowserConfig />
          <SignedIn>
            <ToastContainer autoClose={3000} />
            <Component {...pageProps} />
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </NextUIProvider>
      </SWRConfig>
    </ClerkProvider>
  );
}
