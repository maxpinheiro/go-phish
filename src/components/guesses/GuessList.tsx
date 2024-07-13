import { useThemeContext } from '@/store/theme.store';
import { AvatarConfig } from '@/types/main';
import { OrganizedGuesses } from '@/utils/guess.util';
import { Show } from '@prisma/client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useState } from 'react';
import AvatarIcon from '../shared/Avatar/AvatarIcon';
import ToggleDropdown from '../shared/ToggleDropdown';

interface GuessListProps {
  organizedGuesses: OrganizedGuesses;
  nightShow: Show | null;
}

//const resolveGuesses = (organizedGuesses: Record<UserID, {"complete": Guess[], "incomplete": Guess[]}>, users: Record<UserID, User>): {user: User, guesses: {"complete": Guess[], "incomplete": Guess[]}}[];

const GuessList: React.FC<GuessListProps> = ({ organizedGuesses, nightShow }) => {
  //const resolvesGuesses: {user: User, guesses: {"complete": Guess[], "incomplete": Guess[]}}[] = zip(users, organizedGuesses);
  const { color } = useThemeContext();
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const [openUserIds, setOpenUserIds] = useState<number[]>([]);
  const toggleUser = (userId: number) =>
    setOpenUserIds((ids) => (ids.includes(userId) ? ids.filter((id) => id !== userId) : [...ids, userId]));

  if (nightShow && Object.keys(organizedGuesses).length === 0) {
    return (
      <div className="flex flex-col items-center">
        <p className="my-4">There are no guesses for this show yet!</p>
        <Link href={`/guesses/${nightShow.id}/edit`} className="link">
          Add Guesses
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4 w-full max-w-500 mx-auto my-5 px-5 border-box" id="guess-list">
      {currentUserId && !organizedGuesses.some((g) => g.user.id === currentUserId) && nightShow && (
        <Link href={`/guesses/${nightShow.id}/edit`} className="link mt-2">
          Add Your Guesses
        </Link>
      )}
      {Object.values(organizedGuesses).map(({ user, guesses }) => {
        const avatar = JSON.parse(JSON.stringify(user.avatar)) as AvatarConfig;
        return (
          <ToggleDropdown
            key={`guesslist-user-${user.id}`}
            header={
              <div className="flex space-x-2 items-center">
                {user.avatar && <AvatarIcon type={avatar.type || 'user'} config={avatar} />}
                <Link className="ml-5" href={`/users/${user.username}`}>
                  <p>{user.username}</p>
                </Link>
                <p>{`- ${guesses.complete.length}/${guesses.complete.length + guesses.incomplete.length} completed`}</p>
                {currentUserId && currentUserId === user.id && nightShow && (
                  <Link href={`/guesses/${nightShow.id}/edit`} className={`link text-${color}`}>
                    edit
                  </Link>
                )}
              </div>
            }
          >
            <div className="px-5 mt-3" id="user-guesses">
              <div className="flex flex-col space-y-2">
                {guesses.incomplete.map((guess) => (
                  <div key={guess.id}>
                    <a href={`https://www.phish.net/song/${guess.songId}`} target="_blank">
                      <p className="m-0">
                        {guess.songName}
                        {guess.encore ? ' (e)' : ''}
                      </p>
                    </a>
                  </div>
                ))}
              </div>
              {guesses.complete.length > 0 && <div className="divider dark:bg-white dark:bg-opacity-25" />}
              <div className="flex flex-col space-y-2">
                {guesses.complete.map((guess) => (
                  <div key={guess.id}>
                    <a href={`https://www.phish.net/song/${guess.songId}`} target="_blank">
                      <p className="line-through opacity-50 m-0">
                        {guess.songName}
                        {guess.encore ? ' (e)' : ''}
                      </p>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </ToggleDropdown>
        );
      })}
    </div>
  );
};

export default GuessList;
