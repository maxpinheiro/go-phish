import { RunWithVenue } from '@/models/run.model';
import { Run } from '@prisma/client';
import { graphql, useFragment } from 'react-relay';
import { VenueFragment, formatVenue } from './Venue.query';
import { RunFragment$data, RunFragment$key } from './__generated__/RunFragment.graphql';
import { RunWithVenueFragment$key } from './__generated__/RunWithVenueFragment.graphql';
import { VenueFragment$key } from './__generated__/VenueFragment.graphql';

export const RunFragment = graphql`
  fragment RunFragment on Run {
    id
    runId
    name
    slug
    dates
    venueId
  }
`;

export const formatRun = (run: RunFragment$data): Run => ({
  ...run,
  id: run.runId,
  dates: run.dates.map((d) => new Date(d)),
});

export const RunWithVenueFragment = graphql`
  fragment RunWithVenueFragment on Run {
    ...RunFragment
    venue {
      ...VenueFragment
    }
  }
`;

export const useRunWithVenueFragment = (run: RunWithVenueFragment$key): RunWithVenue => {
  const runFragment = useFragment<RunWithVenueFragment$key>(RunWithVenueFragment, run);
  const runData = useFragment<RunFragment$key>(RunFragment, runFragment);
  const venueData = useFragment<VenueFragment$key>(VenueFragment, runFragment.venue);
  return {
    ...formatRun(runData),
    venue: formatVenue(venueData),
  };
};
