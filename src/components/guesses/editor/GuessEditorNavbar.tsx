import BackLink from '@/components/shared/BackLink';
import TitleBar from '@/components/shared/TitleBar';
import { selectShow } from '@/store/guessEditor.store';
import { useThemeContext } from '@/store/theme.store';
import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';

const GuessEditorNavbar: React.FC = () => {
  const { color } = useThemeContext();
  const show = useSelector(selectShow);
  const guessesUrl = show && `/guesses/run/${show.run.id}?night=${show.runNight}`;

  return (
    <TitleBar
      left={<BackLink text="Back" />}
      center="Guesses"
      right={
        guessesUrl ? (
          <Link href={guessesUrl} className={`text-${color}`}>
            All Guesses
          </Link>
        ) : (
          <p>&nbsp;</p>
        )
      }
      py={0}
    />
  );
};

export default GuessEditorNavbar;
