import GuessList from '@/components/guesses/GuessList';
import BackLink from '@/components/shared/BackLink';
import RadioGroup, { RadioOption } from '@/components/shared/RadioGroup';
import { RunInfo } from '@/components/shared/RunInfo';
import TitleBar from '@/components/shared/TitleBar';
import { RunWithVenue } from '@/models/run.model';
import { ShowWithVenue } from '@/models/show.model';
import { useThemeContext } from '@/store/theme.store';
import { organizedGuessesForNight, OrganizedGuessesWithShow } from '@/utils/guess.util';
import { Show } from '@prisma/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

export interface GuessRunContainerProps {
  run: RunWithVenue;
  shows: ShowWithVenue[];
  guesses: OrganizedGuessesWithShow;
}

const GuessRunContainer: React.FC<GuessRunContainerProps> = ({ run, shows, guesses }) => {
  const router = useRouter();
  const { night: runNight } = router.query;
  const selectedNight = parseInt(runNight?.toString() || '');
  const { color } = useThemeContext();
  // TODO: custom hook for selecting/filtering guesses
  const nightNumbers: number[] = shows.map((show) => show.runNight).sort();
  const nightShow: Show | undefined = shows.find((s) => s.runNight === selectedNight);
  const organizedGuesses = isNaN(selectedNight) ? guesses : organizedGuessesForNight(guesses, shows, selectedNight);

  const scoresUrl = `/scores/run/${run.id}${nightShow ? `?night=${nightShow.runNight}` : ''}`;

  const chooseNight = (night: number | string) => {
    if (night === 'total') {
      router.query.night = '';
      router.push(router, undefined, { shallow: true });
    } else if (!isNaN(parseInt(night.toString()))) {
      router.query.night = night.toString();
      router.push(router, undefined, { shallow: true });
    }
  };

  const nightRadioOptions: RadioOption[] = [...nightNumbers, null].map((nightNumber) => ({
    value: nightNumber || 'total',
    label: nightNumber === null ? 'Total' : `Night ${nightNumber}`,
  }));

  return (
    <div className="flex flex-col items-center pb-10">
      <TitleBar
        left={<BackLink link="/shows" text="Shows" />}
        center="Guesses"
        right={
          <Link href={scoresUrl} className={`text-${color}`}>
            Leaderboard
          </Link>
        }
      />
      <RunInfo run={run} large showLocation />
      <RadioGroup
        options={nightRadioOptions}
        selected={selectedNight}
        select={(nightNumber) => chooseNight(nightNumber)}
        containerClass="mt-4"
      />
      <div className="w-full my-1">
        <GuessList organizedGuesses={organizedGuesses} nightShow={nightShow || null} />
      </div>
    </div>
  );
};

export default GuessRunContainer;
