import { selectSideNavOpen, setSideNavOpen } from '@/store/settings.store';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const NavMenu: React.FC = () => {
  const dispatch = useDispatch();
  const sideNavOpen = useSelector(selectSideNavOpen);

  return (
    <div className={`navmenu--container ${sideNavOpen && 'navmenu--open'}`}>
      <div className="navmenu--toggle cursor-pointer" onClick={() => dispatch(setSideNavOpen(!sideNavOpen))}>
        <div className="navmenu--toggle-bar navmenu--toggle-bar--top" />
        <div className="navmenu--toggle-bar navmenu--toggle-bar--middle" />
        <div className="navmenu--toggle-bar navmenu--toggle-bar--bottom" />
      </div>
    </div>
  );
};

export default NavMenu;
