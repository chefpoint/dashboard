import { SWRConfig } from 'swr';
import fetch from '../services/fetch.js';
import GlobalProvider from '../services/context';
import BrowserConfig from '../utils/BrowserConfig';
import Refresh from '../utils/Refresh.js';

// Styles
import '../styles/globals.css';
import '../styles/icons.css';
import '../styles/common/forms.css';

export default function Kiosk({ Component, pageProps }) {
  return (
    <SWRConfig value={{ fetcher: fetch, refreshInterval: 1000 }}>
      <GlobalProvider>
        <Refresh />
        <BrowserConfig />
        <Component {...pageProps} />
      </GlobalProvider>
    </SWRConfig>
  );
}
