import { RankedUserScores } from '@/utils/guess.util';
import { Show } from '@prisma/client';
import React from 'react';
import LeaderboardUserDropdown from './LeaderboardUserDropdown';

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
    <div className="flex flex-col items-centers space-y-4 w-full max-w-500 mx-auto my-5 border-box">
      {rankedUserScores.map(({ user, points, guesses }, idx) => (
        <LeaderboardUserDropdown
          user={user}
          points={points}
          rank={idx + 1}
          guesses={guesses}
          showRunNight={isRunTotal}
          key={`leaderboard-user-${user.id}`}
        />
      ))}
    </div>
  );
};

export default LeaderboardInfo;
