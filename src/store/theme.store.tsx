import { ReactNode, createContext, useContext, useState } from 'react';

export type ThemeColor = 'red' | 'blue' | 'purple' | 'green';

const safelistColors = '[&_*]:fill-red [&_*]:fill-blue [&_*]:fill-green [&_*]:fill-purple';

type ThemeContextType = {
  color: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;
};

const ThemeContext = createContext<ThemeContextType>({ color: 'red', setThemeColor: () => {} });

export function ThemeWrapper({ children }: { children: ReactNode }) {
  //const themeCookie = window.localStorage.getItem('gophish-theme');
  //const [color, setColor] = useState<ThemeColor>((themeCookie || 'red') as ThemeColor);
  const [color, setColor] = useState<ThemeColor>('green');

  const setThemeColor = (newColor: ThemeColor) => {
    window.localStorage.setItem('gophish-theme', newColor);
    setColor(newColor);
  };

  const value = {
    color,
    setThemeColor,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeContext() {
  return useContext(ThemeContext);
}
