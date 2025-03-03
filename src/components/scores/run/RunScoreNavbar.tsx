import BackLink from '@/components/shared/BackLink';
import TitleBar from '@/components/shared/TitleBar';
import { useThemeContext } from '@/store/theme.store';
import Link from 'next/link';
import React from 'react';

const GuessRunNavbar: React.FC = () => {
  const { color } = useThemeContext();
  const guessesUrl = window.location.pathname.replace('scores', 'guesses') + window.location.search;

  return (
    <TitleBar
      left={<BackLink link="/shows" text="Shows" />}
      center="Leaderboard"
      right={
        <Link href={guessesUrl} className={`text-${color}`}>
          All Guesses
        </Link>
      }
      py={0}
    />
  );
};

export default GuessRunNavbar;
