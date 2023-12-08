import React, { useState } from 'react';
import DropDownIcon from '@/media/Dropdown.svg';
import AvatarIcon from '@/components/shared/Avatar/AvatarIcon';
import { Guess, User } from '@prisma/client';
import { AvatarConfig } from '@/types/main';
import { defaultAvatar } from '@/models/user.model';
import Link from 'next/link';
import ToggleDropdown from '../shared/ToggleDropdown';

interface LeaderboardInfoProps {
  rankedUserScores: { user: User; points: number; guesses: Guess[] }[];
}

const LeaderboardInfo: React.FC<LeaderboardInfoProps> = ({ rankedUserScores }) => {
  const [openUserIds, setOpenUserIds] = useState<number[]>([]);
  const toggleUser = (userId: number) =>
    setOpenUserIds((ids) => (ids.includes(userId) ? ids.filter((id) => id !== userId) : [...ids, userId]));

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
              {guesses.map((score) => (
                <div key={score.id} className="flex justify-between ">
                  <p className="m-0">
                    {score.songName} {score.encore && score.points > 1 ? ' (e)' : ''}
                  </p>
                  <div className="flex items-center space-x-1">
                    <p className="m-0">{`${score.points} pts`}</p>
                  </div>
                </div>
              ))}
            </div>
          </ToggleDropdown>
        );
      })}
    </div>
  );
};

export default LeaderboardInfo;
