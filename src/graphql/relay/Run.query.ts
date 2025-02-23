import { Run } from '@prisma/client';
import { graphql } from 'react-relay';
import { RunFragment$data } from './__generated__/RunFragment.graphql';

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
