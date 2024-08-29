import AvatarIcon from '@/components/shared/Avatar/AvatarIcon';
import { GuessWithShow } from '@/models/guess.model';
import { defaultAvatar } from '@/models/user.model';
import { AvatarConfig } from '@/types/main';
import { RankedUserScores } from '@/utils/guess.util';
import { Show } from '@prisma/client';
import Link from 'next/link';
import React from 'react';
import ToggleDropdown from '../shared/ToggleDropdown';

interface LeaderboardGuessItemProps {
  guess: GuessWithShow;
  showRunNight?: boolean;
}

const LeaderboardGuessItem: React.FC<LeaderboardGuessItemProps> = ({ guess, showRunNight }) => (
  <div className="flex justify-between ">
    <a href={`https://www.phish.net/song/${guess.songId}`} target="_blank">
      <p className="m-0">
        {guess.songName} {guess.encore && guess.points > 1 ? ' (e)' : ''}
      </p>
    </a>
    <div className="flex items-center space-x-1">
      {showRunNight ? <p className="m-0 opacity-50">N{guess.show.runNight} •</p> : null}
      <p className="m-0">{`${guess.points} pts`}</p>
    </div>
  </div>
);

interface LeaderboardInfoProps {
  rankedUserScores: RankedUserScores;
  nightShow: Show | null;
}

const LeaderboardInfo: React.FC<LeaderboardInfoProps> = ({ rankedUserScores, nightShow }) => {
  const isRunTotal = nightShow === null;

  if (rankedUserScores.length === 0) {
    return <p className="text-center mt-4">There are no scores for this show yet!</p>;
  }

  return (
    <div
      className="flex flex-col items-centers space-y-4 w-full max-w-500 mx-auto px-5 my-5 border-box"
      id="leaderboard-list"
    >
      {rankedUserScores.map(({ user, points, guesses }, idx) => {
        const avatar = JSON.parse(JSON.stringify(user.avatar)) as AvatarConfig;
        return (
          <ToggleDropdown
            key={`leaderboard-user-${user.id}`}
            header={
              <div className="flex w-full items-center space-x-2">
                <p>{idx + 1}.</p>
                {user.avatar ? (
                  <AvatarIcon type={avatar.type || 'user'} config={avatar} />
                ) : (
                  <AvatarIcon type="user" config={defaultAvatar} />
                )}
                <Link className="ml-1" href={`/users/${user.username}`}>
                  <p>{user.username}</p>
                </Link>
                <div className="flex flex-1 justify-end">
                  <p className="mr-1">{`${points} pts`}</p>
                </div>
              </div>
            }
          >
            <div className="px-5 mr-0.5 space-y-2 mt-3">
              {guesses.map((guess) => (
                <LeaderboardGuessItem guess={guess} key={`score-${guess.id}`} showRunNight={isRunTotal} />
              ))}
            </div>
          </ToggleDropdown>
        );
      })}
    </div>
  );
};

export default LeaderboardInfo;
