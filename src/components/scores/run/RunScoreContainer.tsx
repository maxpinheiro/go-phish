import LeaderboardInfo from '@/components/scores/Leaderboard';
import RadioGroup from '@/components/shared/RadioGroup';
import { RunInfo } from '@/components/shared/RunInfo';
import { RunWithVenue } from '@/models/run.model';
import { ShowWithVenue } from '@/models/show.model';
import { RankedUserScores, rankedUserScoresForNight } from '@/utils/guess.util';
import { nightShowsRadioOptions } from '@/utils/show.util';
import { Show } from '@prisma/client';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';

export interface RunScoreContainerProps {
  run: RunWithVenue;
  shows: ShowWithVenue[];
  rankedUserScores: RankedUserScores;
}

function useRunNightQuery() {
  const router = useRouter();
  const { night: runNight } = router.query;
  const selectedNight = parseInt(runNight?.toString() || '');

  const chooseNight = (night: number | string) => {
    if (night === 'total') {
      router.query.night = '';
      router.push(router, undefined, { shallow: true });
    } else if (!isNaN(parseInt(night.toString()))) {
      router.query.night = night.toString();
      router.push(router, undefined, { shallow: true });
    }
  };

  return { selectedNight, chooseNight };
}

const RunScoreContainer: React.FC<RunScoreContainerProps> = ({ run, shows, rankedUserScores }) => {
  const nightRadioOptions = nightShowsRadioOptions(shows);

  const { selectedNight, chooseNight } = useRunNightQuery();

  const nightShow: Show | undefined = useMemo(
    () => shows.find((s) => s.runNight === selectedNight),
    [shows, selectedNight]
  );

  const organizedScores = useMemo(
    () => (isNaN(selectedNight) ? rankedUserScores : rankedUserScoresForNight(rankedUserScores, shows, selectedNight)),
    [rankedUserScores, shows, selectedNight]
  );

  return (
    <div className="flex flex-col w-full items-center pt-4 pb-10">
      <RunInfo run={run} large showLocation />
      <RadioGroup
        options={nightRadioOptions}
        selected={selectedNight}
        select={(nightNumber) => chooseNight(nightNumber)}
        containerClass="mt-4"
      />
      <LeaderboardInfo rankedUserScores={organizedScores} nightShow={nightShow || null} />
    </div>
  );
};

export default RunScoreContainer;
