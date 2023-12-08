import LeaderboardInfo from '@/components/scores/Leaderboard';
import ErrorMessage from '@/components/shared/ErrorMessage';
import { RunInfo } from '@/components/shared/RunInfo';
import { ResponseStatus } from '@/types/main';
import { BackArrow } from '@/pages';
import { getGuessesForRun } from '@/services/guess.service';
import { getRunById, getRunWithVenue } from '@/services/run.service';
import { getShowsForRun, getShowsForRunWithVenue } from '@/services/show.service';
import { getUsersByIds } from '@/services/user.service';
import { RankedUserScores, rankedUserScoresForNight, rankScoresByUser } from '@/utils/guess.util';
import { organizeArrayByField, parseObj } from '@/utils/utils';
import { Guess, Run, Show } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { RunWithVenue } from '@/models/run.model';
import { ShowWithVenue } from '@/models/show.model';
import RadioGroup, { RadioOption } from '@/components/shared/RadioGroup';
import { useThemeContext } from '@/store/theme.store';

interface RunScoreContainerProps {
  run?: RunWithVenue;
  shows?: ShowWithVenue[];
  rankedUserScores?: RankedUserScores;
  error?: string;
}

export const getServerSideProps: GetServerSideProps<RunScoreContainerProps> = async (context) => {
  const runId = parseInt(context.params?.runId?.toString() || '');
  if (isNaN(runId)) {
    return {
      props: { error: 'Missing/invalid run id.' },
    };
  }
  let run = await getRunWithVenue(runId);
  if (run === ResponseStatus.NotFound) {
    return {
      props: { error: 'Run not found.' },
    };
  }
  run = JSON.parse(JSON.stringify(run)) as typeof run;
  let shows = await getShowsForRunWithVenue(runId);
  if (shows === ResponseStatus.NotFound) {
    return {
      props: { error: 'Shows not found.' },
    };
  }
  shows = JSON.parse(JSON.stringify(shows)) as typeof shows;
  let guesses = await getGuessesForRun(runId);
  if (guesses === ResponseStatus.NotFound) {
    return {
      props: { error: 'Guesses not found.' },
    };
  }
  guesses = JSON.parse(JSON.stringify(guesses)) as typeof guesses;
  const guessesByUser = organizeArrayByField<Guess>(guesses, 'userId');
  const userIds = Object.keys(guessesByUser).map((user) => parseInt(user));
  let users = await getUsersByIds(userIds);
  if (users === ResponseStatus.NotFound) {
    return {
      props: { error: 'Run not found.' },
    };
  }
  users = JSON.parse(JSON.stringify(users, parseObj)) as typeof users;
  const rankedUserScores = rankScoresByUser(guessesByUser, users);
  return {
    props: { run, shows, rankedUserScores },
  };
};

const RunLeaderboard: React.FC<RunScoreContainerProps> = ({ run, shows, rankedUserScores, error }) => {
  const { status } = useSession();
  const router = useRouter();
  const { night: runNight } = router.query;
  const selectedNight = parseInt(runNight?.toString() || '');
  const { color } = useThemeContext();

  if (error || !run || !shows || !rankedUserScores) {
    return <ErrorMessage error={error} />;
  }

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

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
    <>
      <Head>
        <title>{run.name} - Leaderboard | Go Phish</title>
      </Head>
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
    </>
  );
};

export default RunLeaderboard;
