import { GuessWithRun, GuessWithShowAndUser } from '@/models/guess.model';
import { Guess } from '@prisma/client';
import { graphql, useFragment } from 'react-relay';
import { RunFragment, formatRun } from './Run.query';
import { formatShow } from './Show.query';
import { formatUser } from './User.query';
import { GuessFragment$data, GuessFragment$key } from './__generated__/GuessFragment.graphql';
import { GuessWithRunFragment$key } from './__generated__/GuessWithRunFragment.graphql';
import { GuessesWithShowAndUserFragment$key } from './__generated__/GuessesWithShowAndUserFragment.graphql';
import { RunFragment$key } from './__generated__/RunFragment.graphql';
import { ShowFragment$data } from './__generated__/ShowFragment.graphql';
import { UserFragment$data } from './__generated__/UserFragment.graphql';

export const GuessFragment = graphql`
  fragment GuessFragment on Guess {
    id
    guessId
    userId
    songId
    songName
    showId
    runId
    encore
    completed
    points
  }
`;

export const formatGuess = (guess: GuessFragment$data): Guess => ({
  ...guess,
  id: guess.guessId,
});

export const useGuessFragment = (guess: GuessFragment$key): Guess => {
  const guessData = useFragment<GuessFragment$key>(GuessFragment, guess);
  return formatGuess(guessData);
};

export const GuessWithRunFragment = graphql`
  fragment GuessWithRunFragment on Guess {
    ...GuessFragment
    run {
      ...RunFragment
    }
  }
`;

export const useGuessWithRunFragment = (guess: GuessWithRunFragment$key): GuessWithRun => {
  const guessFragment = useFragment<GuessWithRunFragment$key>(GuessWithRunFragment, guess);
  const guessData = useFragment<GuessFragment$key>(GuessFragment, guessFragment);
  const runData = useFragment<RunFragment$key>(RunFragment, guessFragment.run);
  return {
    ...formatGuess(guessData),
    run: formatRun(runData),
  };
};

export const GuessesWithShowAndUserFragment = graphql`
  fragment GuessesWithShowAndUserFragment on Guess @relay(plural: true) {
    id
    guessId
    userId
    songId
    songName
    showId
    runId
    encore
    completed
    points

    user {
      id
      userId
      username
      name
      bio
      hometown
      email
      image
      admin
      avatar {
        head
        torso
        background
        type
      }
      avatarType
    }

    show {
      id
      showId
      runId
      runNight
      slug
      date
      timestamp
      venueId
    }
  }
`;

export const useGuessesWithShowAndUser = (
  guessesRef: GuessesWithShowAndUserFragment$key | null
): GuessWithShowAndUser[] => {
  const guesses = useFragment<GuessesWithShowAndUserFragment$key>(GuessesWithShowAndUserFragment, guessesRef ?? []);

  return guesses.map((g) => ({
    ...g,
    id: g.guessId,
    user: formatUser(g.user as UserFragment$data),
    show: formatShow(g.show as ShowFragment$data),
  }));
};
