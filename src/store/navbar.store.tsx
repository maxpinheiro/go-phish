import { ReactNode, createContext, useContext, useState } from 'react';

type NavTab = 'home';

type NavbarContextType = {
  activeTab: NavTab;
  setActiveTab: (newTab: NavTab) => void;
  settingsModalOpen: boolean;
  setSettingsModalOpen: (open: boolean) => void;
};

const NavbarContext = createContext<NavbarContextType>({
  activeTab: 'home',
  setActiveTab: () => {},
  settingsModalOpen: false,
  setSettingsModalOpen: () => {},
});

export function ThemeWrapper({ children }: { children: ReactNode }) {
  //const activeTabCookie = window.localStorage.getItem('gophish-active-tab');
  const [activeTab, setTab] = useState<NavTab>('home');
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  const setActiveTab = (newTab: NavTab) => {
    //window.localStorage.setItem('gophish-active-tab', newTab);
    setTab(newTab);
  };

  const setModal = (b: boolean) => {
    console.log(b);
    setSettingsModalOpen(b);
  };

  const value = {
    activeTab,
    setActiveTab,
    settingsModalOpen,
    setSettingsModalOpen: setModal,
  };

  return <NavbarContext.Provider value={value}>{children}</NavbarContext.Provider>;
}

export function useNavbarContext() {
  return useContext(NavbarContext);
}
