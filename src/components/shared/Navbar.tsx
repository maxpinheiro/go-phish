import MoonIcon from '@/media/MoonIcon.svg';
import SunIcon from '@/media/SunIcon.svg';
import BarsIcon from '@/media/BarsIcon.svg';
import CloseIcon from '@/media/CloseIcon.svg';
import { useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { User as SessionUser } from 'next-auth';
import { useDispatch, useSelector } from 'react-redux';
import { selectSideNavOpen, setSideNavOpen } from '@/store/settings.store';
import SideNavbar from './SideNavbar';
import NavMenu from './NavMenu';
import { ThemeColor, useThemeContext } from '@/store/theme.store';
import { useNavbarContext } from '@/store/navbar.store';
import SettingsModal from './SettingsModal';

Modal.setAppElement('#__next');

export interface NavLink {
  label: string;
  href: string;
  onClick?: () => void;
  mobileOnly?: true;
}

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
  const { data: session } = useSession();
  const currentUser: SessionUser | undefined = session?.user;
  const currentUserId = session?.user?.id;
  const currentUserName = session?.user?.username;
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { color, setThemeColor } = useThemeContext();
  // const { settingsModalOpen, setSettingsModalOpen } = useNavbarContext();
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  //const themeCookie = window?.localStorage?.getItem('gophish-theme');

  // useEffect(() => {
  //   const themeCookie = window?.localStorage?.getItem('gophish-theme');
  //   if (themeCookie) {
  //     setThemeColor(themeCookie as ThemeColor);
  //   }
  // }, [window]);

  const navLinks: NavLink[] = [
    {
      label: 'Home',
      href: '/',
      mobileOnly: true,
    },
    {
      label: 'Today',
      href: '/today',
    },
    {
      label: 'Shows',
      href: '/shows',
    },
    {
      label: 'Settings',
      href: '#',
      onClick: () => setSettingsModalOpen(true),
    },
    {
      label: 'About',
      href: '/about',
    },
    {
      label: 'Feedback',
      href: '/feedback',
    },
  ];

  return (
    <>
      <div className="w-full text-white sticky top-0 z-20">
        <div className={`flex justify-between items-center px-5 py-4 bg-${color}`}>
          <div className="md:hidden flex items-center space-x-4">
            {/* <div onClick={() => dispatch(setSideNavOpen(!sideNavOpen))} className="cursor-pointer">
              {sideNavOpen ? <CloseIcon width={24} height={24} /> : <BarsIcon width={24} height={24} />}
            </div> */}
            <NavMenu />
            <div
              className="cursor-pointer flex items-center"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <SunIcon width={20} height={20} /> : <MoonIcon width={20} height={20} />}
            </div>
          </div>
          <div id="logo">
            <Link href="/">
              <div className="flex items-center space-x-2.5">
                <p className="font-normal text-xl">Go Phish</p>
              </div>
            </Link>
          </div>
          <div id="links" className="flex items-center space-x-2.5 text-sm font-medium">
            {currentUserId && currentUserName ? (
              <Link href={`/users/${currentUserName}`}>{currentUserName}</Link>
            ) : (
              <>
                <Link href={`/api/auth/signin?callbackUrl=${router.asPath || '/shows'}`}>Login</Link>
                <Link href={'/signup'}>Signup</Link>
              </>
            )}
            {navLinks.map(
              (link) =>
                !link.mobileOnly && (
                  <Link
                    href={link.href}
                    onClick={link.onClick}
                    className="hidden md:block"
                    key={`navlink-${link.label}`}
                  >
                    {link.label}
                  </Link>
                )
            )}
            <div
              className="cursor-pointer items-center hidden md:flex"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </div>
          </div>
        </div>
      </div>
      <SideNavbar currentUser={currentUser} navLinks={navLinks} />
      {settingsModalOpen && <SettingsModal closeModal={() => setSettingsModalOpen(false)} />}
      {/* {
        <Modal isOpen={settingsModalOpen} onRequestClose={() => setSettingsModalOpen(false)} contentLabel="Settings">
          {<SettingsModal closeModal={() => setSettingsModalOpen(false)} />}
        </Modal>
      } */}
    </>
  );
};

export default Navbar;
