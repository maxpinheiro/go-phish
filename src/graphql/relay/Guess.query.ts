import { GuessWithRun } from '@/models/guess.model';
import { Guess } from '@prisma/client';
import { graphql, useFragment } from 'react-relay';
import { RunFragment, formatRun } from './Run.query';
import { GuessFragment$data, GuessFragment$key } from './__generated__/GuessFragment.graphql';
import { GuessWithRunFragment$key } from './__generated__/GuessWithRunFragment.graphql';
import { RunFragment$key } from './__generated__/RunFragment.graphql';

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

export const buildGuessFromFragment = (guess: GuessFragment$key): Guess => {
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

export const buildGuessWithRunFromFragment = (guess: GuessWithRunFragment$key): GuessWithRun => {
  const guessFragment = useFragment<GuessWithRunFragment$key>(GuessWithRunFragment, guess);
  const guessData = useFragment<GuessFragment$key>(GuessFragment, guessFragment);
  const runData = useFragment<RunFragment$key>(RunFragment, guessFragment.run);
  return {
    ...formatGuess(guessData),
    run: formatRun(runData),
  };
};

// export const GuessWithShowFragment = graphql`
//   fragment ShowWithVenueFragment on Show {
//     ...ShowFragment
//     venue {
//       ...VenueFragment
//     }
//   }
// `;

// export const buildShowWithVenueFromFragment = (show: ShowWithVenueFragment$key): ShowWithVenue => {
//   const showFragment = useFragment<ShowWithVenueFragment$key>(ShowWithVenueFragment, show);
//   const showData = useFragment<ShowFragment$key>(ShowFragment, showFragment);
//   const venueData = useFragment<VenueFragment$key>(VenueFragment, showFragment.venue);
//   return {
//     ...formatShow(showData),
//     venue: formatVenue(venueData),
//   };
// };
