import Navbar from '@/components/shared/Navbar';
import { store } from '@/store/app.store';
import { ThemeWrapper } from '@/store/theme.store';
import '@/styles/globals.css';
import '@/styles/navmenu.styles.scss';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import { Raleway } from 'next/font/google';
import { DefaultToastOptions, Toaster } from 'react-hot-toast';
import Modal from 'react-modal';
import { Provider } from 'react-redux';

const raleway = Raleway({ subsets: ['latin'] });

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
          <Provider store={store}>
            <Toaster position="top-right" toastOptions={toastOptions} />
            <div className={`w-screen min-h-screen flex flex-col relative ${raleway.className}`}>
              <Navbar />
              <Component {...pageProps} />
            </div>
          </Provider>
        </ThemeWrapper>
      </ThemeProvider>
    </SessionProvider>
  );
}
