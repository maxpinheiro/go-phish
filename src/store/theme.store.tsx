import { Color } from '@/types/main';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { SkeletonTheme } from 'react-loading-skeleton';

export type ThemeColor = 'red' | 'blue' | 'purple' | 'green';

export const themeHexColor: Record<ThemeColor, Color> = {
  red: '#D45252',
  blue: '#5769C8',
  green: '#A9BA42',
  purple: '#975EC3',
};

type ThemeContextType = {
  color: ThemeColor;
  hexColor: Color;
  setThemeColor: (color: ThemeColor) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  color: 'red',
  hexColor: themeHexColor['red'],
  setThemeColor: () => {},
});

export function ThemeWrapper({ children }: { children: ReactNode }) {
  const [color, setColor] = useState<ThemeColor>('red');
  const hexColor = themeHexColor[color];

  useEffect(() => {
    const themeCookie = typeof window !== 'undefined' ? window.localStorage.getItem('gophish-theme') : undefined;
    if (themeCookie) setColor(themeCookie as ThemeColor);
  }, []);

  const setThemeColor = (newColor: ThemeColor) => {
    if (typeof window !== 'undefined') window.localStorage.setItem('gophish-theme', newColor);
    setColor(newColor);
  };

  const value = {
    color,
    hexColor,
    setThemeColor,
  };

  return (
    <ThemeContext.Provider value={value}>
      <SkeletonTheme baseColor={hexColor} highlightColor="rgba(245, 245, 245, 0.5)">
        {children}
      </SkeletonTheme>
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  return useContext(ThemeContext);
}
