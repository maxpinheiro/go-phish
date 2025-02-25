import BackLink from '@/components/shared/BackLink';
import TitleBar from '@/components/shared/TitleBar';
import { useThemeContext } from '@/store/theme.store';
import Link from 'next/link';
import React from 'react';

const GuessRunNavbar: React.FC = () => {
  const { color } = useThemeContext();
  const scoresUrl = window.location.pathname.replace('guesses', 'scores') + window.location.search;

  return (
    <TitleBar
      left={<BackLink link="/shows" text="Shows" />}
      center="Guesses"
      right={
        <Link href={scoresUrl} className={`text-${color}`}>
          Leaderboard
        </Link>
      }
      py={0}
    />
  );
};

export default GuessRunNavbar;
