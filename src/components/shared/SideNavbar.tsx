import React from 'react';
import { User as SessionUser } from 'next-auth';
import { AvatarConfig } from '@/types/main';
import { AvatarIconSized } from './Avatar/AvatarIcon';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { selectSideNavOpen, setSideNavOpen } from '@/store/settings.store';
import { useRouter } from 'next/router';
import { useThemeContext } from '@/store/theme.store';
import { NavLink } from './Navbar';

interface SideNavbarProps {
  currentUser: SessionUser | undefined;
  navLinks: NavLink[];
}

const AvatarIcon = ({ avatar }: { avatar: AvatarConfig | undefined }) => (
  <div className="relative w-[100px] h-[100px] bg-black/10 rounded-full">
    {avatar && (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <AvatarIconSized config={avatar} type={avatar.type || 'user'} size={90} />
      </div>
    )}
  </div>
);

const SideNavbar: React.FC<SideNavbarProps> = ({ currentUser, navLinks }) => {
  const sideNavOpen = useSelector(selectSideNavOpen);
  const dispatch = useDispatch();
  const router = useRouter();
  const { color } = useThemeContext();

  const clickLink = (onClick = () => {}) => {
    onClick();
    dispatch(setSideNavOpen(false));
  };

  return (
    <div
      style={{ transition: 'width 0.5s cubic-bezier(0, 0, 0.2, 1) 0s' }}
      className={`z-10 absolute top-0 bottom-0 pt-[60px] ${
        sideNavOpen ? 'w-5/6 px-5' : 'w-0'
      } overflow-hidden bg-${color} text-white`}
    >
      <div className="flex items-center space-x-5 py-5">
        <AvatarIcon avatar={currentUser?.avatarConfig} />
        {currentUser ? (
          <div className="flex flex-col space-y-2">
            <Link href={`/users/${currentUser.username}`} className="text-lg" onClick={() => clickLink()}>
              {currentUser.username}
            </Link>
            <Link href="/auth/signout" className="text-sm">
              sign out
            </Link>
          </div>
        ) : (
          <div className="flex items-center flex-1 justify-around">
            <Link href={`/auth/signin?callbackUrl=${router.asPath || '/shows'}`} onClick={() => clickLink()}>
              login
            </Link>
            <Link href="/auth/signup" onClick={() => clickLink()}>
              signup
            </Link>
          </div>
        )}
      </div>
      <div className="flex flex-col space-y-5">
        {navLinks.map((link) => (
          <Link
            href={link.href}
            onClick={() => clickLink(link.onClick)}
            className="w-max"
            key={`sidenavlink-${link.label}`}
          >
            {link.label}
          </Link>
        ))}
        {currentUser?.admin && (
          <Link href="/admin" onClick={() => clickLink(() => {})} className="w-max">
            Admin
          </Link>
        )}
      </div>
    </div>
  );
};

export default SideNavbar;
