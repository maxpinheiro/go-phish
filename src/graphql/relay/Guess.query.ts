import { Guess } from '@prisma/client';
import { graphql, useFragment } from 'react-relay';
import { GuessFragment$data, GuessFragment$key } from './__generated__/GuessFragment.graphql';

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
