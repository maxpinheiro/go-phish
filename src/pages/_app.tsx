import '@/styles/globals.css';
import '@/styles/navmenu.styles.scss';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { Raleway } from 'next/font/google';
import Navbar from '@/components/shared/Navbar';
import { ThemeProvider } from 'next-themes';
import { Provider } from 'react-redux';
import { store } from '@/store/app.store';
import { ThemeWrapper } from '@/store/theme.store';
import Modal from 'react-modal';

const raleway = Raleway({ subsets: ['latin'] });

Modal.setAppElement('#__next');
{
  /* <Modal
          isOpen={settingsModalOpen}
          onRequestClose={() => setModalOpen(false)}
          contentLabel="Settings"
        >
          {<SettingsModal close={() => setModalOpen(false)} />}
        </Modal> */
}

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class">
        <ThemeWrapper>
          <Provider store={store}>
            <div className={`w-screen h-screen flex flex-col relative ${raleway.className}`}>
              <Navbar />
              <Component {...pageProps} />
            </div>
          </Provider>
        </ThemeWrapper>
      </ThemeProvider>
    </SessionProvider>
  );
}
