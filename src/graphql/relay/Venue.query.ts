import { Venue } from '@prisma/client';
import { graphql } from 'react-relay';
import { VenueFragment$data } from './__generated__/VenueFragment.graphql';

export const VenueFragment = graphql`
  fragment VenueFragment on Venue {
    id
    venueId
    name
    name_abbr
    city
    state
    country
    tz_id
    tz_name
  }
`;

export const formatVenue = (venue: VenueFragment$data): Venue => ({
  ...venue,
  id: venue.venueId,
  name_abbr: venue.name_abbr ?? null,
  city: venue.city ?? null,
  state: venue.state ?? null,
  country: venue.country ?? null,
  tz_name: venue.tz_name ?? null,
});
