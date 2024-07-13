import LeaderboardInfo from '@/components/scores/Leaderboard';
import BackLink from '@/components/shared/BackLink';
import RadioGroup, { RadioOption } from '@/components/shared/RadioGroup';
import { RunInfo } from '@/components/shared/RunInfo';
import TitleBar from '@/components/shared/TitleBar';
import { RunWithVenue } from '@/models/run.model';
import { ShowWithVenue } from '@/models/show.model';
import { useThemeContext } from '@/store/theme.store';
import { RankedUserScores, rankedUserScoresForNight } from '@/utils/guess.util';
import { Show } from '@prisma/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

export interface RunScoreContainerProps {
  run: RunWithVenue;
  shows: ShowWithVenue[];
  rankedUserScores: RankedUserScores;
}

const RunScoreContainer: React.FC<RunScoreContainerProps> = ({ run, shows, rankedUserScores }) => {
  const router = useRouter();
  const { night: runNight } = router.query;
  const selectedNight = parseInt(runNight?.toString() || '');
  const { color } = useThemeContext();

  const nightNumbers: number[] = shows.map((show) => show.runNight).sort();
  const nightShow: Show | undefined = shows.find((s) => s.runNight === selectedNight);
  const organizedScores = isNaN(selectedNight)
    ? rankedUserScores
    : rankedUserScoresForNight(rankedUserScores, shows, selectedNight);
  const guessesUrl = `/guesses/run/${run.id}${nightShow ? `?night=${nightShow.runNight}` : ''}`;

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
    value: nightNumber === null ? 'total' : nightNumber,
    label: nightNumber === null ? 'Total' : `Night ${nightNumber}`,
  }));

  return (
    <div id="leaderboard-page">
      <div className="flex flex-col items-center pb-10">
        <TitleBar
          left={<BackLink link="/shows" text="Shows" />}
          center="Leaderboard"
          right={
            <Link href={guessesUrl} className={`text-${color}`}>
              All Guesses
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
        <LeaderboardInfo rankedUserScores={organizedScores} />
      </div>
    </div>
  );
};

export default RunScoreContainer;
