import { Venue } from '@prisma/client';

const venueFields = ['name', 'name_abbr', 'city', 'state', 'country', 'tz_id', 'tz_name'];

export const isVenue = (obj: Object): obj is Venue => venueFields.every((f) => obj.hasOwnProperty(f));
