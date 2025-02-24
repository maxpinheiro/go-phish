import { ShowWithVenue, ShowWithVenueAndRun } from '@/models/show.model';
import { Show } from '@prisma/client';
import { graphql, useFragment } from 'react-relay';
import { RunFragment, formatRun } from './Run.query';
import { VenueFragment, formatVenue } from './Venue.query';
import { RunFragment$key } from './__generated__/RunFragment.graphql';
import { ShowFragment$data, ShowFragment$key } from './__generated__/ShowFragment.graphql';
import { ShowWithVenueAndRunFragment$key } from './__generated__/ShowWithVenueAndRunFragment.graphql';
import { ShowWithVenueFragment$key } from './__generated__/ShowWithVenueFragment.graphql';
import { VenueFragment$key } from './__generated__/VenueFragment.graphql';

export const ShowFragment = graphql`
  fragment ShowFragment on Show {
    id
    showId
    runId
    runNight
    slug
    date
    timestamp
    venueId
  }
`;

export const formatShow = (show: ShowFragment$data): Show => ({
  ...show,
  id: show.showId,
  date: new Date(show.date),
  timestamp: new Date(show.timestamp),
});

export const ShowWithVenueFragment = graphql`
  fragment ShowWithVenueFragment on Show {
    ...ShowFragment
    venue {
      ...VenueFragment
    }
  }
`;

export const buildShowWithVenueFromFragment = (show: ShowWithVenueFragment$key): ShowWithVenue => {
  const showFragment = useFragment<ShowWithVenueFragment$key>(ShowWithVenueFragment, show);
  const showData = useFragment<ShowFragment$key>(ShowFragment, showFragment);
  const venueData = useFragment<VenueFragment$key>(VenueFragment, showFragment.venue);
  return {
    ...formatShow(showData),
    venue: formatVenue(venueData),
  };
};

export const ShowWithVenueAndRunFragment = graphql`
  fragment ShowWithVenueAndRunFragment on Show {
    ...ShowFragment
    venue {
      ...VenueFragment
    }
    run {
      ...RunFragment
    }
  }
`;

export const buildShowWithVenueAndRunFromFragment = (show: ShowWithVenueAndRunFragment$key): ShowWithVenueAndRun => {
  const showFragment = useFragment<ShowWithVenueAndRunFragment$key>(ShowWithVenueAndRunFragment, show);
  const showData = useFragment<ShowFragment$key>(ShowFragment, showFragment);
  const venueData = useFragment<VenueFragment$key>(VenueFragment, showFragment.venue);
  const runData = useFragment<RunFragment$key>(RunFragment, showFragment.run);
  return {
    ...formatShow(showData),
    venue: formatVenue(venueData),
    run: formatRun(runData),
  };
};
