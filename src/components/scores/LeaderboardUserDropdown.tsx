import AvatarIcon from '@/components/shared/Avatar/AvatarIcon';
import ToggleDropdown from '@/components/shared/ToggleDropdown';
import { GuessWithShow } from '@/models/guess.model';
import { defaultAvatar } from '@/models/user.model';
import { AvatarConfig } from '@/types/main';
import { User } from '@prisma/client';
import Link from 'next/link';
import React from 'react';

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

interface LeaderboardUserHeaderProps {
  user: User;
  points: number;
  rank: number;
}

const LeaderboardUserHeader: React.FC<LeaderboardUserHeaderProps> = ({ user, points, rank }) => {
  const avatar = JSON.parse(JSON.stringify(user.avatar)) as AvatarConfig;
  return (
    <div className="flex w-full items-center space-x-2">
      <p>{rank}.</p>
      {user.avatar ? (
        <AvatarIcon type={avatar.type || 'user'} config={avatar} />
      ) : (
        <AvatarIcon type="user" config={defaultAvatar} />
      )}
      <Link className="ml-1" href={`/users/${user.username}`} target="_blank">
        <p>{user.username}</p>
      </Link>
      <div className="flex flex-1 justify-end">
        <p className="mr-1">{`${points} pts`}</p>
      </div>
    </div>
  );
};

interface LeaderboardUserDropdownProps {
  user: User;
  points: number;
  rank: number;
  guesses: GuessWithShow[];
  showRunNight?: boolean;
}

const LeaderboardUserDropdown: React.FC<LeaderboardUserDropdownProps> = ({
  user,
  points,
  rank,
  guesses,
  showRunNight = false,
}) => {
  return (
    <ToggleDropdown header={<LeaderboardUserHeader user={user} points={points} rank={rank} />}>
      <div className="px-5 mr-0.5 space-y-2 mt-3">
        {guesses.map((guess) => (
          <LeaderboardGuessItem guess={guess} key={`score-${guess.id}`} showRunNight={showRunNight} />
        ))}
      </div>
    </ToggleDropdown>
  );
};

export default LeaderboardUserDropdown;
