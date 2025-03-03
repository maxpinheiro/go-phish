import Navbar from '@/components/shared/Navbar';
import { environment } from '@/graphql/relay/relayEnvironment';
import { store } from '@/store/app.store';
import { SongContextWrapper } from '@/store/song.store';
import { ThemeWrapper } from '@/store/theme.store';
import '@/styles/globals.css';
import '@/styles/navmenu.styles.scss';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { AppProps } from 'next/app';
import { DefaultToastOptions, Toaster } from 'react-hot-toast';
import 'react-loading-skeleton/dist/skeleton.css';
import Modal from 'react-modal';
import { Provider } from 'react-redux';
import { RelayEnvironmentProvider } from 'react-relay';

Modal.setAppElement('#__next');

const toastOptions: DefaultToastOptions = {
  success: {
    style: {
      border: 'solid 1.5px green',
      background: 'white',
      color: 'green',
    },
  },
  error: {
    style: {
      border: 'solid 1.5px red',
      background: 'white',
      color: 'red',
    },
  },
};

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class">
        <ThemeWrapper>
          <SongContextWrapper>
            <Provider store={store}>
              <RelayEnvironmentProvider environment={environment}>
                <Toaster position="top-right" toastOptions={toastOptions} />
                <div className={`w-screen min-h-screen flex flex-col relative raleway-ksjdkwjew`}>
                  <Navbar />
                  <Component {...pageProps} />
                </div>
              </RelayEnvironmentProvider>
            </Provider>
          </SongContextWrapper>
        </ThemeWrapper>
      </ThemeProvider>
    </SessionProvider>
  );
}
