import LeaderboardInfo from '@/components/scores/Leaderboard';
import { RunInfo } from '@/components/shared/RunInfo';
import BackArrow from '@/components/shared/BackArrow';
import { RankedUserScores, rankedUserScoresForNight } from '@/utils/guess.util';
import { Show } from '@prisma/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { RunWithVenue } from '@/models/run.model';
import { ShowWithVenue } from '@/models/show.model';
import RadioGroup, { RadioOption } from '@/components/shared/RadioGroup';
import { useThemeContext } from '@/store/theme.store';

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
      <div className="flex flex-col items-center pb-4">
        <div className="flex justify-between items-center w-full max-w-500 p-4">
          <div className="flex items-center space-x-2 ">
            <BackArrow
              width={16}
              height={16}
              link="/shows"
              className="cursor-pointer flex items-center space-x-2"
              svgClass="fill-black dark:fill-white"
            >
              <p className="">Shows</p>
            </BackArrow>
          </div>
          <p className="text-2xl font-light">Leaderboard</p>
          <div className="">
            <Link
              href={`/guesses/run/${run.id}${nightShow ? `?night=${nightShow.runNight}` : ''}`}
              className={`text-${color} my-2.5`}
            >
              All Guesses
            </Link>
          </div>
        </div>
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
